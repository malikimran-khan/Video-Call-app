import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/Message.js";
import CallHistory from "../models/CallHistory.js";
import Group from "../models/Group.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}
const activeCallsMap = {}; // {userId: { peerId, callType, startTime }}

io.on("connection", async (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId != "undefined") {
    userSocketMap[userId] = socket.id;

    // Join group rooms
    try {
      const groups = await Group.find({ members: userId });
      groups.forEach(group => {
        socket.join(group._id.toString());
        console.log(`User ${userId} joined group room: ${group._id}`);
      });
    } catch (err) {
      console.error("Error joining group rooms:", err);
    }
  }

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// ==================== CALL SIGNALING ====================

	// Caller initiates a call
	socket.on("call:initiate", ({ to, callType, offer, callerInfo }) => {
		const receiverSocketId = userSocketMap[to];
		
		// Check if receiver is online
		if (!receiverSocketId) {
			socket.emit("call:user-offline", { userId: to });
			return;
		}

		// Check if receiver is already in a call
		if (activeCallsMap[to]) {
			socket.emit("call:busy", { userId: to });
			return;
		}

		// Check if caller is already in a call
		if (activeCallsMap[userId]) {
			socket.emit("call:already-in-call");
			return;
		}

		// Mark both users as in a call
		activeCallsMap[userId] = { peerId: to, callType, startTime: null };
		activeCallsMap[to] = { peerId: userId, callType, startTime: null };

		// Forward the call to receiver
		io.to(receiverSocketId).emit("call:incoming", {
			from: userId,
			callType,
			offer,
			callerInfo,
		});
	});

	// Receiver answers the call
	socket.on("call:answer", ({ to, answer }) => {
		const callerSocketId = userSocketMap[to];
		if (callerSocketId) {
			// Set start time for both
			const startTime = new Date();
			if (activeCallsMap[userId]) activeCallsMap[userId].startTime = startTime;
			if (activeCallsMap[to]) activeCallsMap[to].startTime = startTime;

			io.to(callerSocketId).emit("call:answered", { from: userId, answer });
		}
	});

	// ICE candidate exchange
	socket.on("call:ice-candidate", ({ to, candidate }) => {
		const targetSocketId = userSocketMap[to];
		if (targetSocketId) {
			io.to(targetSocketId).emit("call:ice-candidate", { from: userId, candidate });
		}
	});

	// Call rejected by receiver
	socket.on("call:reject", async ({ to, callType }) => {
		const callerSocketId = userSocketMap[to];

		// Save call history
		try {
			const callRecord = new CallHistory({
				caller: to,
				receiver: userId,
				callType: callType || "voice",
				status: "declined",
			});
			await callRecord.save();

			// Save call message in chat
			const callMsg = new Message({
				sender: to,
				receiver: userId,
				messageType: "call",
				callType: callType || "voice",
				callStatus: "declined",
				callDuration: 0,
			});
			await callMsg.save();

			// Emit to both users
			if (callerSocketId) {
				io.to(callerSocketId).emit("call:rejected", { from: userId });
				io.to(callerSocketId).emit("newMessage", callMsg);
			}
			socket.emit("newMessage", callMsg);
		} catch (err) {
			console.error("Error saving declined call:", err);
		}

		// Cleanup
		delete activeCallsMap[userId];
		delete activeCallsMap[to];
	});

	// Call ended by either party
	socket.on("call:end", async ({ to, callType }) => {
		const otherSocketId = userSocketMap[to];
		const callData = activeCallsMap[userId];

		let duration = 0;
		if (callData && callData.startTime) {
			duration = Math.round((Date.now() - callData.startTime.getTime()) / 1000);
		}

		// Determine status
		const status = duration > 0 ? "completed" : "missed";

		try {
			// Save call history
			const callRecord = new CallHistory({
				caller: callData?.peerId === to ? userId : to,
				receiver: callData?.peerId === to ? to : userId,
				callType: callType || callData?.callType || "voice",
				status,
				duration,
				startedAt: callData?.startTime,
				endedAt: new Date(),
			});
			await callRecord.save();

			// Save call message in chat
			const callMsg = new Message({
				sender: callData?.peerId === to ? userId : to,
				receiver: callData?.peerId === to ? to : userId,
				messageType: "call",
				callType: callType || callData?.callType || "voice",
				callStatus: status,
				callDuration: duration,
			});
			await callMsg.save();

			// Notify both users
			if (otherSocketId) {
				io.to(otherSocketId).emit("call:ended", { from: userId, duration });
				io.to(otherSocketId).emit("newMessage", callMsg);
			}
			socket.emit("newMessage", callMsg);
		} catch (err) {
			console.error("Error saving call record:", err);
		}

		// Cleanup
		delete activeCallsMap[userId];
		delete activeCallsMap[to];
	});

	// No answer timeout (caller fires this after 30s)
	socket.on("call:no-answer", async ({ to, callType }) => {
		const receiverSocketId = userSocketMap[to];

		try {
			const callRecord = new CallHistory({
				caller: userId,
				receiver: to,
				callType: callType || "voice",
				status: "no_answer",
			});
			await callRecord.save();

			const callMsg = new Message({
				sender: userId,
				receiver: to,
				messageType: "call",
				callType: callType || "voice",
				callStatus: "no_answer",
				callDuration: 0,
			});
			await callMsg.save();

			if (receiverSocketId) {
				io.to(receiverSocketId).emit("call:cancelled", { from: userId });
				io.to(receiverSocketId).emit("newMessage", callMsg);
			}
			socket.emit("newMessage", callMsg);
		} catch (err) {
			console.error("Error saving no_answer call:", err);
		}

		delete activeCallsMap[userId];
		delete activeCallsMap[to];
	});

	// ==================== DISCONNECT ====================

	socket.on("disconnect", async () => {
		console.log("user disconnected", socket.id);

		// If user was in a call, end it
		if (activeCallsMap[userId]) {
			const peerId = activeCallsMap[userId].peerId;
			const callData = activeCallsMap[userId];
			const peerSocketId = userSocketMap[peerId];

			let duration = 0;
			if (callData.startTime) {
				duration = Math.round((Date.now() - callData.startTime.getTime()) / 1000);
			}

			try {
				const callMsg = new Message({
					sender: userId,
					receiver: peerId,
					messageType: "call",
					callType: callData.callType || "voice",
					callStatus: duration > 0 ? "completed" : "missed",
					callDuration: duration,
				});
				await callMsg.save();

				if (peerSocketId) {
					io.to(peerSocketId).emit("call:ended", { from: userId, duration });
					io.to(peerSocketId).emit("newMessage", callMsg);
				}
			} catch (err) {
				console.error("Error handling disconnect call cleanup:", err);
			}

			delete activeCallsMap[peerId];
			delete activeCallsMap[userId];
		}

		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { app, io, server };

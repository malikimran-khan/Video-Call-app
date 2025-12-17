import Message from "../models/Message.js";

// Send a message
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  console.log("api hit")
  try {
    const { receiver, text } = req.body;
    const sender = req.user.id;

    const newMessage = new Message({
      sender,
      receiver,
      text,
    });

    await newMessage.save();

    // Socket.io functionality
    const receiverSocketId = getReceiverSocketId(receiver);
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const senderId = req.user.id; // Logged in user

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: userId },
        { sender: userId, receiver: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

import Message from "../models/Message.js";
import { cloudinary } from "../config/cloudinary.js";

// Send a message
import { getReceiverSocketId, io } from "../socket/socket.js";

import Group from "../models/Group.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiver, text, isGroupChat } = req.body;
    const sender = req.user.id;

    const newMessage = new Message({
      sender,
      receiver,
      text,
      isGroupChat: !!isGroupChat,
    });

    await newMessage.save();

    // Socket.io functionality
    if (isGroupChat) {
      // Broadcast to all group members except sender
      // Note: members should already be in a room matching the group ID
      io.to(receiver).emit("newMessage", newMessage);
    } else {
      const receiverSocketId = getReceiverSocketId(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params; // or groupId
    const senderId = req.user.id;
    const { isGroupChat } = req.query;

    let query;
    if (isGroupChat === "true") {
      query = { receiver: userId, isGroupChat: true };
    } else {
      query = {
        $or: [
          { sender: senderId, receiver: userId },
          { sender: userId, receiver: senderId },
        ],
        isGroupChat: { $ne: true },
      };
    }

    const messages = await Message.find({
      ...query,
      deletedFor: { $ne: senderId },
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const uploadVoice = async (req, res) => {
  try {
    const { receiver, text, isGroupChat } = req.body;
    const sender = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No audio file uploaded" });
    }

    const newMessage = new Message({
      sender,
      receiver,
      text,
      messageType: "voice",
      fileUrl: req.file.path,
      isGroupChat: !!isGroupChat,
    });

    await newMessage.save();

    if (isGroupChat) {
      io.to(receiver).emit("newMessage", newMessage);
    } else {
      const receiverSocketId = getReceiverSocketId(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Voice upload error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const uploadFile = async (req, res) => {
  try {
    const { receiver, isGroupChat } = req.body;
    const sender = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const mime = req.file.mimetype || "";
    let messageType = "document";
    if (mime.startsWith("image/")) messageType = "image";
    else if (mime.startsWith("video/")) messageType = "video";

    const newMessage = new Message({
      sender,
      receiver,
      messageType,
      fileUrl: req.file.path,
      fileName: req.file.originalname || req.file.filename || "file",
      isGroupChat: !!isGroupChat,
    });

    await newMessage.save();

    if (isGroupChat) {
      io.to(receiver).emit("newMessage", newMessage);
    } else {
      const receiverSocketId = getReceiverSocketId(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

import { extractPublicId } from "../utils/cloudinaryUtils.js";

// Delete message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const isSender = String(message.sender) === String(userId);
    const isReceiver = String(message.receiver) === String(userId);

    if (!isSender && !isReceiver) {
      return res.status(403).json({ message: "Not authorized to delete this message" });
    }

    if (isSender) {
      // ===== SENDER DELETE: delete for everyone =====

      // 1. Delete file from Cloudinary if it's a media message
      if (message.fileUrl && message.messageType !== "text") {
        const publicId = extractPublicId(message.fileUrl);
        if (publicId) {
          try {
            // Determine resource_type for Cloudinary
            let resourceType = "image";
            if (message.messageType === "video") resourceType = "video";
            else if (message.messageType === "voice") resourceType = "video"; // audio stored as video in Cloudinary
            else if (message.messageType === "document") resourceType = "raw";

            await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
            console.log(`Cloudinary file deleted: ${publicId}`);
          } catch (cloudErr) {
            console.error("Cloudinary delete error:", cloudErr);
            // Continue even if Cloudinary delete fails
          }
        }
      }

      // 2. Mark message as deleted by sender — clear content
      message.deletedBySender = true;
      message.text = undefined;
      message.fileUrl = undefined;
      message.fileName = undefined;
      await message.save();

      // 3. Notify receiver via socket
      const receiverSocketId = getReceiverSocketId(String(message.receiver));
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageDeleted", {
          messageId: message._id,
          deletedBySender: true,
        });
      }

      return res.status(200).json({
        message: "Message deleted for everyone",
        deletedMessage: message,
      });
    } else {
      // ===== RECEIVER DELETE: hide for this user only =====
      if (!message.deletedFor.includes(userId)) {
        message.deletedFor.push(userId);
        await message.save();
      }

      return res.status(200).json({
        message: "Message deleted for you",
        messageId: message._id,
      });
    }
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

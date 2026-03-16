import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Message from "../models/Message.js";
// ... (rest of imports)

// @desc    Create a new user by Admin
// @route   POST /api/admin/users
// @access  Admin
export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false, // Must verify on first login
      isAdminVerified: true, // Pre-approved by admin
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdminVerified: user.isAdminVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in Admin createUser:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
import CallHistory from "../models/CallHistory.js";
import { cloudinary } from "../config/cloudinary.js";
import { extractPublicId } from "../utils/cloudinaryUtils.js";

// @desc    Get all users (verified and unverified)
// ... (rest of the file)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Find all messages related to this user that have media
    const messagesWithMedia = await Message.find({
      $or: [{ sender: id }, { receiver: id }],
      fileUrl: { $exists: true, $ne: null },
    });

    // 2. Delete media from Cloudinary
    for (const msg of messagesWithMedia) {
      const publicId = extractPublicId(msg.fileUrl);
      if (publicId) {
        try {
          let resourceType = "image";
          if (msg.messageType === "video") resourceType = "video";
          else if (msg.messageType === "voice") resourceType = "video";
          else if (msg.messageType === "document") resourceType = "raw";

          await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        } catch (err) {
          console.error(`Error deleting Cloudinary file ${publicId}:`, err);
        }
      }
    }

    // 3. Delete all messages
    await Message.deleteMany({
      $or: [{ sender: id }, { receiver: id }],
    });

    // 4. Delete call history
    await CallHistory.deleteMany({
      $or: [{ caller: id }, { receiver: id }],
    });

    // 5. Delete User record
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User and all associated data deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// @route   GET /api/admin/users
// @access  Admin (Public for now as requested)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    
    // Normalize users to have id property
    const formattedUsers = users.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      isVerified: user.isVerified,
      isAdminVerified: user.isAdminVerified,
      createdAt: user.createdAt,
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error in Admin getAllUsers:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Verify user by Admin
// @route   PUT /api/admin/users/:id/verify
// @access  Admin (Public for now as requested)
export const verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isAdminVerified = true;
    await user.save();

    res.status(200).json({
      message: "User verified successfully",
      user: {
        id: user._id,
        username: user.username,
        isAdminVerified: user.isAdminVerified,
      }
    });
  } catch (error) {
    console.error("Error in Admin verifyUser:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

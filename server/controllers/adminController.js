import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Message from "../models/Message.js";
import CallHistory from "../models/CallHistory.js";
import Group from "../models/Group.js";
import transporter from "../utils/mailUtils.js";
import { cloudinary } from "../config/cloudinary.js";
import { extractPublicId } from "../utils/cloudinaryUtils.js";

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

// @desc    Delete a user and all associated data
// @route   DELETE /api/admin/users/:id
// @access  Admin
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

// @desc    Get all users (verified and unverified)
// @route   GET /api/admin/users
// @access  Admin
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
// @access  Admin
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

// @desc    Get platform stats for dashboard/settings
// @route   GET /api/admin/stats
// @access  Admin
export const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      verifiedUsers,
      unverifiedUsers,
      totalGroups,
      totalMessages,
      textMessages,
      imageMessages,
      videoMessages,
      voiceMessages,
      documentMessages,
      totalCalls,
      completedCalls,
      missedCalls,
      declinedCalls,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isAdminVerified: true }),
      User.countDocuments({ isAdminVerified: false }),
      Group.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ messageType: "text" }),
      Message.countDocuments({ messageType: "image" }),
      Message.countDocuments({ messageType: "video" }),
      Message.countDocuments({ messageType: "voice" }),
      Message.countDocuments({ messageType: "document" }),
      CallHistory.countDocuments(),
      CallHistory.countDocuments({ status: "completed" }),
      CallHistory.countDocuments({ status: "missed" }),
      CallHistory.countDocuments({ status: "declined" }),
    ]);

    // Recent users (last 5)
    const recentUsers = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const formattedRecent = recentUsers.map((u) => ({
      id: u._id,
      username: u.username,
      email: u.email,
      avatar: u.avatar,
      isAdminVerified: u.isAdminVerified,
      isVerified: u.isVerified,
      createdAt: u.createdAt,
    }));

    res.status(200).json({
      users: { total: totalUsers, verified: verifiedUsers, unverified: unverifiedUsers },
      groups: { total: totalGroups },
      messages: {
        total: totalMessages,
        text: textMessages,
        image: imageMessages,
        video: videoMessages,
        voice: voiceMessages,
        document: documentMessages,
      },
      calls: {
        total: totalCalls,
        completed: completedCalls,
        missed: missedCalls,
        declined: declinedCalls,
      },
      recentUsers: formattedRecent,
    });
  } catch (error) {
    console.error("Error in getStats:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Send broadcast email to all users
// @route   POST /api/admin/broadcast
// @access  Admin
export const sendBroadcast = async (req, res) => {
  try {
    const { type, subject, message, link, userIds } = req.body;

    if (!type || !subject || !message) {
      return res.status(400).json({ message: "Please provide type, subject and message" });
    }

    // Fetch users (either specific IDs or all verified)
    let query = { isVerified: true };
    if (userIds && Array.isArray(userIds) && userIds.length > 0) {
      query._id = { $in: userIds };
    }

    const users = await User.find(query).select("email username");

    if (users.length === 0) {
      return res.status(404).json({ message: userIds ? "Selected users not found or not verified" : "No verified users found to broadcast to" });
    }

    let meetingDetails = "";
    if (type !== "message") {
      const typeLabel = type === "zoom" ? "Zoom Meeting" : type === "google-meet" ? "Google Meet" : "Internal Video Call";
      meetingDetails = `
        <div style="background: #f0f7ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">Meeting Details</h3>
          <p><strong>Type:</strong> ${typeLabel}</p>
          <p><strong>Join Link:</strong> <a href="${link}" style="color: #2563eb; font-weight: bold; text-decoration: underline;">${link}</a></p>
        </div>
      `;
    }

    const emailPromises = users.map((user) => {
      const mailOptions = {
        from: `"iVoice Admin" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: subject,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e1e7f0; border-radius: 12px; color: #334155;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #2563eb; margin: 0;">iVoice Communication</h2>
            </div>
            <p>Hello <strong>${user.username}</strong>,</p>
            <p style="line-height: 1.6;">${message}</p>
            ${meetingDetails}
            <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e1e7f0; text-align: center; font-size: 12px; color: #64748b;">
              <p>This is an automated administrative broadcast from iVoice.</p>
              <p>&copy; ${new Date().getFullYear()} iVoice Video Call App. All rights reserved.</p>
            </div>
          </div>
        `,
      };
      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);

    res.status(200).json({ 
      message: `Broadcast sent successfully to ${users.length} users.`,
      recipientCount: users.length 
    });
  } catch (error) {
    console.error("Error in sendBroadcast:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

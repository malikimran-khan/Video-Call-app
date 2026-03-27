import Group from "../models/Group.js";
import User from "../models/User.js";
import Message from "../models/Message.js";
import { cloudinary } from "../config/cloudinary.js";
import { extractPublicId } from "../utils/cloudinaryUtils.js";

// @desc    Get all groups (Admin view)
// ... (rest of the file)
export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // 1. Find all messages related to this group that have media
    const messagesWithMedia = await Message.find({
      receiver: id,
      isGroupChat: true,
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

    // 3. Delete all group messages
    await Message.deleteMany({
      receiver: id,
      isGroupChat: true,
    });

    // 4. Delete Group record
    await Group.findByIdAndDelete(id);

    res.status(200).json({ message: "Group and all associated messages deleted successfully" });
  } catch (error) {
    console.error("Error in deleteGroup:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// @route   POST /api/groups
// @access  Admin
export const createGroup = async (req, res) => {
  const { name, description, members } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: "Group name is required" });
    }

    // Check if all members are verified
    const verifiedUsers = await User.find({
      _id: { $in: members },
      isAdminVerified: true,
    });

    if (verifiedUsers.length !== members.length) {
      return res.status(400).json({ message: "Only verified members can be added to a group" });
    }

    const group = await Group.create({
      name,
      description,
      admin: req.user?._id || members[0],
      members,
    });

    res.status(201).json(group);
  } catch (error) {
    console.error("Error in createGroup:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Add members to an existing group
// @route   PUT /api/groups/:id/members
// @access  Admin
export const addMembers = async (req, res) => {
  const { members } = req.body;
  const { id } = req.params;

  try {
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if new members are verified
    const verifiedUsers = await User.find({
      _id: { $in: members },
      isAdminVerified: true,
    });

    if (verifiedUsers.length !== members.length) {
      return res.status(400).json({ message: "Only verified members can be added to a group" });
    }

    // Avoid duplicates
    const combinedMembers = [...new Set([...group.members.map(m => m.toString()), ...members])];
    group.members = combinedMembers;
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    console.error("Error in addMembers:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Get groups for the logged-in user
// @route   GET /api/groups/my-groups
// @access  Private
export const getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate("admin", "username email avatar")
      .populate("members", "username email avatar isVerified isAdminVerified");
    res.status(200).json(groups);
  } catch (error) {
    console.error("Error in getUserGroups:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Get all groups (Admin view)
// @route   GET /api/groups
// @access  Admin
export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({})
      .populate("admin", "username email avatar")
      .populate("members", "username email avatar");
    res.status(200).json(groups);
  } catch (error) {
    console.error("Error in getAllGroups:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

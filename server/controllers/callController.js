import CallHistory from "../models/CallHistory.js";

// Get call history for logged-in user
export const getCallHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const calls = await CallHistory.find({
      $or: [{ caller: userId }, { receiver: userId }],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("caller", "username avatar")
      .populate("receiver", "username avatar");

    const total = await CallHistory.countDocuments({
      $or: [{ caller: userId }, { receiver: userId }],
    });

    res.status(200).json({ calls, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

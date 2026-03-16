import mongoose from "mongoose";

const callHistorySchema = new mongoose.Schema(
  {
    caller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    callType: {
      type: String,
      enum: ["voice", "video"],
      required: true,
    },
    status: {
      type: String,
      enum: ["missed", "declined", "completed", "no_answer"],
      required: true,
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    startedAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CallHistory", callHistorySchema);

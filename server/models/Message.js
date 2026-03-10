import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { 
      type: String, 
      required: function() { return this.messageType === "text" && !this.deletedBySender; } 
    },
    messageType: {
      type: String,
      enum: ["text", "voice", "image", "video", "document"],
      default: "text",
    },
    fileUrl: {
      type: String,
    },
    fileName: {
      type: String,
    },
    // Delete support
    deletedBySender: {
      type: Boolean,
      default: false,
    },
    deletedFor: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);

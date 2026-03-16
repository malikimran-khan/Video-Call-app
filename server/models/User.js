import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  avatar: { type: String },
  bio: { type: String, default: "Hey there! I am using iVoice Chat." },
  isVerified: { type: Boolean, default: false }, // Email verification
  isAdminVerified: { type: Boolean, default: false }, // Admin approval
  otp: { type: String },
  otpExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;

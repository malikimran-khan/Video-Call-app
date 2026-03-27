import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import nodemailer from "nodemailer";
import transporter from "../utils/mailUtils.js";
import dotenv from "dotenv";

dotenv.config();

// Login Controller (Secure Cookie-based Auth)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 🔬 Check if verified by admin
    if (!user.isAdminVerified) {
      return res.status(403).json({ message: "Account pending admin approval" });
    }

    // 2️⃣ Check if verified by email - If not, send a fresh OTP
    if (!user.isVerified) {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      // Send Email
      const mailOptions = {
        from: `"iVoice Chat" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your email - iVoice Chat",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
            <h2 style="color: #333; text-align: center;">Verify Your Account</h2>
            <p>Hi ${user.username},</p>
            <p>To continue with your login, please use the following OTP to verify your email address:</p>
            <div style="background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; border-radius: 5px; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #777; font-size: 12px; text-align: center;">This OTP is valid for 10 minutes.</p>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p style="color: #999; font-size: 12px; text-align: center;">If you didn't attempt to log in, please secure your account.</p>
          </div>
        `,
      };
      await transporter.sendMail(mailOptions);

      return res.status(401).json({ message: "verify-otp", email: user.email });
    }

    // 4️⃣ Generate JWT
    const token = generateToken(user._id.toString());

    // 5️⃣ Send safe response with token
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};

// Signup Controller
export const signup = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar,
      otp,
      otpExpires,
    });

    // Send Email
    const mailOptions = {
      from: `"iVoice Chat" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email - iVoice Chat",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
          <h2 style="color: #333; text-align: center;">Welcome to iVoice Chat!</h2>
          <p>Hi ${username},</p>
          <p>Thank you for signing up. Please use the following 6-digit OTP to verify your email address:</p>
          <div style="background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; border-radius: 5px; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #777; font-size: 12px; text-align: center;">This OTP is valid for 10 minutes.</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="color: #999; font-size: 12px; text-align: center;">If you didn't sign up for iVoice, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "User registered. Please check your email for OTP.",
      email: user.email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Verify OTP Controller
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now login." });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id }, isVerified: true }).select("-password"); // Only verified users
    
    // Normalize users to have id property
    const formattedUsers = users.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
    
  }
};

// Logout User
export const logout = (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const { username, avatar, bio } = req.body;
    
    // Find the current user and update fields
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          ...(username && { username }),
          ...(avatar && { avatar }),
          ...(bio !== undefined && { bio }) // Allow empty bio
        } 
      },
      { new: true } // Return updated document
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete User Account
export const deleteAccount = async (req, res) => {
  try {
    // Optionally delete messages where user is sender or receiver (skipped for now to avoid breaking histories)
    // await Message.deleteMany({ $or: [{ sender: req.user.id }, { receiver: req.user.id }] });

    const deletedUser = await User.findByIdAndDelete(req.user.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

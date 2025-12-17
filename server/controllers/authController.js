import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

// Login Controller (Secure Cookie-based Auth)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3️⃣ Generate JWT
    const token = generateToken(user._id.toString());

    // 4️⃣ Send token as HttpOnly Cookie
    res.cookie("access_token", token, {
      httpOnly: true, // ❌ JS cannot access
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 5️⃣ Send safe response (no token in body)
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
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

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select("-password"); // exclude password & current user
    
    // Normalize users to have id property
    const formattedUsers = users.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
    
  }
};

// Logout User
export const logout = (req, res) => {
  try {
    res.cookie("access_token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

import express from "express";

import { login, signup, getAllUsers, logout, verifyOTP, updateProfile, deleteAccount } from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Signup Route
router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/logout", logout);
router.get("/all-users", protect, getAllUsers);

// Profile Management Route
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteAccount);

export default router;

import express from "express";
import { login, signup, getAllUsers, logout } from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Signup Route
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/all-users", protect, getAllUsers);

export default router;

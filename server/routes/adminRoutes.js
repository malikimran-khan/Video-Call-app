import express from "express";
import { getAllUsers, verifyUser, deleteUser, createUser, getStats, sendBroadcast } from "../controllers/adminController.js";
import { getAllGroups, createGroup, deleteGroup } from "../controllers/groupController.js";

const router = express.Router();

// Get all users for admin dashboard
router.get("/users", getAllUsers);

// Verify specific user
router.put("/users/:id/verify", verifyUser);

// Create new user
router.post("/users", createUser);

// Get platform stats
router.get("/stats", getStats);

// Send broadcast
router.post("/broadcast", sendBroadcast);

// Group management (admin)
router.get("/groups", getAllGroups);
router.post("/groups", createGroup);
router.delete("/groups/:id", deleteGroup);

export default router;

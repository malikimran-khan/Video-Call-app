import express from "express";
import { getAllUsers, verifyUser, deleteUser, createUser } from "../controllers/adminController.js";

const router = express.Router();

// Get all users for admin dashboard
router.get("/users", getAllUsers);

// Verify specific user
router.put("/users/:id/verify", verifyUser);

// Create new user
router.post("/users", createUser);

export default router;

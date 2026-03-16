import express from "express";
import { 
  createGroup, 
  addMembers, 
  getUserGroups, 
  getAllGroups,
  deleteGroup
} from "../controllers/groupController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin routes
router.post("/", protect, createGroup); // Need to verify admin role if available
router.put("/:id/members", protect, addMembers);
router.get("/", protect, getAllGroups);
router.delete("/:id", protect, deleteGroup);

// User routes
router.get("/my-groups", protect, getUserGroups);

export default router;

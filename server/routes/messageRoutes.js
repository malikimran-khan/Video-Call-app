import express from "express";
import { sendMessage, getMessages, uploadVoice, uploadFile, deleteMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import { storage, fileStorage } from "../config/cloudinary.js";

const upload = multer({ storage });
const uploadFiles = multer({ storage: fileStorage });
const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:userId", protect, getMessages);
router.post("/upload-voice", protect, upload.single("audio"), uploadVoice);
router.post("/upload-file", protect, uploadFiles.single("file"), uploadFile);
router.delete("/:messageId", protect, deleteMessage);

export default router;

import express from "express";
import { getCallHistory } from "../controllers/callController.js";
import { protect  } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/history", protect , getCallHistory);

export default router;

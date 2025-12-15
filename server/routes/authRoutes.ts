import express from "express";
import { login, signup } from "../controllers/authController.ts";

const router = express.Router();

// Signup Route
router.post("/signup", signup);
router.post('/login' , login)

export default router;

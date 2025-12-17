import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import messageRoute from './routes/messageRoutes.js'
import cors from "cors";
import cookieParser from "cookie-parser";
import { app, server } from "./socket/socket.js";

dotenv.config();
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" })); // For avatar base64
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages" ,messageRoute)
// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

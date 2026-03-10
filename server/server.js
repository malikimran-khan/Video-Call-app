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
// Robust CORS Middleware
const corsOptions = {
  origin: (origin, callback) => {
    // Allow all origins
    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
// app.options("*", cors(corsOptions)); // Removed explicit call to avoid Express 5 wildcard crash

app.use(express.json({ limit: "10mb" })); // For avatar base64
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages" ,messageRoute)
// Error Middleware
app.use(errorHandler);
app.get("/api" , (req , res) => {
  res.send("API is running....")
});
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

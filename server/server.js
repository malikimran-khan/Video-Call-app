import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import messageRoute from './routes/messageRoutes.js'
import callRoutes from './routes/callRoutes.js';
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import serverless from "serverless-http";
import { app, server } from "./socket/socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

// Middleware
// Robust CORS Middleware
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" })); // For avatar base64
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import groupRoutes from "./routes/groupRoutes.js";

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoute);
app.use("/api/calls", callRoutes);
app.use("/api/groups", groupRoutes);

app.get("/api", (req, res) => {
  res.send("API is running....");
});

if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "../client/dist");
  app.use(express.static(clientBuildPath));
  app.get("*", (req, res) => {
    if (req.originalUrl.startsWith("/api")) {
      return res.status(404).json({ message: "API route not found" });
    }
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const handler = serverless(app);

if (!process.env.VERCEL && server) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default handler;

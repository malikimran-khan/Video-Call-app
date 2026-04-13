import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import messageRoute from './routes/messageRoutes.js';
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

let dbReadyPromise = null;
let dbConnected = false;

const startDbConnection = async () => {
  if (dbConnected) return;
  if (!dbReadyPromise) {
    dbReadyPromise = connectDB()
      .then((conn) => {
        dbConnected = true;
        return conn;
      })
      .catch((error) => {
        console.error("MongoDB init error:", error.message);
        return error;
      });
  }
  return dbReadyPromise;
};

const dbMiddleware = async (req, res, next) => {
  if (dbConnected) {
    return next();
  }

  const connectPromise = startDbConnection();
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Database connection timed out")), 2500),
  );

  try {
    const result = await Promise.race([connectPromise, timeoutPromise]);
    if (result instanceof Error) {
      dbReadyPromise = null;
      return next(result);
    }
    return next();
  } catch (error) {
    dbReadyPromise = null;
    return next(error);
  }
};

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

// Health check route - no DB required
app.get("/api", (req, res) => {
  res.send("API is running....");
});

// DB middleware for all other /api routes
app.use("/api", dbMiddleware);

import groupRoutes from "./routes/groupRoutes.js";

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoute);
app.use("/api/calls", callRoutes);
app.use("/api/groups", groupRoutes);

if (!process.env.VERCEL && process.env.NODE_ENV === "production") {
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

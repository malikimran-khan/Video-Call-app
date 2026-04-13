import express from "express";
import dotenv from "dotenv";
import connectDB, { isDbConnected } from "./config/db.js";
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

// Step 1
app.get("/1", (req, res) => { res.send("1"); });
console.log("1");
dotenv.config();

// Step 2
app.get("/2", (req, res) => { res.send("2"); });
console.log("2");
// Start DB connection asynchronously (non-blocking)
connectDB().catch((err) => {
  console.error("Initial DB connection failed:", err.message);
});

// Step 3
app.get("/3", (req, res) => { res.send("3"); });
console.log("3");
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// Step 4
app.get("/4", (req, res) => { res.send("4"); });
console.log("4");
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" })); // For avatar base64
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Step 5
app.get("/5", (req, res) => { res.send("5"); });
console.log("5");
// Health check route - no DB required
app.get("/api", (req, res) => {
  res.send("API is running....");
});

// Step 6
app.get("/6", (req, res) => { res.send("6"); });
console.log("6");
// DB status check route
app.get("/api/db-status", (req, res) => {
  const connected = isDbConnected();
  res.json({
    status: connected ? "connected" : "connecting",
    ready: connected
  });
});

// Step 7
app.get("/7", (req, res) => { res.send("7"); });
console.log("7");
// Middleware to check DB connection for API routes
const requireDb = (req, res, next) => {
  if (isDbConnected()) {
    return next();
  }
  return res.status(503).json({
    message: "Database connection in progress. Please try again in a moment."
  });
};

// Step 8
app.get("/8", (req, res) => { res.send("8"); });
console.log("8");
// Apply DB requirement to all /api routes except health checks
app.use("/api", (req, res, next) => {
  if (req.path === "/" || req.path === "/db-status") {
    return next(); // Skip DB check for health routes
  }
  return requireDb(req, res, next);
});

// Step 9
app.get("/9", (req, res) => { res.send("9"); });
console.log("9");
import groupRoutes from "./routes/groupRoutes.js";

// Step 10
app.get("/10", (req, res) => { res.send("10"); });
console.log("10");
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoute);
app.use("/api/calls", callRoutes);
app.use("/api/groups", groupRoutes);

// Step 11
app.get("/11", (req, res) => { res.send("11"); });
console.log("11");
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

// Step 12
app.get("/12", (req, res) => { res.send("12"); });
console.log("12");
app.use(errorHandler);

// Step 13
app.get("/13", (req, res) => { res.send("13"); });
console.log("13");
const PORT = process.env.PORT || 5000;

// Step 14
app.get("/14", (req, res) => { res.send("14"); });
console.log("14");
const handler = serverless(app);

// Step 15
app.get("/15", (req, res) => { res.send("15"); });
console.log("15");
if (!process.env.VERCEL && server) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Step 16
app.get("/16", (req, res) => { res.send("16"); });
console.log("16");
export default handler;

import express from "express";

const app = express();

// ================================
// 🧪 DEBUG ROUTES ONLY (1 → 16)
// ================================

app.get("/1", (req, res) => res.send("1"));
app.get("/2", (req, res) => res.send("2"));
app.get("/3", (req, res) => res.send("3"));
app.get("/4", (req, res) => res.send("4"));
app.get("/5", (req, res) => res.send("5"));
app.get("/6", (req, res) => res.send("6"));
app.get("/7", (req, res) => res.send("7"));
app.get("/8", (req, res) => res.send("8"));
app.get("/9", (req, res) => res.send("9"));
app.get("/10", (req, res) => res.send("10"));
app.get("/11", (req, res) => res.send("11"));
app.get("/12", (req, res) => res.send("12"));
app.get("/13", (req, res) => res.send("13"));
app.get("/14", (req, res) => res.send("14"));
app.get("/15", (req, res) => res.send("15"));
app.get("/16", (req, res) => res.send("16"));

// ================================
// ❌ ORIGINAL BACKEND (COMMENTED)
// ================================

/*

import dotenv from "dotenv";
import connectDB, { isDbConnected } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import messageRoute from "./routes/messageRoutes.js";
import callRoutes from "./routes/callRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import serverless from "serverless-http";
import { app as socketApp, server } from "./socket/socket.js";
import groupRoutes from "./routes/groupRoutes.js";

// ================= CONFIG =================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// ================= DB CONNECTION =================

connectDB().catch((err) => {
  console.error("Initial DB connection failed:", err.message);
});

// ================= MIDDLEWARE =================

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================= HEALTH CHECK =================

app.get("/api", (req, res) => {
  res.send("API is running....");
});

// ================= ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoute);
app.use("/api/calls", callRoutes);
app.use("/api/groups", groupRoutes);

// ================= STATIC (PROD) =================

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

// ================= ERROR HANDLER =================

import { errorHandler } from "./middleware/errorMiddleware.js";
app.use(errorHandler);

// ================= SERVERLESS =================

const PORT = process.env.PORT || 5000;

const handler = serverless(app);

if (!process.env.VERCEL && server) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default handler;

*/

// ================================
// 🚀 EXPORT (DEBUG MODE)
// ================================

export default app;
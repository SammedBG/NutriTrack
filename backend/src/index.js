import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Connect DB
connectDB();

// Middleware
app.use(helmet());
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// CORS - allow frontend origin (adjust in .env)
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
}));

// Rate limiter (basic)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per window
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);

// Simple protected test route
import requireAuth from "./middleware/auth.js";
app.get("/api/protected", requireAuth, (req, res) => {
  res.json({ ok: true, userId: req.userId, message: "Protected route access granted." });
});

// Global error handler (simple)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

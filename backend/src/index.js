import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import mealRoutes from "./routes/meals.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS with credentials
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
}));

// Basic request logging
app.use(morgan("dev"));

// Rate limiter for auth endpoints
const authLimiter = rateLimit({ windowMs: 60*1000, max: 10, message: "Too many requests" });
app.use("/api/auth", authLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/meals", mealRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use(errorHandler);

(async function start() {
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
})();

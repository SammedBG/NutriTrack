import express from "express";
import { body } from "express-validator";
import { register, login, logout, me } from "../controllers/authcontroller.js";
import requireAuth from "../middleware/auth.js";

const router = express.Router();

// Register
router.post(
  "/register",
  [
    body("name").isLength({ min: 2 }).withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 chars"),
  ],
  register
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").exists().withMessage("Password required"),
  ],
  login
);

// Logout (clears cookie)
router.post("/logout", requireAuth, logout);

// Get current user
router.get("/me", requireAuth, me);

export default router;

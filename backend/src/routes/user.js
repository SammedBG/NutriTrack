import express from "express";
import { body } from "express-validator";
import requireAuth from "../middleware/auth.js";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", requireAuth, getProfile);

router.put("/profile",
  requireAuth,
  [
    body("name").optional().isLength({ min: 2 }),
    body("age").optional().isInt({ min: 5, max: 120 }),
    body("height").optional().isFloat({ min: 50, max: 260 }),
    body("weight").optional().isFloat({ min: 20, max: 500 }),
    body("gender").optional().isIn(["male","female","other"])
  ],
  updateProfile
);

export default router;

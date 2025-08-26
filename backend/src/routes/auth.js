import express from "express";
import { body } from "express-validator";
import { register, login, me, logout } from "../controllers/authcontroller.js";
const router = express.Router();

router.post("/register",
  body("name").isLength({ min: 2 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  register
);

router.post("/login", login);
router.get("/me", me);
router.post("/logout", logout);

export default router;

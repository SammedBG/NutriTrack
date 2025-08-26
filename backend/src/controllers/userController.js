import { validationResult } from "express-validator";
import User from "../models/User.js";

export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.userId).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) { next(err); }
}

export async function updateProfile(req, res, next) {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });

    // whitelist fields
    const allowed = ["name","age","gender","height","weight","activityLevel","timezone","goals"];
    const update = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) update[field] = req.body[field];
    }

    const user = await User.findByIdAndUpdate(req.userId, { $set: update }, { new: true }).select("-passwordHash");
    res.json({ user });
  } catch (err) { next(err); }
}

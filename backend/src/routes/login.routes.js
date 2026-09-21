import express from "express";
import { User } from "../models/User.js";
import { login } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already in use" });

    const user = await User.create({ name, email, role });
    res.status(201).json({
      id: user._id,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", login);

export default router;
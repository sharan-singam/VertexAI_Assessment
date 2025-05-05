import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed });
    await user.save();
    res.status(201).json({ msg: "Registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/authController.js
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }

  const today = new Date().toDateString();
  const lastLoginDate = user.lastLogin?.toDateString();

  if (today !== lastLoginDate) {
    user.credits += 10; // Daily login bonus
    user.lastLogin = new Date();
    user.activityLog.push(`Logged in on ${today} (+10 credits)`);
    await user.save();
  }

  res.json({ msg: "Login successful", user });
};


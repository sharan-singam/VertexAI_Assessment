// routes/adminAuthRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';

const router = express.Router();

// Admin Registration
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ msg: 'Admin already exists' });
    }

    // Hash password and save new admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    res.status(201).json({ msg: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error during admin registration' });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ msg: 'Admin does not exist' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = {
      adminId: admin._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ msg: 'Server error during admin login' });
  }
});

export default router;

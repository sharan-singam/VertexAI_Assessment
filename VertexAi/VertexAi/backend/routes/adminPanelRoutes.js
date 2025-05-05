// routes/adminPanelRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Assuming User is the main user model

const router = express.Router();

// Middleware to verify Admin token
const verifyAdmin = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded.adminId;  // Storing admin's ID in request object
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Admin Panel - Get all users and their saved feeds
router.get('/users', verifyAdmin, async (req, res) => {
    try {
      const users = await User.find().populate('savedFeeds');
      res.json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ msg: 'Error fetching users data', error: err.message });
    }
  });
  

export default router;

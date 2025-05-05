// routes/adminRoutes.js
import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { isAdmin, authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get All Users (for Admin)
router.get("/users", authenticateToken,isAdmin,async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch users" });
  }
});

// Update Credits (for Admin)
router.post("/update-credits", authenticateToken, isAdmin, async (req, res) => {
  const { userId, credits } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.credits = credits;
    await user.save();
    res.json({ msg: "Credits updated successfully", user });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update credits" });
  }
});
// routes/adminRoutes.js

// Admin dashboard endpoint to get user analytics and feed activity
router.get('/api/admin/dashboard', authenticateToken, async (req, res) => {
  try {
      // Check if the user is an admin
      const adminUser = await User.findById(req.user._id);
      if (!adminUser || !adminUser.isAdmin) {  // Check if user is admin
          return res.status(403).send({ message: 'You are not authorized to view this' });
      }

      const users = await User.find().populate('savedFeeds');
      const feeds = await Feed.find(); // Assuming you have a Feed model to track feeds

      const userAnalytics = users.map(user => ({
          username: user.username,
          credits: user.credits,
          savedFeedsCount: user.savedFeeds.length
      }));

      const feedAnalytics = feeds.map(feed => ({
          title: feed.title,
          savedByCount: feed.savedBy.length
      }));

      res.status(200).send({
          userAnalytics,
          feedAnalytics
      });
  } catch (error) {
      console.error('Error fetching admin dashboard:', error);
      res.status(500).send({ message: 'Failed to fetch admin dashboard' });
  }
});
// Get all users with their saved posts
router.get("/saved-posts-by-users", authenticateToken, isAdmin, async (req, res) => {
  try {
    // Get all posts with savedBy populated
    const posts = await Post.find().populate("savedBy");

    // Group posts by user
    const grouped = {};

    posts.forEach(post => {
      const users = Array.isArray(post.savedBy) ? post.savedBy : [post.savedBy];

      users.forEach(user => {
        if (!grouped[user._id]) {
          grouped[user._id] = {
            name: user.name,
            email: user.email,
            savedPosts: []
          };
        }
        grouped[user._id].savedPosts.push({
          title: post.title,
          link: post.link
        });
      });
    });

    res.json(Object.values(grouped));
  } catch (err) {
    console.error("Failed to fetch saved posts by users:", err);
    res.status(500).json({ message: "Failed to fetch data" });
  }
});
export default router;

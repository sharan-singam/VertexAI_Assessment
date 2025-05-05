import express from 'express';
import Post from '../models/Post.js'; // Adjust the path if necessary
import { saveFeedController } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// API endpoint to save a post
router.post('/save-feed', authenticateToken, saveFeedController, async (req, res) => {
  const { title, link, savedBy } = req.body;

  try {
    const newPost = new Post({ title, link, savedBy });
    await newPost.save();
    res.status(200).json({ message: 'Post saved successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save post.' });
  }
});

// API endpoint to get all saved posts (for User and Admin)
// Route for getting saved posts (based on user authentication)
// GET /api/post/saved-posts
// Example route
router.get('/saved-posts', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id; // Assuming your middleware sets req.user
      const posts = await Post.find({ savedBy: req.user._id });
// or whatever model you're using
      res.json(posts);
    } catch (err) {
      console.error("Error in /saved-posts:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  
export default router;

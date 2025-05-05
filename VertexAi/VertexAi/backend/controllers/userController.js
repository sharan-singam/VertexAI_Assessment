// controllers/userController.js
import User from "../models/User.js";
import Feed from '../models/Feed.js';
import Post from '../models/Post.js'; // ✅ Required!

const completeProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (!user.profileCompleted) {
      user.profileCompleted = true;
      user.credits += 20;
      user.activityLog.push("Completed profile (+20 credits)");
      await user.save();
      return res.json({ msg: "Profile completed", credits: user.credits });
    }

    res.json({ msg: "Profile already completed" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const saveFeedController = async (req, res) => {
  try {
    const { title, link } = req.body;
    const savedBy = req.user.id || req.user._id;
    if (!title || !link || !savedBy) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newPost = new Post({ title, link, savedBy });
    await newPost.save();

    res.status(200).json({ message: 'Post saved successfully!' });
  } catch (error) {
    console.error('Error saving feed:', error);
    res.status(500).json({ error: 'Failed to save post.' });
  }
};

const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedFeeds');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      credits: user.credits,
      activityLog: user.activityLog,
      savedFeeds: user.savedFeeds,
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
export { completeProfile, saveFeedController, getDashboard };
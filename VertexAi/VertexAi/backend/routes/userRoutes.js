// routes/userRoutes.js
import express from "express";
import { completeProfile, getDashboard } from "../controllers/userController.js";
import { saveFeedController } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import User from '../models/User.js'; // Add this line if missing
import Feed from "../models/Feed.js";

const router = express.Router();

router.post("/complete-profile", authenticateToken, completeProfile);
// router.post('/save-feed', authenticateToken,saveFeedController, async (req, res) => {
//     const { title, link } = req.body;  // Change `url` to `link`

//     if (!title || !link) {
//         return res.status(400).send({ message: "Title and link are required" });
//     }

//     try {
//         const user = await User.findById(req.user._id);
//         if (!user) {
//             return res.status(404).send({ message: "User not found" });
//         }

//          const newFeed = new Feed({
//             title,
//             link,
//             userId: user._id,
//             savedBy: user.name || user.email, // <- Save name or email
//         });

//         await newFeed.save();

//         user.savedFeeds.push(newFeed._id);
//         await user.save();

//         res.status(200).send({ message: 'Feed saved successfully', savedFeeds: user.savedFeeds });
//     } catch (error) {
//         console.error('Error saving feed:', error);
//         res.status(500).send({ message: 'Failed to save feed' });
//     }
// });
// routes/userRoutes.js

// User dashboard endpoint to get user data
// Backend: In the user dashboard route
router.get('/dashboard', authenticateToken, getDashboard, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('savedFeeds');
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const userData = {
            credits: user.credits || 0,
            savedFeeds: user.savedFeeds,
            recentActivity: user.recentActivity || [],
            isAdmin: user.isAdmin, // Add isAdmin here
        };

        res.status(200).send(userData);
    } catch (error) {
        console.error('Error fetching user dashboard:', error);
        res.status(500).send({ message: 'Failed to fetch user dashboard' });
    }
});


export default router;

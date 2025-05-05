import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import redditRoutes from './routes/reddit.js'; 
import userRoutes from "./routes/userRoutes.js";
import { authRoutes, authenticateToken } from "./routes/auth.js";
import { completeProfile, saveFeedController } from "./controllers/userController.js";
import Post from './models/Post.js';
import creditRoutes from './routes/creditRoutes.js';
import adminRoutes from "./routes/adminRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import postRoutes from "./routes/postRoutes.js";
dotenv.config();
const app = express();

app.use('/api/reddit', redditRoutes);
// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/user', userRoutes);      // Must come before postRoutes
app.use('/api/post', postRoutes);
app.use('/api/credits', creditRoutes); 
// Routes
app.use('/api/auth', authRoutes);
// Protected Routes
app.post('/api/user/save-feed', authenticateToken, saveFeedController);
app.post('/api/user/complete-profile', authenticateToken, completeProfile);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminAuthRoutes);
// Save a Post
app.post('/api/savePost', async (req, res) => {
  const { postId, content } = req.body;
  try {
    const post = new Post({ postId, content });
    await post.save();
    res.status(200).send('Post saved');
  } catch (err) {
    res.status(500).send('Error saving post');
  }
});

// Report a Post
app.post('/api/reportPost', async (req, res) => {
  const { postId } = req.body;
  try {
    await Post.findOneAndUpdate({ postId }, { reported: true });
    res.status(200).send('Post reported');
  } catch (err) {
    res.status(500).send('Error reporting post');
  }
});

// DB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected successfully");
}).catch((err) => {
  console.error("MongoDB connection failed:", err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export default app;

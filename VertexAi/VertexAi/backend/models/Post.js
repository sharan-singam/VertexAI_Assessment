import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  savedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);
export default Post;

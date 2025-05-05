import React, { useEffect, useState } from "react";
import axios from "axios";
import './FeedAggregrator.css';
// Decode JWT
const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
};

const FeedAggregator = ({ mode = "feed" }) => {
  const [redditPosts, setRedditPosts] = useState([]);
  const [devtoPosts, setDevtoPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [subreddit, setSubreddit] = useState("reactjs");

  const token = localStorage.getItem("token");

  const fetchRedditPosts = async () => {
    if (!subreddit || subreddit.trim().length < 2) {
      alert("Please enter a valid subreddit name.");
      return;
    }
    try {
      const res = await fetch(`https://www.reddit.com/r/${subreddit}/top.json?limit=5`);
      if (!res.ok) throw new Error(`Subreddit not found: r/${subreddit}`);
      const data = await res.json();

      const posts = data.data.children.map((post) => ({
        id: post.data.id,
        title: post.data.title,
        url: "https://reddit.com" + post.data.permalink,
        source: "Reddit",
        subreddit: post.data.subreddit,
      }));

      setRedditPosts(posts);
    } catch (err) {
      console.error("Error fetching Reddit posts:", err);
      alert(`🚫 Could not fetch posts from r/${subreddit}.`);
    }
  };

  const fetchDevtoPosts = async () => {
    try {
      const res = await fetch("https://dev.to/api/articles?tag=webdev&per_page=5");
      const data = await res.json();

      const posts = data.map((article) => ({
        id: article.id,
        title: article.title,
        url: article.url,
        source: "Dev.to",
        author: article.user.name,
      }));

      setDevtoPosts(posts);
    } catch (err) {
      console.error("Error fetching Dev.to posts:", err);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/post/saved-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedPosts(res.data);
    } catch (err) {
      console.error("Error fetching saved posts:", err);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
    if (mode === "feed") {
      fetchRedditPosts();
      fetchDevtoPosts();
    }
  }, [subreddit, mode]);

  const handleSubredditChange = (e) => setSubreddit(e.target.value);

  const savePost = async (post) => {
    if (!token) return alert("Please login to save posts.");

    const { username } = decodeJWT(token);
    try {
      await axios.post("http://localhost:5000/api/post/save-feed", {
        title: post.title,
        link: post.url,
        savedBy: username,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Post saved!");
      fetchSavedPosts();
    } catch (error) {
      console.error("Error saving feed:", error.message);
    }
  };

  const handleShare = (url) => {
    navigator.clipboard.writeText(url);
    alert("📋 Link copied!");
  };

  const handleReport = (title) => {
    alert(`⚠️ Reported post: ${title}`);
  };

  const allPosts = [...redditPosts, ...devtoPosts];

  return (
    <div className="feed-container">
  {mode === "feed" && (
    <div className="flex justify-between items-center mb-4">
      <input
        type="text"
        value={subreddit}
        onChange={handleSubredditChange}
        placeholder="Enter Subreddit"
        className="border p-2 rounded"
      />
      <button onClick={fetchRedditPosts}>
        Fetch Posts
      </button>
    </div>
  )}

  {mode === "feed" && (
    <div className="feed-posts">
      {allPosts.map((post, index) => (
        <div key={index} className="feed-post-item">
          <a href={post.url} target="_blank" rel="noopener noreferrer">
            {post.title}
          </a>
          <p className="text-sm text-gray-500">
            Source: {post.source} {post.subreddit && `(r/${post.subreddit})`} {post.author && `by ${post.author}`}
          </p>
          <div className="post-actions">
            <button
              className="save-button"
              onClick={() => savePost(post)}
            >
              💾 Save
            </button>
            <button
              className="share-button"
              onClick={() => handleShare(post.url)}
            >
              📋 Share
            </button>
            <button
              className="report-button"
              onClick={() => handleReport(post.title)}
            >
              🚩 Report
            </button>
          </div>
        </div>
      ))}
    </div>
  )}


{token && mode === "saved" && (
  <div className="saved-posts-container">
    <h2 className="text-xl font-semibold mb-2">🔖 Saved Posts</h2>
    {savedPosts.length === 0 ? (
      <p className="no-saved-posts">No saved posts yet.</p>
    ) : (
      <ul className="space-y-2">
        {savedPosts.map((post, index) => (
          <li key={index} className="saved-post-item">
            <a href={post.link} target="_blank" rel="noopener noreferrer">
              {post.title}
            </a>
            <p>Saved by you. Click to view more.</p>
          </li>
        ))}
      </ul>
    )}
  </div>
)}

    </div>
  );
};

export default FeedAggregator;

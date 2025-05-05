import React, { useState, useEffect } from "react";
import FeedAggregator from '../components/FeedAggregator';
import axios from "axios"; // Add axios to make API requests
import './Dashboard.css';
const Dashboard = () => {
  const [tab, setTab] = useState("user");
  const [user, setUser] = useState(null); // State for user data
  const [creators, setCreators] = useState([]); // State to manage creators' data
  const [feeds, setFeeds] = useState([]); // State for saved feeds
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch user data from backend
  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/user/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Expected JSON, got HTML:", text);
          return;
        }
        const data = await response.json();
        console.log("Fetched user data:", data);
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    }
    
    fetchUserData();
  }, []);

  // Fetch saved feeds from backend
  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store token in local storage
        const res = await axios.get('http://localhost:5000/api/post/saved-feeds', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFeeds(res.data);
      } catch (error) {
        console.error("Error fetching saved feeds:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  // Fetch creator data for Admin Dashboard (optional)
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const res = await axios.get('/api/creators');  // Adjust this API endpoint as needed
        setCreators(res.data);
      } catch (err) {
        console.error("Error fetching creators data:", err);
      }
    };

    fetchCreators();
  }, []);

  function UserDashboard() {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Welcome to Dashboard</h1>
        <FeedAggregator feeds={feeds} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 p-6 font-sans">
      <h1 className="text-4xl font-bold text-white text-center mb-8">👑 VertxAI Creator Dashboard</h1>

      <div className="flex justify-center gap-6 mb-8">
        <button
          onClick={() => setTab("user")}
          className={`px-6 py-3 rounded-full transition-all duration-300 ${tab === "user" ? "bg-blue-600 text-white shadow-xl" : "bg-gray-200 text-gray-800 hover:bg-blue-500"}`}
        >
          👤 User Dashboard
        </button>
        <button
          onClick={() => setTab("admin")}
          className={`px-6 py-3 rounded-full transition-all duration-300 ${tab === "admin" ? "bg-green-600 text-white shadow-xl" : "bg-gray-200 text-gray-800 hover:bg-green-500"}`}
        >
          🛠 Admin Dashboard
        </button>
        <button
          onClick={() => setTab("feed")}
          className={`px-6 py-3 rounded-full transition-all duration-300 ${tab === "feed" ? "bg-purple-600 text-white shadow-xl" : "bg-gray-200 text-gray-800 hover:bg-purple-500"}`}
        >
          🧠 Feed Aggregator
        </button>
        <button
          onClick={() => setTab("credits")}
          className={`px-6 py-3 rounded-full transition-all duration-300 ${tab === "credits" ? "bg-yellow-600 text-white shadow-xl" : "bg-gray-200 text-gray-800 hover:bg-yellow-500"}`}
        >
          💰 Credit System
        </button>
      </div>

      {/* 👥 User Dashboard */}
      {tab === "user" && (
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6">Welcome, Creator!</h2>
          <p className="text-xl mb-4">🎯 Credits: <strong>{user?.credits || 0}</strong></p>
          <p className="text-xl mb-4">🔗 Linked Accounts: Reddit ✅</p>
          {loading ? <p className="text-lg text-gray-500">Loading saved feeds...</p> : <FeedAggregator mode="saved" />}
        </div>
      )}

      {/* 📊 Admin Dashboard */}
      {tab === "admin" && (
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6">Admin Panel</h2>
          <ul className="space-y-4">
            {creators.map((creator, i) => (
              <li key={i} className="border p-6 rounded-xl shadow-md transition-transform transform hover:scale-105">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold">{creator.name}</span>
                  <span className="text-lg">Credits: {creator.credits}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Saved Posts: {creator.savedFeeds.length}</p>
                <p className="text-sm text-gray-500 mt-2">Last Login: {new Date().toDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🧠 Feed Aggregator */}
      {tab === "feed" && (
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6">Reddit Feed</h2>
          {loading ? <p className="text-lg text-gray-500">Loading feeds...</p> : <FeedAggregator feeds={feeds} />}
        </div>
      )}

      {/* 💰 Credit System */}
      {tab === "credits" && user && (
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6">Your Credits</h2>
          <p className="text-xl mb-4">💳 Available: <strong>{user.credits}</strong> credits</p>

          <h3 className="mt-4 font-bold">Recent Activity:</h3>
          <ul className="list-disc ml-6 text-sm text-gray-600">
            {user.activityLog?.slice(-5).reverse().map((log, idx) => (
              <li key={idx}>{log}</li>
            ))}
          </ul>

          <h3 className="mt-4 font-bold">Saved Posts:</h3>
          <ul className="list-disc ml-6 text-sm text-gray-600">
            {user.savedFeeds?.slice(-3).map((post, idx) => (
              <li key={idx}><a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{post.title}</a></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

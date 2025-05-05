import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("/api/admin/saved-posts-by-users")
      .then(res => setUserPosts(res.data))
      .catch(err => {
        console.error("Failed to load saved posts:", err);
        setError("Failed to load saved posts.");
      });
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (userPosts.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold">📌 Users and Their Saved Posts</h2>
      {userPosts.map((user, idx) => (
        <div key={idx} className="mb-4">
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <ul className="list-disc ml-5">
            {user.savedPosts.map((post, i) => (
              <li key={i}>
                <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  {post.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;

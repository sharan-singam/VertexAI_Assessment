import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LinkedInFeed() {
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    const accessToken = 'YOUR_ACCESS_TOKEN'; // Replace with your actual access token
    axios.get('https://api.linkedin.com/v2/shares?q=owners&owners=urn:li:organization:YOUR_ORG_ID', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    })
      .then(response => {
        setPosts(response.data.elements);
      })
      .catch(error => {
        console.error('Error fetching LinkedIn posts:', error);
      });
  }, []);

  const handleSavePost = (post) => {
    setSavedPosts([...savedPosts, post]);
    alert('Post saved!');
  };

  const handleSharePost = (post) => {
    const postLink = `https://www.linkedin.com/posts/${post.activity}`;
    navigator.clipboard.writeText(postLink)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => alert('Failed to copy the link.'));
  };

  return (
    <div>
      <h2>LinkedIn Feed</h2>
      <ul>
        {posts.map(post => (
          <li key={post.activity}>
            <p>{post.text && post.text.text}</p>
            <div>
              <button onClick={() => handleSavePost(post)}>Save</button>
              <button onClick={() => handleSharePost(post)}>Share</button>
            </div>
          </li>
        ))}
      </ul>

      <h3>Saved Posts:</h3>
      <ul>
        {savedPosts.map((post, index) => (
          <li key={index}>{post.text && post.text.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default LinkedInFeed;

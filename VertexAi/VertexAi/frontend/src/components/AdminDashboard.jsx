import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('adminToken'); // Get admin token from localStorage

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.get('/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the Authorization header
          },
        });
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to fetch users:', err.response ? err.response.data : err);
      }
    };

    fetchUsers();
  }, [token]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            <p>{user.name}</p>
            <p>Saved Feeds: {user.savedFeeds.length}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;

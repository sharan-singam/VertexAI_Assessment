// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard"); // or wherever your dashboard is
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          onChange={handleChange}
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

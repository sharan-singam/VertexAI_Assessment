// src/pages/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", form);
      alert(response.data.message);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          className="w-full border p-2"
          onChange={handleChange}
          required
        />
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
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;

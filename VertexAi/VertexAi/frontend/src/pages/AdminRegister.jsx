import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminRegister() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/admin/register", formData);
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin");
    } catch (err) {
      alert("Registration failed: " + err.response?.data?.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Admin Registration</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" required onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

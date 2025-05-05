import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import './Navbar.css';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null); // clear state on logout
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo">
        👑 Creator Dashboard
      </Link>

      {/* Links */}
      <div className="nav-links">
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/feed">Feed</Link>
            <Link to="/saved-posts">Saved</Link>
            <Link to="/admin/login">Admin Dashboard</Link>

            {/* {user.role === "admin" && <Link to="/admin">Admin</Link>} */}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

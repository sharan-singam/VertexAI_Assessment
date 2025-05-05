import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import FeedAggregator from "../src/components/FeedAggregator";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register"; // new line
import Dashboard from "../src/pages/Dashboard"; // assuming it's now uncommented
import AdminLogin from "../src/pages/AdminLogin";
import AdminRegister from "../src/pages/AdminRegister";
import AdminDashboard from "../src/components/AdminDashboard";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* New Register Route */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/feed" element={<FeedAggregator mode="feed" />} />
        <Route path="/saved-posts" element={<FeedAggregator mode="saved" />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* <Route path="/admin" element={<Admin />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

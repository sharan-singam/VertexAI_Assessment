import jwt from "jsonwebtoken";
import Admin from '../models/adminModel.js';
const JWT_SECRET = "thalapathy22";
// middleware/authMiddleware.js
export const isAdmin = async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      if (user && user.isAdmin) {
        next();
      } else {
        res.status(403).json({ message: "Access denied. Not an admin." });
      }
    } catch (err) {
      res.status(500).json({ message: "Admin check failed" });
    }
  };
  
export const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
      return res.status(401).send({ message: "Access denied, no token provided" });
  }

  console.log("Received token:", token); // Log the token

  jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
          return res.status(403).send({ message: "Invalid or expired token" });
      }
      req.user = user;
      next();
  });
};

export const verifyAdminToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id);
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid Token" });
  }
};

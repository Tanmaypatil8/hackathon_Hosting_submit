// src/middleware/authMiddleware.js

import jwt from "jsonwebtoken";
import prisma from "../utils/prismaClient.js";

export const protect = async (req, res, next) => {
  try {
    if (!req.headers.authorization?.startsWith("Bearer")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = req.headers.authorization.split(" ")[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get complete user data
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          role: true,
          name: true,
          email: true
        }
      });

      if (!user) {
        console.error(`User not found for id: ${decoded.id}`);
        return res.status(401).json({ message: "User not found" });
      }

      console.log("✅ Authenticated user:", { id: user.id, role: user.role });
      req.user = user;
      next();
      
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Server error in auth" });
  }
};

// Optional: Role-based access control
export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === "ADMIN" || req.user.role === "HOST")) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied: Admins or Hosts only" });
  }
};

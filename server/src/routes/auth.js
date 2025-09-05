// src/routes/auth.js

import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser); // Verify this line exists
router.get("/me", protect, getMe); // ✅ only logged-in users can access

export default router;

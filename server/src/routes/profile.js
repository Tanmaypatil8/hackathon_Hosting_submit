import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from '../middleware/uploadMiddleware.js';
import prisma from "../utils/prismaClient.js";
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Get user profile
router.get("/users/profile", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const userWithProfile = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        registrations: {
          include: {
            hackathon: {
              include: {
                host: {
                  select: { name: true, email: true }
                }
              }
            }
          }
        }
      }
    });

    if (!userWithProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userData } = userWithProfile;
    res.json(userData);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ 
      error: true,
      message: error.message || 'Failed to fetch profile'
    });
  }
});



// Update user profile with image
router.put("/users/profile", protect, upload.single('profilePic'), async (req, res) => {
  try {
    const userId = req.user.id;
    let profileData = JSON.parse(req.body.data);

    // Handle profile picture
    if (req.file) {
      // Delete old profile picture if exists
      if (profileData.profilePicUrl) {
        const oldPath = path.join(process.cwd(), profileData.profilePicUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      
      profileData.profilePicUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId },
      update: profileData,
      create: {
        userId,
        ...profileData
      }
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get host profile
router.get("/host/profile", protect, async (req, res) => {
  try {
    if (req.user.role !== 'HOST') {
      return res.status(403).json({ message: 'Access denied: Host only' });
    }

    const hostData = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        hostProfile: true,
        hostedHackathons: {
          include: {
            registrations: true
          }
        }
      }
    });

    if (!hostData) {
      return res.status(404).json({ message: 'Host not found' });
    }

    // Create host profile if it doesn't exist
    if (!hostData.hostProfile) {
      await prisma.hostProfile.create({
        data: {
          userId: hostData.id,
        }
      });
    }

    const { password, ...profileData } = hostData;
    res.json(profileData);
  } catch (error) {
    console.error('Get host profile error:', error);
    res.status(500).json({ 
      error: true,
      message: error.message || 'Failed to fetch host profile'
    });
  }
});

// Update host profile with image
router.put("/host/profile", protect, upload.single('profilePic'), async (req, res) => {
  try {
    const userId = req.user.id;
    let profileData = JSON.parse(req.body.data);

    if (req.file) {
      // Handle profile picture update
      profileData.profilePicUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProfile = await prisma.hostProfile.upsert({
      where: { userId },
      update: {
        ...profileData,
        achievements: Array.isArray(profileData.achievements) 
          ? JSON.stringify(profileData.achievements) 
          : "[]",
        socialLinks: typeof profileData.socialLinks === 'object' 
          ? JSON.stringify(profileData.socialLinks) 
          : "{}"
      },
      create: {
        userId,
        ...profileData,
        achievements: Array.isArray(profileData.achievements) 
          ? JSON.stringify(profileData.achievements) 
          : "[]",
        socialLinks: typeof profileData.socialLinks === 'object' 
          ? JSON.stringify(profileData.socialLinks) 
          : "{}"
      }
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error('Host profile update error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

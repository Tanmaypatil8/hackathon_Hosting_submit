import express from "express";
import { createHackathon, getHackathons, updateHackathon, deleteHackathon } from "../controllers/hackathonController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { upload } from '../middleware/uploadMiddleware.js';
import { uploadImages, saveImagesInDb } from '../controllers/uploadController.js';
import { getHackathonImage } from "../controllers/imageController.js";
import prisma from "../utils/prismaClient.js";

const router = express.Router();

// anyone can view hackathons
router.get("/", getHackathons);

// hosts can create hackathons
router.post("/", protect, createHackathon);

// update hackathon (host only)
router.put("/:id", protect, updateHackathon);

// delete hackathon (host only)
router.delete("/:id", protect, deleteHackathon);

// Add upload route
router.post('/upload', 
  protect, 
  upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'poster', maxCount: 1 }
  ]), 
  uploadImages
);

// Add test endpoint to save images in DB
router.post('/save-images', 
  protect, 
  upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'poster', maxCount: 1 }
  ]),
  saveImagesInDb
);

// serve hackathon images
router.get('/image/:id/:type', getHackathonImage);

// Get single hackathon by ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const hackathon = await prisma.hackathon.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            hostProfile: true
          }
        },
        registrations: true
      }
    });

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    res.json(hackathon);
  } catch (error) {
    console.error('Error fetching hackathon:', error);
    res.status(500).json({ 
      error: true,
      message: error.message || 'Failed to fetch hackathon'
    });
  }
});

export default router;

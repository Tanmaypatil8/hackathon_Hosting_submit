import { promises as fs } from 'fs';
import prisma from "../utils/prismaClient.js";

export const uploadImages = async (req, res) => {
  try {
    // For local storage, multer already saves files into the uploads folder.
    const bannerFile = req.files.banner?.[0];
    const posterFile = req.files.poster?.[0];

    // Return the file paths relative to the public uploads folder.
    res.status(200).json({
      message: "Images stored locally",
      banner: bannerFile ? `/uploads/${bannerFile.filename}` : null,
      poster: posterFile ? `/uploads/${posterFile.filename}` : null
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
};

// Since images are stored locally, saving them to the database is not required.
// The following endpoint can either be removed or updated to return a not implemented message.

   
// New function to save images in the database for a given hackathon
export const saveImagesInDb = async (req, res) => {
  try {
    const { hackathonId } = req.body; // This field is required
    if (!hackathonId) {
      return res.status(400).json({ error: "hackathonId is required" });
    }
    
    const updateData = {};
    if (req.files.banner) {
      updateData.bannerData = await fs.readFile(req.files.banner[0].path);
    }
    if (req.files.poster) {
      updateData.posterData = await fs.readFile(req.files.poster[0].path);
    }
    
    const updatedHackathon = await prisma.hackathon.update({
      where: { id: parseInt(hackathonId) },
      data: updateData
    });
    
    // Cleanup temporary files
    for (const field in req.files) {
      await Promise.all(req.files[field].map(file => fs.unlink(file.path)));
    }
    
    res.json({ message: "Images saved in DB", hackathon: updatedHackathon });
  } catch (error) {
    console.error("Error saving images in DB:", error);
    res.status(500).json({ error: error.message });
  }
};


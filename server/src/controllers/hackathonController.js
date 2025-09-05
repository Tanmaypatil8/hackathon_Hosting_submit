// Import Prisma client
import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import prisma from "../utils/prismaClient.js";

// CREATE Hackathon
export const createHackathon = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user || user.role !== 'HOST') {
      return res.status(403).json({ error: "Only hosts can create hackathons" });
    }

    // Format the data for Prisma
    const hackathonData = {
      title: req.body.title,
      description: req.body.description,
      rules: req.body.rules || [],
      criteria: req.body.criteria,
      timeline: req.body.timeline || {},
      rounds: req.body.rounds || [],
      prizes: req.body.prizes || [],
      faqs: req.body.faqs || [],
      updates: req.body.updates || [],
      helpContact: req.body.helpContact || [],
      mode: req.body.mode || 'ONLINE',
      teamSize: req.body.teamSize ? parseInt(req.body.teamSize) : null,
      domain: req.body.domain,
      skillsRequired: req.body.skillsRequired || [],
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      location: req.body.location,
      hostId: req.user.id
      // Removed participantCount as it's not needed for creation
    };

    const hackathon = await prisma.hackathon.create({
      data: hackathonData
    });

    res.status(201).json(hackathon);
  } catch (err) {
    console.error("Error creating hackathon:", err);
    res.status(400).json({ error: err.message });
  }
};

// GET all Hackathons
export const getHackathons = async (req, res) => {
  try {
    const hackathons = await prisma.hackathon.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(hackathons);
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    res.status(500).json({ 
      error: true,
      message: 'Failed to fetch hackathons',
      details: error.message 
    });
  }
};

// UPDATE Hackathon (admin only)
export const updateHackathon = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate } = req.body;

    const hackathon = await prisma.hackathon.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    res.json(hackathon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE Hackathon (admin only)
export const deleteHackathon = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.hackathon.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Hackathon deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add new route to serve images
export const getHackathonImage = async (req, res) => {
  try {
    const { id, type } = req.params;
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: parseInt(id) },
      select: { 
        bannerData: type === 'banner',
        posterData: type === 'poster',
        galleryData: type === 'gallery'
      }
    });

    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    const imageData = hackathon[`${type}Data`];
    if (!imageData) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': imageData.length
    });
    res.end(Buffer.from(imageData));

  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ error: 'Error serving image' });
  }
};

export const uploadImages = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const imageData = {};

    // Read file as binary data
    if (req.files.banner) {
      imageData.bannerData = await fs.readFile(req.files.banner[0].path);
    }
    if (req.files.poster) {
      imageData.posterData = await fs.readFile(req.files.poster[0].path);
    }
    if (req.files.gallery) {
      imageData.galleryData = await Promise.all(
        req.files.gallery.map(file => fs.readFile(file.path))
      );
    }

    // Store in database
    const hackathon = await prisma.hackathon.update({
      where: { id: parseInt(req.params.id) },
      data: imageData
    });

    // Cleanup temp files
    for (const field in req.files) {
      await Promise.all(
        req.files[field].map(file => fs.unlink(file.path))
      );
    }

    res.json({ message: 'Images uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
};
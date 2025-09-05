import prisma from "../utils/prismaClient.js";

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

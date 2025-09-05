import prisma from "../utils/prismaClient.js";

// Host Profile Controllers
export const getHostProfile = async (req, res) => {
  try {
    const hostId = req.user.id;
    
    const profile = await prisma.user.findUnique({
      where: { id: hostId },
      include: {
        hostProfile: true,
        hostedHackathons: {
          include: {
            registrations: true
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ message: "Host profile not found" });
    }

    const { password, ...hostData } = profile;
    res.json(hostData);
  } catch (error) {
    console.error("Get host profile error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateHostProfile = async (req, res) => {
  try {
    const hostId = req.user.id;
    const {
      profession,
      bio,
      collegeOrCompany,
      domain,
      achievements,
      socialLinks,
      location
    } = req.body;

    const updatedProfile = await prisma.hostProfile.upsert({
      where: { userId: hostId },
      update: {
        profession,
        bio,
        collegeOrCompany,
        domain,
        achievements: achievements ? JSON.stringify(achievements) : null,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
        location
      },
      create: {
        userId: hostId,
        profession,
        bio,
        collegeOrCompany,
        domain,
        achievements: achievements ? JSON.stringify(achievements) : null,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
        location
      }
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error("Update host profile error:", error);
    res.status(500).json({ error: error.message });
  }
};

// User Profile Controllers
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        registrations: {
          include: {
            hackathon: true
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const { password, ...userData } = profile;
    res.json(userData);
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      location,
      education,
      studyYear,
      collegeName,
      courseName,
      skills,
      profession,
      bio,
      dateOfBirth,
      domain,
      socialLinks,
      achievements
    } = req.body;

    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        location,
        education,
        studyYear,
        collegeName,
        courseName,
        skills: skills ? JSON.stringify(skills) : null,
        profession,
        bio,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        domain,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
        achievements: achievements ? JSON.stringify(achievements) : null
      },
      create: {
        userId,
        location,
        education,
        studyYear,
        collegeName,
        courseName,
        skills: skills ? JSON.stringify(skills) : null,
        profession,
        bio,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        domain,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
        achievements: achievements ? JSON.stringify(achievements) : null
      }
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({ error: error.message });
  }
};

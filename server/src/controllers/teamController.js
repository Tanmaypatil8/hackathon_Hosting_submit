import prisma from "../utils/prismaClient.js";

export const createTeam = async (req, res) => {
  try {
    const hackathonId = parseInt(req.params.id);
    const leaderId = req.user.id;
    const { name, bio, rolesRequired } = req.body;

    // Check if user already has a team in this hackathon
    const existingTeam = await prisma.teamMember.findFirst({
      where: {
        userId: leaderId,
        team: { hackathonId }
      }
    });

    if (existingTeam) {
      return res.status(400).json({ message: "Already part of a team in this hackathon" });
    }

    const team = await prisma.team.create({
      data: {
        name,
        bio,
        rolesRequired,
        hackathonId,
        leaderId
      }
    });

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const inviteToTeam = async (req, res) => {
  try {
    const teamId = parseInt(req.params.id);
    const { userId, role } = req.body;

    const team = await prisma.team.findUnique({
      where: { id: teamId }
    });

    if (team.leaderId !== req.user.id) {
      return res.status(403).json({ message: "Only team leader can invite members" });
    }

    const member = await prisma.teamMember.create({
      data: {
        teamId,
        userId,
        role
      }
    });

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const joinTeam = async (req, res) => {
  // Implementation similar to inviteToTeam but with additional checks
};

export const getTeams = async (req, res) => {
  try {
    const hackathonId = parseInt(req.params.id);
    const teams = await prisma.team.findMany({
      where: { hackathonId },
      include: {
        leader: {
          select: { name: true, email: true }
        },
        members: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        }
      }
    });

    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

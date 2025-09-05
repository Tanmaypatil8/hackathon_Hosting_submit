import express from "express";
import { createTeam, inviteToTeam, joinTeam, getTeams } from "../controllers/teamController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/hackathons/:id/teams", protect, createTeam);
router.post("/teams/:id/invite", protect, inviteToTeam);
router.post("/teams/:id/join", protect, joinTeam);
router.get("/hackathons/:id/teams", getTeams);

export default router;

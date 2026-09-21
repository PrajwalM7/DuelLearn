import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getLeaderboard
} from "../controllers/userController.js";

const router = express.Router();
router.get("/leaderboard", getLeaderboard);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.patch("/:id/xp", updateUser);
export default router;
import express from "express";
import { QuestionSet } from "../models/Question.js";
import {User} from "../models/User.js"; // your user model

const router = express.Router();

/* GET DASHBOARD STATS */
router.get("/stats", async (req, res) => {
  try {

    // total students (role = student)
    const totalStudents = await User.countDocuments({ role: "student" });

    // total quizzes
    const totalQuizzes = await QuestionSet.countDocuments();

    // total questions
    const totalQuestions = await QuestionSet.aggregate([
      { $unwind: "$questions" },
      { $count: "count" }
    ]);

    res.json({
      totalStudents,
      totalQuizzes,
      totalQuestions: totalQuestions[0]?.count || 0
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
});

export default router;
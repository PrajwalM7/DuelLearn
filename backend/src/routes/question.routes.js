import express from "express";
import {
  createQuestionSet,
  getQuestionSets,
  getQuestionSetById,
  deleteQuestionSetById
} from "../controllers/question.controller.js";

const router = express.Router();

router.post("/", createQuestionSet);          // create 1 set with multiple questions
router.get("/", getQuestionSets);             // list all sets
router.get("/:id", getQuestionSetById);       // get single set
router.delete("/:id", deleteQuestionSetById); // delete set

export default router;
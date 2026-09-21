import mongoose from "mongoose";

// Schema for individual questions inside a set
const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  difficulty: { type: String, enum: ["easy","medium","hard"], required: true }
});

// Question Set schema
const questionSetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },   // e.g., "OS Basics Quiz"
    topic: { type: String, required: true, trim: true },   // e.g., "Operating Systems"
    questions: { type: [questionSchema], required: true }, // array of 5 questions
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const QuestionSet = mongoose.model("QuestionSet", questionSetSchema);
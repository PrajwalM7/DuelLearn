import { QuestionSet } from "../models/Question.js";
// Create a new Question Set (5 questions at once)
export const createQuestionSet = async (req, res) => {
  try {
    const { title, topic, questions, createdBy } = req.body;

    if (!questions || questions.length < 1)
      return res.status(400).json({ error: "At least 1 question required" });

    const qset = await QuestionSet.create({ title, topic, questions, createdBy });
    res.status(201).json(qset);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    res.status(500).json({ error: err.message });
  }
};

// Get all question sets (optionally filter by topic)
export const getQuestionSets = async (req, res) => {
  try {
    const { topic } = req.query;
    const filter = topic ? { topic } : {};
    const qsets = await QuestionSet.find(filter).sort({ createdAt: -1 });
    res.json(qsets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single question set by ID
export const getQuestionSetById = async (req, res) => {
  try {
    const qset = await QuestionSet.findById(req.params.id);
    if (!qset) return res.status(404).json({ error: "Question set not found" });
    res.json(qset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a question set by ID
export const deleteQuestionSetById = async (req, res) => {
  try {
    const qset = await QuestionSet.findByIdAndDelete(req.params.id);
    if (!qset) return res.status(404).json({ error: "Question set not found" });
    res.status(204).send();
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid ID" });
    }
    res.status(500).json({ error: err.message });
  }
};
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateQuiz.css";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [quiz, setQuiz] = useState({
    title: "",
    topic: "",
    questions: [
      { questionText: "", options: ["", "", "", ""], correctAnswer: "", difficulty: "easy" }
    ],
  });

  // Handle Title and Topic change
  const handleHeaderChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  // Handle Question text, answer, and difficulty
  const handleQuestionChange = (index, e) => {
    const newQuestions = [...quiz.questions];
    newQuestions[index][e.target.name] = e.target.value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  // Handle specific Option changes
  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  // Add a new question block
  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "", difficulty: "easy" }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Get the data from localStorage
    const rawData = localStorage.getItem("user");
    if (!rawData) {
      alert("No user found. Please login again.");
      return navigate("/");
    }
  
    const storedUser = JSON.parse(rawData);
  
    // 2. Extract the ID (Handles: _id, id, or if storedUser is an array)
    const userData = Array.isArray(storedUser) ? storedUser[0] : storedUser;
    const teacherId = userData?._id || userData?.id;
  
    if (!teacherId) {
      console.error("User object in storage:", userData);
      alert("Error: Teacher ID not found in session. Please re-login.");
      return;
    }
  
    const payload = {
      ...quiz,
      createdBy: teacherId // Now guaranteed to be a string
    };
  console.log("Payload:", payload);
    try {
      await axios.post("http://localhost:5000/api/questions", payload);
      alert("Quiz Created Successfully!");
      navigate("/teacher");
    } catch (err) {
      console.error("Backend Error:", err.response?.data);
      alert(err.response?.data?.error || "Check console for validation errors");
    }
  };

  return (
    <div className="create-quiz-container">
      <h2>Create New Quiz Set</h2>
      <form onSubmit={handleSubmit}>
        <div className="quiz-header-inputs">
          <input
            name="title"
            placeholder="Quiz Title (e.g. Midterm OS)"
            onChange={handleHeaderChange}
            required
          />
          <input
            name="topic"
            placeholder="Topic (e.g. Operating Systems)"
            onChange={handleHeaderChange}
            required
          />
        </div>

        {quiz.questions.map((q, qIndex) => (
          <div key={qIndex} className="question-box">
            <h4>Question {qIndex + 1}</h4>
            <input
              name="questionText"
              placeholder="Enter Question"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e)}
              required
            />
            
            <div className="options-grid">
              {q.options.map((opt, oIndex) => (
                <input
                  key={oIndex}
                  placeholder={`Option ${oIndex + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  required
                />
              ))}
            </div>

            <div className="meta-inputs">
              <input
                name="correctAnswer"
                placeholder="Correct Answer"
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                required
              />
              <select
                name="difficulty"
                value={q.difficulty}
                onChange={(e) => handleQuestionChange(qIndex, e)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        ))}

        <div className="form-actions">
          <button type="button" onClick={addQuestion}>+ Add Question</button>
          <button type="submit">Submit Quiz Set</button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;
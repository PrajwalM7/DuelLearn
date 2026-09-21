import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Confetti from "react-confetti";
import { useNavigate, Link } from "react-router-dom";
import { XpContext } from "../XPContext.jsx";
import Leaderboard from "./Leaderboard";
import ChatBot from "../pages/ChatBot";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { xp, addXp } = useContext(XpContext);

  /* ---------- STATE ---------- */
  const [quizSets, setQuizSets] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [lifelineUsed, setLifelineUsed] = useState(false);
  const [activeTab, setActiveTab] = useState("quizzes");

  /* ---------- FETCH QUIZZES ---------- */
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/questions");
        setQuizSets(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuizzes();
  }, []);

  /* ---------- APPLY FILTER ---------- */
  useEffect(() => {
    if (!selectedQuiz) return;

    if (difficultyFilter === "all")
      setFilteredQuestions(selectedQuiz.questions);
    else
      setFilteredQuestions(
        selectedQuiz.questions.filter(q => q.difficulty === difficultyFilter)
      );

    setCurrentQuestion(0);
    setSelectedOption("");
    setLifelineUsed(false);
  }, [selectedQuiz, difficultyFilter]);

  /* ---------- START QUIZ ---------- */
  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setScore(0);
    setShowResult(false);
  };

  /* ---------- OPTION SELECT ---------- */
  const handleOptionSelect = (opt) => setSelectedOption(opt);

  /* ---------- 50-50 LIFELINE ---------- */
  const useFiftyFifty = () => {
    if (lifelineUsed) return;

    const correct = filteredQuestions[currentQuestion].correctAnswer;
    const options = filteredQuestions[currentQuestion].options;
    const wrong = options.filter(o => o !== correct);
    const reduced = [correct, wrong[Math.floor(Math.random() * wrong.length)]];

    setFilteredQuestions(prev => {
      const copy = [...prev];
      copy[currentQuestion] = { ...copy[currentQuestion], options: reduced };
      return copy;
    });

    setLifelineUsed(true);
  };

  /* ---------- NEXT QUESTION ---------- */
  const handleNext = () => {

    if (selectedOption === filteredQuestions[currentQuestion].correctAnswer) {

      let gainedXP = 0;
      const diff = filteredQuestions[currentQuestion].difficulty;

      if (diff === "easy") gainedXP = 10;
      if (diff === "medium") gainedXP = 20;
      if (diff === "hard") gainedXP = 30;

      if (lifelineUsed) gainedXP = Math.floor(gainedXP / 2);

      addXp(gainedXP);
      setScore(prev => prev + 1);
    }

    if (currentQuestion + 1 < filteredQuestions.length) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption("");
      setLifelineUsed(false);
    } else {
      setShowResult(true);
      setTimeout(() => {
        setSelectedQuiz(null);
        setShowResult(false);
      }, 3000);
    }
  };

  /* ---------- NAVBAR ---------- */
  const Navbar = () => (
    <nav className="navbar">
      <h2 className="navbar-brand">🚀 QuizMaster</h2>
      <ul className="navbar-links">

        <li>
          <span
            className={`nav-link ${activeTab === "quizzes" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("quizzes");
              setSelectedQuiz(null);
            }}
            style={{cursor:"pointer"}}
          >
            Quiz
          </span>
        </li>

        <li>
          <Link to="/learning" className="nav-link">Learning</Link>
        </li>

        <li>
          <span
            className={`nav-link ${activeTab === "leaderboard" ? "active" : ""}`}
            onClick={() => setActiveTab("leaderboard")}
            style={{cursor:"pointer"}}
          >
            Leaderboard 🏆
          </span>
        </li>

      </ul>

      {/* <div className="xp-display">⭐ XP: {xp}</div> */}
    </nav>
  );

  /* ---------- LEADERBOARD TAB ---------- */
  if (activeTab === "leaderboard")
    return (
      <>
        <Navbar/>
        <Leaderboard/>
        <ChatBot/>
      </>
    );

  /* ---------- RESULT SCREEN ---------- */
  if (showResult)
    return (
      <>
        <Navbar/>
        <Confetti recycle={false} numberOfPieces={300}/>
        <div className="quiz-result">
          <h2>🎉 Quiz Completed!</h2>
          <p className="score">
            You scored {score} / {filteredQuestions.length}
          </p>
        </div>
        <ChatBot/>
      </>
    );

 /* ---------- QUIZ PLAY SCREEN ---------- */
if (selectedQuiz) {

  const question = filteredQuestions[currentQuestion];

  // ⭐ IMPORTANT GUARD (this prevents crash)
  if (!question) {
    return (
      <>
        <Navbar />
        <div className="quiz-container">
          <h2>Preparing quiz...</h2>
          <p>Loading questions...</p>
        </div>
        <ChatBot/>
      </>
    );
  }

  return (
    <>
      <Navbar/>

      <div className="quiz-container">
        <h2>{selectedQuiz.title}</h2>

        <div className="difficulty-filter">
          {["all","easy","medium","hard"].map(level=>(
            <button
              key={level}
              className={`filter-btn ${difficultyFilter===level?"active":""}`}
              onClick={()=>setDifficultyFilter(level)}
            >
              {level}
            </button>
          ))}
        </div>

        <p>Question {currentQuestion+1} of {filteredQuestions.length}</p>

        <h3>{question.questionText}</h3>

        <ul className="options-list">
          {question.options?.map(opt=>(
            <li key={opt}>
              <button
                className={`option-button ${selectedOption===opt?"selected":""}`}
                onClick={()=>handleOptionSelect(opt)}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>

        <div className="quiz-actions">
          <button className="lifeline-btn" disabled={lifelineUsed} onClick={useFiftyFifty}>
            50-50 Lifeline
          </button>

          <button className="next-button" disabled={!selectedOption} onClick={handleNext}>
            {currentQuestion+1===filteredQuestions.length?"Submit":"Next"}
          </button>
        </div>
      </div>

      <ChatBot/>
    </>
  );
}
  /* ---------- DASHBOARD HOME ---------- */
  return (
    <>
      <Navbar/>

      <div className="dashboard-container">

        <div className="battle-card">
          <h2>⚔️ Battle Mode</h2>
          <p>Compete with students in real-time quiz battles!</p>
          <button className="battle-btn" onClick={()=>navigate("/battle")}>
            Enter Battle
          </button>
        </div>

        <div className="quiz-list">
          <h2>📚 Available Quizzes</h2>
          <div className="quiz-grid">
            {quizSets.map(q=>(
              <div key={q._id} className="quiz-card" onClick={()=>startQuiz(q)}>
                <h3>{q.title}</h3>
                <p>Topic: {q.topic}</p>
                <p>{q.questions.length} Questions</p>
                <span className="start-label">Start →</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <ChatBot/>
    </>
  );
};

export default StudentDashboard;
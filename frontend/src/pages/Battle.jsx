import { useEffect, useState } from "react";
import { socket } from "../socket";
import "./Battle.css";

export default function Battle() {

  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [status, setStatus] = useState("idle");
  const [questions, setQuestions] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({});
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState("");

  /* ================= JOIN ================= */

  const joinBattle = () => {
    if (!name.trim()) return;
    socket.emit("joinBattle", { name });
    setJoined(true);
  };

  /* ================= SOCKET EVENTS ================= */

  useEffect(() => {

    socket.on("waiting", () => {
      setStatus("waiting");
    });

    socket.on("battleStart", (data) => {
      console.log("Questions received:", data.questions); // debugging
      setRoomId(data.roomId);
      setQuestions(data.questions || []);
      setCurrentQuestion(0);
      setStatus("playing");
    });

    socket.on("scoreUpdate", (newScores) => {
      setScores(newScores);
    });

    socket.on("battleEnded", (finalScores) => {
      setScores(finalScores);
      setStatus("ended");

      const my = finalScores[socket.id] || 0;
      const opponentId = Object.keys(finalScores).find(id => id !== socket.id);
      const opp = finalScores[opponentId] || 0;

      if (my > opp) setResult("🎉 You Win!");
      else if (my < opp) setResult("😢 You Lose!");
      else setResult("🤝 Draw!");
    });

    return () => {
      socket.off("waiting");
      socket.off("battleStart");
      socket.off("scoreUpdate");
      socket.off("battleEnded");
    };

  }, []);

  /* ================= ANSWER ================= */

  const handleAnswer = (option) => {
    if (answered || status !== "playing") return;

    const current = questions[currentQuestion];
    if (!current) return;

    setAnswered(true);

    // supports BOTH string answer & index answer
    const isCorrect =
      option === current.correctAnswer ||
      option === current.options?.[current.correctAnswer];

    socket.emit("submitAnswer", {
      roomId,
      isCorrect
    });

    setTimeout(() => {
      setAnswered(false);
      setCurrentQuestion(prev => prev + 1);
    }, 800);
  };

  /* ================= UI ================= */

  /* ---- Join Screen ---- */
  if (!joined)
    return (
      <div className="battle-screen">
        <div className="battle-card setup">
          <h2>⚔️ Quiz Battle</h2>
          <p>Enter your nickname</p>

          <input
            className="name-input"
            placeholder="Your Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button className="join-btn" onClick={joinBattle}>
            Join Battle
          </button>
        </div>
      </div>
    );

  /* ---- Waiting ---- */
  if (status === "waiting")
    return (
      <div className="battle-screen">
        <div className="battle-card waiting">
          <div className="spinner"></div>
          <h2>Finding opponent...</h2>
        </div>
      </div>
    );

  /* ---- End Screen ---- */
  if (status === "ended")
    return (
      <div className="battle-screen">
        <div className="battle-card results">
          <h1 className="result-title">{result}</h1>

          <div className="score-summary">
            {Object.entries(scores).map(([id, score]) => (
              <div key={id} className="final-score-row">
                <span>{id === socket.id ? "🏆 You" : "👤 Opponent"}</span>
                <span>{score}</span>
              </div>
            ))}
          </div>

          <button className="join-btn" onClick={() => window.location.reload()}>
            New Battle
          </button>
        </div>
      </div>
    );

  /* ---- Question Screen ---- */

  const q = questions[currentQuestion];

  if (!q)
    return (
      <div className="battle-screen">
        <div className="battle-card">
          <h2>Waiting for opponent to finish...</h2>
        </div>
      </div>
    );

  // FIX: support any DB schema field name
  const questionText =
    q.question || q.text || q.title || "Question not found";

  return (
    <div className="battle-screen">
      <div className="battle-card">

        <div className="game-header">
          <span className="q-tracker">
            Question {currentQuestion + 1} / {questions.length}
          </span>
        </div>

        <div className="question-container">
          <h2 className="question-text">{questionText}</h2>
        </div>

        <div className="options-grid">
          {(q.options || []).map((opt, i) => (
            <button
              key={i}
              disabled={answered}
              onClick={() => handleAnswer(opt)}
              className="opt-btn"
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="score-footer">
          <p className="score-heading">Live Score</p>

          <div className="score-flex">
            {Object.entries(scores).map(([id, score]) => (
              <div
                key={id}
                className={`score-pill ${id === socket.id ? "me" : "them"}`}
              >
                <span>{id === socket.id ? "YOU" : "OPP"}</span>
                <strong>{score}</strong>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
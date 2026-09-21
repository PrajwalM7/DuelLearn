import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { QuestionSet } from "./models/Question.js";

const server = http.createServer(app);
const PORT = 5000;

/* SOCKET.IO */
const io = new Server(server, {
  path: "/socket.io",
  cors: { origin: "*" }
});

let waitingPlayer = null;
const activeBattles = new Map();

/* CONNECTION */
io.on("connection", (socket) => {
  console.log("⚡ Connected:", socket.id);

  /* JOIN BATTLE */
  socket.on("joinBattle", async (user) => {

    if (!user?.name) return;
    socket.user = user;

    /* MATCH FOUND */
    if (waitingPlayer) {

      const opponent = waitingPlayer;
      waitingPlayer = null;

      const roomId = `room_${opponent.id}_${socket.id}`;
      socket.join(roomId);
      opponent.join(roomId);

      /* GET QUIZ FROM DB */
      const quiz = await QuestionSet.findOne().lean();

      if (!quiz || !quiz.questions.length) {
        socket.emit("error", "No questions found in DB");
        opponent.emit("error", "No questions found in DB");
        return;
      }

      /* ⭐⭐⭐ THE IMPORTANT FIX ⭐⭐⭐
         Convert MongoDB schema -> Frontend schema
      */
      const formattedQuestions = quiz.questions.map(q => ({
        question: q.questionText,   // <-- FIX (was causing your bug)
        options: q.options,
        correctAnswer: q.correctAnswer
      }));

      /* STORE BATTLE STATE */
      activeBattles.set(roomId, {
        questions: formattedQuestions,
        players: {
          [socket.id]: { score: 0, index: 0, finished: false },
          [opponent.id]: { score: 0, index: 0, finished: false }
        }
      });

      /* SEND QUESTIONS */
      io.to(roomId).emit("battleStart", {
        roomId,
        questions: formattedQuestions,
        players: [
          { id: socket.id, name: user.name },
          { id: opponent.id, name: opponent.user.name }
        ]
      });

      console.log("⚔️ Battle started:", roomId);

    } else {
      waitingPlayer = socket;
      socket.emit("waiting");
    }
  });

  /* SUBMIT ANSWER */
  socket.on("submitAnswer", ({ roomId, isCorrect }) => {

    const battle = activeBattles.get(roomId);
    if (!battle) return;

    const player = battle.players[socket.id];
    if (!player || player.finished) return;

    if (isCorrect) player.score++;

    player.index++;

    if (player.index >= battle.questions.length)
      player.finished = true;

    /* SEND LIVE SCORES */
    const scores = {};
    Object.keys(battle.players).forEach(id => {
      scores[id] = battle.players[id].score;
    });

    io.to(roomId).emit("scoreUpdate", scores);

    /* END BATTLE */
    if (Object.values(battle.players).every(p => p.finished)) {
      io.to(roomId).emit("battleEnded", scores);
      activeBattles.delete(roomId);
      console.log("🏁 Battle finished:", roomId);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});

/* START SERVER */
connectDB().then(() => {
  server.listen(PORT, "127.0.0.1", () => {
    console.log(`🚀 Quiz server running on http://127.0.0.1:${PORT}`);
  });
});
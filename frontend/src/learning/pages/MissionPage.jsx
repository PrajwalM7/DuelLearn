
import "../learning.css";
import { useState, useEffect, useContext } from "react"; // Added useContext
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { XpContext } from "../../XPContext.jsx"; // Double check this path!

function MissionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize context
  const { xp, addXp } = useContext(XpContext);

  const { subject, mission } = location.state || {};

  useEffect(() => {
    if (!subject || !mission) navigate("/learning");
  }, [subject, mission, navigate]);

  if (!subject || !mission) return null;

  const totalLevels = 5;
  const [currentLevel, setCurrentLevel] = useState(1);
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [showXpPop, setShowXpPop] = useState(false);

  const osLevels = {
    1: {
      title: "🖥 OS Basics – System Architecture",
      xp: 20,
      content: {
        concept: "Operating System acts as a bridge between user and hardware.",
        example: "Opening Chrome → OS allocates memory & CPU.",
        why: "Strong OS basics are important for interviews.",
        mistake: "Applications do NOT directly talk to hardware.",
        funFact: "UNIX influenced Linux & macOS."
      }
    },
    2: {
      title: "🔄 Process Lifecycle",
      xp: 25,
      content: {
        concept: "Process moves through New → Ready → Running → Terminated.",
        example: "VS Code → Ready → Running → Terminated.",
        why: "Important for scheduling interview questions.",
        mistake: "Ready ≠ Running.",
        funFact: "Context switching enables multitasking."
      }
    },
    3: {
      title: "⚙ CPU Scheduling (SJF)",
      xp: 30,
      content: {
        concept: "Shortest Job First runs smallest burst time first.",
        example: "2ms runs before 5ms.",
        why: "Common placement numerical problem.",
        mistake: "Burst time ≠ Arrival time.",
        funFact: "SJF minimizes waiting time."
      }
    },
    4: {
      title: "🔒 Deadlock",
      xp: 35,
      content: {
        concept: "Deadlock occurs when four conditions exist together.",
        example: "P1 waits for R2 while holding R1.",
        why: "Frequently asked theoretical question.",
        mistake: "All four conditions must exist.",
        funFact: "Banker’s Algorithm prevents deadlock."
      }
    },
    5: {
      title: "🧠 Memory Allocation (First Fit)",
      xp: 40,
      content: {
        concept: "First Fit selects first sufficient block.",
        example: "60KB process selects 100KB.",
        why: "Memory allocation is common in interviews.",
        mistake: "First Fit ≠ Best Fit.",
        funFact: "Fragmentation reduces efficiency."
      }
    }
  };

  const networkLevels = {
  1: {
    title: "🌐 OSI Model",
    xp: 20,
    content: {
      concept: "OSI Model has 7 layers that define how data travels in a network.",
      example: "Application → Transport → Network → Data Link → Physical.",
      why: "Very common theoretical interview question.",
      mistake: "Do not confuse OSI with TCP/IP model.",
      funFact: "OSI is a conceptual model, not a real protocol."
    }
  },
  2: {
    title: "📡 TCP vs UDP",
    xp: 25,
    content: {
      concept: "TCP is reliable and connection-oriented. UDP is fast and connectionless.",
      example: "Streaming uses UDP, file transfer uses TCP.",
      why: "Frequently asked in networking interviews.",
      mistake: "TCP is not always better than UDP.",
      funFact: "TCP uses 3-way handshake."
    }
  },
  3: {
    title: "💻 Client-Server Model",
    xp: 30,
    content: {
      concept: "Client sends request, server processes and sends response.",
      example: "Browser sends HTTP request → Server returns webpage.",
      why: "Foundation of web applications.",
      mistake: "Client and server can run on same machine.",
      funFact: "Modern apps use REST APIs."
    }
  },
  4: {
    title: "🛣 Routing",
    xp: 35,
    content: {
      concept: "Routing determines the best path for data packets.",
      example: "Router A → Router B → Router C.",
      why: "Important in networking interviews.",
      mistake: "Routing is different from switching.",
      funFact: "Routers use routing tables."
    }
  },
  5: {
    title: "🌍 HTTP Request Cycle",
    xp: 40,
    content: {
      concept: "Browser sends HTTP request and server responds.",
      example: "DNS → Server → Response → Browser.",
      why: "Important for web developers.",
      mistake: "HTTP is stateless protocol.",
      funFact: "HTTPS adds encryption using SSL/TLS."
    }
  }
};

const aptitudeLevels = {
  1: {
    title: "📊 Percentage Tricks",
    xp: 20,
    content: {
      concept: "Percentage means per 100.",
      example: "15% of 240 = 10% + 5% = 24 + 12 = 36.",
      why: "Very common in placement aptitude rounds.",
      mistake: "Students directly multiply instead of using 10% trick.",
      funFact: "25% means divide by 4 instantly."
    }
  },

  2: {
    title: "💰 Profit & Loss",
    xp: 25,
    content: {
      concept: "Profit % = (Profit / Cost Price) × 100.",
      example: "If CP = 100 and profit = 20%, SP = 120.",
      why: "Frequently asked in campus placements.",
      mistake: "Confusing cost price with selling price.",
      funFact: "20% profit means multiply CP by 1.2."
    }
  },

  3: {
    title: "⏳ Time & Work",
    xp: 30,
    content: {
      concept: "If A completes work in x days, 1 day work = 1/x.",
      example: "A = 5 days, B = 10 days → together = 1/5 + 1/10.",
      why: "Common LCM based aptitude question.",
      mistake: "Adding days directly instead of work rates.",
      funFact: "LCM method solves faster in exams."
    }
  },

  4: {
    title: "🎲 Probability",
    xp: 35,
    content: {
      concept: "Probability = Favorable outcomes / Total outcomes.",
      example: "Coin toss → P(Head) = 1/2.",
      why: "Logical reasoning + maths combo question.",
      mistake: "Forgetting total possible outcomes.",
      funFact: "P(not event) = 1 - P(event)."
    }
  },

  5: {
    title: "🔢 Number System Tricks",
    xp: 40,
    content: {
      concept: "Divisibility rules help solve faster.",
      example: "If sum of digits divisible by 3 → number divisible by 3.",
      why: "Very common elimination trick in MCQs.",
      mistake: "Ignoring simple divisibility shortcuts.",
      funFact: "Divisible by 9 if digit sum divisible by 9."
    }
  }
};

  const levelsData = {
    "Operating Systems": osLevels,
    "Computer Networks": networkLevels,
    "Aptitude": aptitudeLevels
  };

  const levelData = levelsData[subject.name];
  const current = levelData[currentLevel.toString()];

  const nextLevel = () => {
    addXp(current.xp); 
    setShowXpPop(true);
    setTimeout(() => setShowXpPop(false), 1200);

    if (currentLevel < totalLevels) {
      setCurrentLevel(prev => prev + 1);
    } else {
      setMissionCompleted(true);
    }
  };

  const progressPercent = (currentLevel / totalLevels) * 100;

  if (missionCompleted) {
    return (
      <div className="learning-container">
        <h2>🏆 Mission Completed!</h2>
        <div className="card success-card">
          <h3>✨ Total XP Earned: {xp}</h3>
          <button className="btn" onClick={() => navigate("/learning")}>
            ⬅ Back to Learning Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="learning-container">
      <div className="header-bar">
        <button className="btn small-btn" onClick={() => navigate(-1)}>⬅</button>
        <div className="xp-badge">⭐ {xp} XP</div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <h2 className="level-title">{current.title}</h2>

      {showXpPop && <div className="xp-popup">+{current.xp} XP 🎉</div>}

      <div className="card">
        <p>📘 <strong>Concept:</strong> {current.content.concept}</p>
        <p>🧠 <strong>Example:</strong> {current.content.example}</p>
        <p>🎯 <strong>Why It Matters:</strong> {current.content.why}</p>
        <p>⚠ <strong>Common Mistake:</strong> {current.content.mistake}</p>
        <p>💡 <strong>Fun Fact:</strong> {current.content.funFact}</p>

        <button className="btn primary-btn" onClick={nextLevel}>
          {currentLevel === totalLevels ? "🏁 Finish Mission" : "🚀 Next Level"}
        </button>
      </div>
    </div>
  );
}

export default MissionPage;
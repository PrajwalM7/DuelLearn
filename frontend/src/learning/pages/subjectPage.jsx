import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "../learning.css";

const allSubjects = [
  { id: 1, name: "Operating Systems", icon: "🧠" },
  { id: 2, name: "Computer Networks", icon: "🌐" },
  { id: 3, name: "Aptitude", icon: "📊" },
];

function SubjectPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [subject, setSubject] = useState(null);

  useEffect(() => {
    // Try to get subject from location.state first
    if (location.state?.subject) {
      setSubject(location.state.subject);
    } else {
      // Otherwise, fetch it from ID in URL
      const found = allSubjects.find((s) => s.id === parseInt(id));
      if (found) setSubject(found);
      else navigate("/learning"); // fallback if invalid ID
    }
  }, [id, location.state, navigate]);

  if (!subject) return null; // loading/fallback

  const subjectMissions = {
    1: [
      { id: 1, title: "OS Basics", xp: 50 },
      { id: 2, title: "Processes & Threads", xp: 60 },
    ],
    2: [
      { id: 1, title: "OSI Model", xp: 50 },
      { id: 2, title: "TCP vs UDP", xp: 60 },
    ],
    3: [
      { id: 1, title: "Percentage Tricks", xp: 50 },
      { id: 2, title: "Profit & Loss", xp: 60 },
    ],
  };

  const missions = subjectMissions[subject.id] || [];

  const goToMission = (mission) =>
    navigate(`/mission/${mission.id}`, { state: { subject, mission } });

  return (
    <div className="learning-container">
      <button className="btn" onClick={() => navigate("/learning")}>
        ⬅ Back
      </button>
      <h2 className="learning-title">🎯 {subject.name}</h2>
      {missions.map((mission) => (
        <div
          key={mission.id}
          className="card"
          onClick={() => goToMission(mission)}
        >
          <h3>{mission.title}</h3>
          <p className="xp-text">Reward: +{mission.xp} XP</p>
        </div>
      ))}
    </div>
  );
}

export default SubjectPage;
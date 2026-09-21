import "../learning.css";

function LearningHome({ goToSubject }) {
  const subjects = [
    { id: 1, name: "Operating Systems", icon: "🧠" },
    { id: 2, name: "Computer Networks", icon: "🌐" },
    { id: 5, name: "Aptitude", icon: "📊" },
  ];

  return (
    <div className="learning-container">
      <h2 className="learning-title">📚 Learning Arena</h2>
      {subjects.map((subject) => (
        <div
          key={subject.id}
          className="card"
          onClick={() => goToSubject(subject)}
        >
          <h3>
            {subject.icon} {subject.name}
          </h3>
          <p className="xp-text">🚀 Start Mission</p>
        </div>
      ))}
    </div>
  );
}

export default LearningHome;
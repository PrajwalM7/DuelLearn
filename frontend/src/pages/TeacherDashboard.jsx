import React, { useEffect, useState } from "react";
import "./TeacherDashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TeacherCharts from "../pages/TeacherCharts";
const TeacherDashboard = () => {
  const navigate = useNavigate();

  /* ---------- STATE ---------- */
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalQuizzes: 0,
    totalQuestions: 0
  });

  const [loading, setLoading] = useState(true);

  /* ---------- FETCH DASHBOARD DATA ---------- */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:5000/api/dashboard/stats"
        );

        setStats(res.data);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="teacher-dashboard">
        <h2 style={{ textAlign: "center", marginTop: "100px" }}>
          Loading dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="teacher-dashboard">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Teacher Dashboard</h1>
          <p className="subtitle">
            Monitor student performance and manage quizzes
          </p>
        </div>

        <button
          className="create-quiz-btn"
          onClick={() => navigate("/create-quiz")}
        >
          + Create Quiz
        </button>
      </div>

      {/* Overview Cards */}
      <div className="overview-section">

        {/* Total Students */}
        <div className="overview-card">
          <h3>Total Students</h3>
          <p className="metric">{stats.totalStudents}</p>
        </div>

        {/* Average Score (temporary derived) */}
        <div className="overview-card">
          <h3>Total Questions</h3>
          <p className="metric">{stats.totalQuestions}</p>
        </div>

        {/* Total Quizzes */}
        <div className="overview-card">
          <h3>Active Quizzes</h3>
          <p className="metric">{stats.totalQuizzes}</p>
        </div>

        {/* Weak Topic (placeholder until analytics added) */}
       

      </div>

      {/* Analytics Section */}
      <div className="analytics-section">
        <h2>Student Performance Analytics</h2>

        <div className="analytics-grid">

          <div className="analytics-card">
            <h4>Topic-wise Accuracy</h4>
           <TeacherCharts />
          </div>

          <div className="analytics-card">
            <h4>Performance Trend (Last 7 Days)</h4>
            <TeacherCharts />
          </div>

          <div className="analytics-card">
            <h4>Top Performers</h4>
            <ul className="list">
              <li>Data available after students attempt quizzes</li>
            </ul>
          </div>

          <div className="analytics-card">
            <h4>Weak Topics Overview</h4>
            <ul className="list weak">
              <li>Analytics unlocks after quiz attempts</li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
};

export default TeacherDashboard;
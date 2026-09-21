import { useState, useEffect } from "react";
import axios from "axios";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get current user ID from localStorage to highlight them
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = storedUser?.id || storedUser?._id;

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/leaderboard");
      setLeaders(res.data);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Initial fetch
    fetchLeaderboard();

    // 2. Setup Polling: Refresh data every 5 seconds
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 5000); 

    // 3. Cleanup: Stop polling when user leaves the page
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="loading">Loading Rankings...</div>;

  return (
    <div className="leaderboard-wrapper">
      <div className="leaderboard-header">
        <h1>🏆 Hall of Fame</h1>
        <p>Top 10 Knowledge Warriors</p>
        <small className="live-indicator">● Live Updates Enabled</small>
      </div>

      <div className="leaderboard-card">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Warrior</th>
              <th>Total XP</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((user, index) => {
              const isMe = user._id === currentUserId;
              
              return (
                <tr 
                  key={user._id} 
                  className={`rank-row rank-${index + 1} ${isMe ? "highlight-me" : ""}`}
                >
                  <td className="rank-number">
                    {index + 1 === 1 ? "🥇" : index + 1 === 2 ? "🥈" : index + 1 === 3 ? "🥉" : index + 1}
                  </td>
                  <td className="user-name">
                    {user.name} {isMe && <span className="you-tag">(You)</span>}
                  </td>
                  <td className="user-xp">{user.xp.toLocaleString()} XP</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {leaders.length === 0 && <p className="no-data">No warriors found yet. Be the first!</p>}
      </div>
    </div>
  );
};

export default Leaderboard;
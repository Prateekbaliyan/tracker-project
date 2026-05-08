import { useEffect, useState } from "react";
import axios from "axios";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/api/leaderboard", {
      headers: { Authorization: token }
    })
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{
      background: "#f1f5f9",
      minHeight: "100vh",
      padding: "30px",
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* HEADER */}
      <h1 style={{
        textAlign: "center",
        marginBottom: "30px",
        fontSize: "32px",
        color: "#1e293b"
      }}>
        🏆 Leaderboard
      </h1>
      <p style={{ textAlign: "center", color: "#64748b", marginBottom: "40px" }}>
        Ranked by today's Productive Percentage against your friends!
      </p>

      <div style={{ maxWidth: "600px", margin: "auto" }}>
        {users.length === 0 && (
          <p style={{ textAlign: "center", color: "#64748b" }}>Loading leaderboard...</p>
        )}
        
        {users.map((user, index) => {
          const isYou = user.isYou;

          // 🥇🥈🥉 medals
          let medal = "";
          if (index === 0) medal = "🥇";
          else if (index === 1) medal = "🥈";
          else if (index === 2) medal = "🥉";
          else medal = `#${index + 1}`;

          return (
            <div
              key={user.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: isYou ? "#dcfce7" : "#ffffff",
                color: "#1e293b",
                padding: "20px 25px",
                marginBottom: "15px",
                borderRadius: "12px",
                fontWeight: isYou ? "bold" : "normal",
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                transform: isYou ? "scale(1.02)" : "scale(1)",
                transition: "0.2s"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <span style={{ fontSize: "1.2rem", fontWeight: "bold", width: "30px" }}>{medal}</span>
                <span style={{ fontSize: "1.1rem" }}>
                  {user.name} {isYou && <span style={{ color: "#16a34a", fontSize: "0.9rem" }}>(You)</span>}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{ width: "100px", height: "8px", background: "#e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${user.percentage}%`, background: isYou ? "#22c55e" : "#3b82f6", borderRadius: "10px" }}></div>
                </div>
                <span style={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color: isYou ? "#16a34a" : "#3b82f6",
                  width: "50px",
                  textAlign: "right"
                }}>
                  {user.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Leaderboard;

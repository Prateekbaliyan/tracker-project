import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// 🔥 FORCE DARK TEXT
ChartJS.defaults.color = "#111";

const API_BASE = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [data, setData] = useState(null);
  const [lastAlert, setLastAlert] = useState("");
  const [goal, setGoal] = useState(() => {
    return Number(localStorage.getItem("dailyGoal")) || 120;
  });
  const [goalInput, setGoalInput] = useState(goal);
  const [notifPermission, setNotifPermission] = useState(
    "Notification" in window ? Notification.permission : "default"
  );
  
  const token = localStorage.getItem("token");

  // 🔴 LOGIN CHECK
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const productive = data?.categoryMinutes?.productive || 0;

  const progress = goal > 0
    ? Math.min(((productive / goal) * 100).toFixed(0), 100)
    : 0;

  // 🔥 FETCH DATA WITH TOKEN
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/activity/stats`, {
        headers: {
          Authorization: token
        }
      })
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (
      data?.alertMessage &&
      Notification.permission === "granted" &&
      data.alertMessage !== lastAlert
    ) {
      new Notification("Productivity Alert 🚀", {
        body: data.alertMessage,
      });

      setLastAlert(data.alertMessage);
    }
  }, [data?.alertMessage]);

  if (!data) return <h2 style={{ textAlign: "center", marginTop: "100px", color: "#111" }}>Loading...</h2>;

  const chartData = {
    labels: Object.keys(data.categoryMinutes),
    datasets: [
      {
        label: "Time (mins)",
        data: Object.values(data.categoryMinutes),
        backgroundColor: Object.keys(data.categoryMinutes).map(key => {
            if (key === "distraction") return "#60a5fa";
            if (key === "neutral") return "#3b82f6";
            if (key === "shopping") return "#f59e0b";
            if (key === "productive") return "#22c55e";
            return "#4f46e5";
        }),
        borderRadius: 6
      }
    ]
  };

  const getAlertStyle = () => {
    switch (data?.alertType) {
      case "danger":
        return { background: "#fee2e2", color: "#991b1b" };
      case "warning":
        return { background: "#fef9c3", color: "#854d0e" };
      case "success":
        return { background: "#dcfce7", color: "#166534" };
      default:
        return { background: "#e0f2fe", color: "#075985" };
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "30px",
        color: "#111"
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "auto" }}>

        {/* Heading */}
        <h1 style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "#111"
        }}>
          📊 Productivity Dashboard
        </h1>

        {data?.alertMessage && (
          <div style={{
            ...getAlertStyle(),
            padding: "10px",
            borderRadius: "10px",
            marginBottom: "15px",
            textAlign: "center",
            fontWeight: "bold"
          }}>
            {data.alertMessage}
          </div>
        )}

        {/* 🔥 NOTIFICATION POPUP MODAL */}
        {notifPermission === "default" && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}>
            <div style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "20px",
              textAlign: "center",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
              maxWidth: "400px",
              width: "100%"
            }}>
              <h2 style={{ color: "#1e293b", marginBottom: "10px" }}>🔔 Enable Notifications</h2>
              <p style={{ color: "#475569", marginBottom: "20px" }}>
                Please enable notifications so the system can alert you when your daily focus tasks are completed!
              </p>
              <button
                onClick={() => {
                  if ("Notification" in window) {
                    Notification.requestPermission().then(permission => {
                      console.log("Permission:", permission);
                      setNotifPermission(permission);
                    });
                  }
                }}
                style={{
                  padding: "12px 24px",
                  background: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px",
                  width: "100%",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  transition: "0.2s"
                }}
              >
                Allow Notifications
              </button>
            </div>
          </div>
        )}

        {/* CARDS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px"
        }}>
          <Card title="Total Time" value={`${data.totalMinutes} mins`} />
          <Card title="Top Site" value={data.topSite} />
          <Card title="Streak" value={`${data.streak} Day`} />
          <Card title="Score" value={`${data.score}%`} />
        </div>

        {/* CHART */}
        <div style={{
          marginTop: "40px",
          background: "#fff",
          padding: "20px",
          borderRadius: "15px",
          height: "350px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
        }}>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* INSIGHT */}
        <div style={{
          marginTop: "30px",
          background: "#fff",
          padding: "20px",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
        }}>
          <h3 style={{ color: "#111" }}>🧠 Smart Insight</h3>
          <p style={{ color: "#111", fontWeight: "500", fontSize: "18px" }}>
            {data.summary}
          </p>
        </div>

        <div style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "15px",
          textAlign: "center",
          marginTop: "20px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
        }}>
          <h3 style={{ color: "#111", marginBottom: "10px" }}>
            ⏰ Peak Focus Time
          </h3>
          <p style={{
            color: "#000",
            fontSize: "20px",
            fontWeight: "bold"
          }}>
            {data.peakTime || "No data"}
          </p>
        </div>

        <div style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "15px",
          textAlign: "center",
          marginTop: "20px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
        }}>
          <h3 style={{ color: "#111", marginBottom: "10px" }}>
            📊 Trend
          </h3>
          <p style={{
            color: "#000",
            fontSize: "18px",
            fontWeight: "500"
          }}>
            {data.trend || "No trend"}
          </p>
        </div>

        <div style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "15px",
          marginTop: "20px",
          textAlign: "center",
          boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
        }}>
          <h3 style={{ color: "#111", marginBottom: "15px" }}>🎯 Daily Goal</h3>

          {/* 🔥 INPUT + BUTTON */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="number"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                marginRight: "10px",
                outline: "none"
              }}
            />
            <button
              onClick={() => {
                if (!goalInput || goalInput <= 0) return;
                setGoal(Number(goalInput));
                localStorage.setItem("dailyGoal", Number(goalInput));
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#3b82f6",
                color: "#fff",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Set
            </button>
          </div>

          {/* 🔥 CORRECT TARGET */}
          <p style={{ color: "#475569", fontWeight: "bold" }}>
            Target: {goal} mins
          </p>

          {/* 🔥 PROGRESS */}
          <h2 style={{ color: "#111", fontSize: "28px", margin: "10px 0" }}>
            {progress}%
          </h2>

          <div style={{
            width: "100%",
            height: "12px",
            background: "#e5e7eb",
            borderRadius: "10px",
            overflow: "hidden"
          }}>
            <div style={{
              width: `${progress}%`,
              maxWidth: "100%",
              height: "100%",
              background: "#22c55e",
              borderRadius: "10px"
            }}></div>
          </div>

          {/* 🔥 STATUS */}
          <p style={{ marginTop: "12px", color: "#111", fontWeight: "600" }}>
            {productive >= goal ? "🎯 Goal Achieved!" : "⏳ Keep going!"}
          </p>
        </div>

        <div style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "15px",
          textAlign: "center",
          marginTop: "20px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
        }}>
          <h3 style={{ color: "#111", marginBottom: "10px" }}>🤖 AI Insight</h3>
          <p style={{
            color: "#000",
            fontSize: "18px",
            fontWeight: "500"
          }}>
            {data.smartInsight}
          </p>
        </div>

      </div>
    </div>
  );
}

// 🔥 FIXED CARD COMPONENT
function Card({ title, value }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "15px",
        textAlign: "center",
        boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
      }}
    >
      <h3 style={{
        color: "#475569",      // 👈 DARK TITLE
        fontWeight: "600",
        margin: "0 0 10px 0"
      }}>
        {title}
      </h3>
      <h2 style={{
        color: "#0f172a",         // 👈 DARK VALUE
        fontWeight: "bold",
        margin: "0"
      }}>
        {value}
      </h2>
    </div>
  );
}

export default Dashboard;

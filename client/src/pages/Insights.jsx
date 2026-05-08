import { useEffect, useState } from "react";
import axios from "axios";

function Insights() {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/api/activity/stats")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);
const getInsights = () => {
  let insights = [];

  const productive = Number(data?.categoryMinutes?.productive) || 0;
const distraction = Number(data?.categoryMinutes?.distraction) || 0;
const total = Number(data?.totalMinutes) || 0;

  // 🔴 Personalized distraction
  if (distraction > productive) {
    insights.push({
      text: `⚠️ You spent ${distraction.toFixed(1)} mins on distractions. Try reducing at least 20 mins.`,
      priority: 1
    });
  }

  // 🟡 Personalized productivity
  if (productive < 30) {
    insights.push({
      text: `😴 Only ${productive.toFixed(1)} mins productive. Aim for at least 60 mins.`,
      priority: 2
    });
  }

  // 🟢 Good
  if (productive > 90) {
    insights.push({
      text: `🔥 Awesome! ${productive.toFixed(1)} mins productive.`,
      priority: 3
    });
  }

  // 🔵 Ratio
  if (total > 0) {
    const ratio = (productive / total) * 100;

    if (ratio < 40) {
      insights.push({
        text: `⚠️ Only ${ratio.toFixed(0)}% time is productive.`,
        priority: 1
      });
    } else if (ratio > 70) {
      insights.push({
        text: `💪 ${ratio.toFixed(0)}% of your time is productive. Keep it up!`,
        priority: 3
      });
    }
  }

  // ⚡ Peak time
  if (data?.peakTime) {
    insights.push({
      text: `⚡ Your best focus time is ${data.peakTime}. Plan important work then.`,
      priority: 2
    });
  }

  // fallback
  if (insights.length === 0) {
    insights.push({
      text: "👍 You're doing well today. Keep consistency!",
      priority: 3
    });
  }

  insights.sort((a, b) => a.priority - b.priority);

  return insights;
};

  return (
    <div style={{
      background: "#f1f5f9",
      minHeight: "100vh",
      padding: "30px"
    }}>
      <h1 style={{
        textAlign: "center",
        marginBottom: "30px",
        color: "#111"
      }}>
        🧠 AI Insights
      </h1>

      <div style={{ maxWidth: "600px", margin: "auto" }}>
        <div style={{
          background: "#ffffff",
          padding: "15px",
          borderRadius: "12px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          color: "#111"
        }}>
    {getInsights().map((item, i) => (
  <div key={i} style={{
    background: "#ffffff",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    color: "#111"
  }}>
    {item.text}   
  </div>
))}
        </div>
      </div>
    </div>
  );
}

export default Insights;

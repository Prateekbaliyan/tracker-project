import { useEffect, useState } from "react";
import axios from "axios";

function getLocalDateStr(dateString) {
  const d = new Date(dateString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function Timeline() {
  const [data, setData] = useState({});
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:5000/api/activity/timeline", {
      headers: { Authorization: token }
    })
      .then(res => {
        const rawData = res.data;
        const grouped = {};

        rawData.forEach(item => {
          let date = getLocalDateStr(item.createdAt);

          let domain = item.url;
          try {
            const parsed = new URL(item.url).hostname.replace("www.", "");
            if (parsed) domain = parsed;
          } catch {}

          if (!domain || domain.toLowerCase() === "unknown") {
            domain = "System App";
          }

          if (!grouped[date]) grouped[date] = {};
          if (!grouped[date][domain]) grouped[date][domain] = 0;

          grouped[date][domain] += item.timeSpent;
        });

        setData(grouped);
      })
      .catch(err => console.log(err));
  }, []);

  // 🔥 FILTER LOGIC
  const getFilteredData = () => {
    const today = new Date();
    const todayStr = getLocalDateStr(today);
    let result = {};

    // 🔥 DATE PICKER
    if (selectedDate) {
      if (data[selectedDate]) {
        result[selectedDate] = data[selectedDate];
      }
      return result;
    }

    // 🔥 ALL
    if (filter === "all") return data;

    Object.keys(data).forEach(date => {
      if (filter === "today") {
        if (date === todayStr) {
          result[date] = data[date];
        }
      }
      else if (filter === "yesterday") {
        const yest = new Date();
        yest.setDate(today.getDate() - 1);
        if (date === getLocalDateStr(yest)) {
          result[date] = data[date];
        }
      }
      else if (filter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        // "date" is safe to parse because it's YYYY-MM-DD
        const current = new Date(date);
        if (current >= weekAgo) {
          result[date] = data[date];
        }
      }
    });

    return result;
  };

  const filteredData = getFilteredData();

  return (
    <div style={{
      padding: "30px",
      background: "#f1f5f9",
      minHeight: "100vh",
      color: "#111"
    }}>
      <h1 style={{
        textAlign: "center",
        marginBottom: "30px",
        
        color:"#111"
      }}>
        📊 Activity History
      </h1>

      {/* 🔥 FILTERS */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setSelectedDate("");
          }}
          style={{
            padding: "8px",
            borderRadius: "8px",
            marginRight: "10px"
          }}
        >
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="week">Last 7 Days</option>
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setFilter("");
          }}
          style={{
            padding: "8px",
            borderRadius: "8px"
          }}
        />
      </div>

      {/* 🔥 DATA */}
      <div style={{ maxWidth: "700px", margin: "auto" }}>
        {Object.keys(filteredData).length === 0 && (
          <p style={{ textAlign: "center" }}>No data found</p>
        )}

        {Object.keys(filteredData).map((date, i) => {

          // 🔥 DAILY TOTAL
          const totalTime = Object.values(filteredData[date])
            .reduce((sum, t) => sum + t, 0);

          // 🔥 TOP SITE
          const topSite = Object.entries(filteredData[date])
            .sort((a, b) => b[1] - a[1])[0][0];

          return (
            <div key={i} style={{ marginBottom: "30px" }}>

              {/* 🔥 DATE HEADER */}
              <div style={{
                background: "#ffffff",
                boxShadow:"0 5px 15px rgba(0,0,0,0.1)",
                padding: "12px 15px",
                borderRadius: "10px",
                marginBottom: "10px",
                color:"#111"
              }}>
                <div style={{ fontWeight: "bold" }}>
                  📅 {date}
                </div>

                <div style={{ fontSize: "14px", color: "#38bdf8" }}>
                  Total: {(totalTime / 60).toFixed(2)} mins
                </div>

                <div style={{ fontSize: "13px", color: "#94a3b8" }}>
                  Top: {topSite}
                </div>
              </div>

              {/* 🔥 SITES */}
              {Object.entries(filteredData[date]).map(([domain, time], j) => (
                <div key={j} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: "#ffffff",
                  boxShadow:"0 5px 15px rgba(0,0,0,0.1)",
                  padding: "12px 15px",
                  marginTop: "8px",
                  borderRadius: "10px",
                  color :"#111"
                }}>
                  <span>{domain}</span>

                  <span style={{
                    color: "#38bdf8",
                    fontWeight: "bold"
                  }}>
                    {(time / 60).toFixed(2)} min
                  </span>
                </div>
              ))}

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Timeline;

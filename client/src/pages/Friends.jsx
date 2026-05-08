import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const fetchFriends = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/friends", {
        headers: { Authorization: token }
      });
      setFriends(res.data.friends);
      setRequests(res.data.friendRequests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const sendRequest = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/friends/request", 
        { email: emailInput },
        { headers: { Authorization: token } }
      );
      setMessage({ type: "success", text: res.data.msg });
      setEmailInput("");
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.msg || "Error sending request" });
    }
  };

  const acceptRequest = async (friendId) => {
    try {
      await axios.post("http://localhost:5000/api/friends/accept", 
        { friendId },
        { headers: { Authorization: token } }
      );
      fetchFriends(); // Refresh lists
    } catch (err) {
      console.error("Error accepting request", err);
    }
  };

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "50px", color: "#333" }}>Loading Friends...</h2>;

  return (
    <div style={{
      background: "#f1f5f9",
      minHeight: "100vh",
      padding: "30px",
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#1e293b", fontSize: "32px" }}>👥 Friends & Network</h1>

        {/* Add Friend Section */}
        <div style={{ background: "#fff", padding: "25px", borderRadius: "15px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "1.2rem", color: "#334155", marginBottom: "15px" }}>Add a Friend</h2>
          <form onSubmit={sendRequest} style={{ display: "flex", gap: "10px" }}>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter friend's email"
              required
              style={{ flex: 1, padding: "12px 15px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none" }}
            />
            <button type="submit" style={{ padding: "12px 24px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
              Send Request
            </button>
          </form>
          {message && (
            <p style={{ marginTop: "10px", color: message.type === "error" ? "#ef4444" : "#22c55e", fontWeight: "500" }}>
              {message.text}
            </p>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {/* Pending Requests */}
          <div style={{ background: "#fff", padding: "25px", borderRadius: "15px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
            <h2 style={{ fontSize: "1.2rem", color: "#334155", marginBottom: "15px", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px" }}>
              📥 Pending Requests ({requests.length})
            </h2>
            {requests.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: "20px 0" }}>No pending requests.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {requests.map(req => (
                  <li key={req._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "15px", borderRadius: "8px", marginBottom: "10px" }}>
                    <span style={{ fontWeight: "500", color: "#475569" }}>{req.email}</span>
                    <button 
                      onClick={() => acceptRequest(req._id)}
                      style={{ background: "#22c55e", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                    >
                      Accept
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* My Friends */}
          <div style={{ background: "#fff", padding: "25px", borderRadius: "15px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
            <h2 style={{ fontSize: "1.2rem", color: "#334155", marginBottom: "15px", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px" }}>
              🤝 My Friends ({friends.length})
            </h2>
            {friends.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: "20px 0" }}>You haven't added any friends yet.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {friends.map(friend => (
                  <li key={friend._id} style={{ display: "flex", alignItems: "center", gap: "15px", background: "#f8fafc", padding: "15px", borderRadius: "8px", marginBottom: "10px" }}>
                    <div style={{ width: "36px", height: "36px", background: "#e2e8f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontWeight: "bold", fontSize: "1.1rem" }}>
                      {friend.email.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: "500", color: "#475569", fontSize: "1.05rem" }}>{friend.email}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;

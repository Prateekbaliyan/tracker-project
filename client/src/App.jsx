import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Timeline from "./pages/Timeline";
import Insights from "./pages/Insights";
import Leaderboard from "./pages/Leaderboard";
import Downloads from "./pages/Downloads";
import Friends from "./pages/Friends";

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav style={{ padding: "15px", background: "#fff", display: "flex", gap: "20px", justifyContent: "center", alignItems: "center", marginBottom: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", fontWeight: "bold" }}>
      <Link to="/" style={{ textDecoration: "none", color: "#333" }}>Dashboard</Link>
      <Link to="/timeline" style={{ textDecoration: "none", color: "#333" }}>Timeline</Link>
      <Link to="/insights" style={{ textDecoration: "none", color: "#333" }}>Insights</Link>
      <Link to="/leaderboard" style={{ textDecoration: "none", color: "#333" }}>Leaderboard</Link>
      <Link to="/downloads" style={{ textDecoration: "none", color: "#333" }}>Downloads</Link>
      <Link to="/friends" style={{ textDecoration: "none", color: "#333" }}>Friends</Link>
      <button 
        onClick={handleLogout} 
        style={{ background: "#ef4444", color: "white", border: "none", padding: "8px 15px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginLeft: "20px", transition: "0.2s" }}
      >
        Logout
      </button>
    </nav>
  );
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/timeline" element={<ProtectedRoute><Timeline /></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/downloads" element={<ProtectedRoute><Downloads /></ProtectedRoute>} />
        <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
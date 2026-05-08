import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const res = await axios.post(`http://localhost:5000${endpoint}`, {
        email,
        password
      });

      if (isLogin) {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          window.location.href = "/";
        } else {
          setError(res.data.message || "Invalid credentials");
        }
      } else {
        // Registration case
        if (res.data.message === "User registered successfully") {
          setIsLogin(true);
          setSuccess("Account created successfully! Please log in.");
          setPassword(""); // Clear password for security
        } else {
          setError(res.data.message || "Registration failed");
        }
      }
    } catch (err) {
      console.log(err);
      setError(isLogin ? "Login failed" : "Registration failed. Email might already exist.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f1f5f9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "#fff",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center"
      }}>
        <h2 style={{
          color: "#1e293b",
          marginBottom: "10px",
          fontSize: "28px",
          fontWeight: "bold"
        }}>{isLogin ? "Welcome Back 👋" : "Create Account 🚀"}</h2>
        
        <p style={{ color: "#64748b", marginBottom: "30px" }}>
          {isLogin ? "Log in to view your productivity stats" : "Join us to start tracking your time"}
        </p>
        
        {error && <div style={{
          background: "#fee2e2",
          color: "#991b1b",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontWeight: "bold"
        }}>{error}</div>}

        {success && <div style={{
          background: "#dcfce7",
          color: "#166534",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontWeight: "bold"
        }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "8px", color: "#475569", fontWeight: "600" }}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                outline: "none",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "30px", textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "8px", color: "#475569", fontWeight: "600" }}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                outline: "none",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.2s background",
              marginBottom: "15px"
            }}
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p style={{ color: "#475569", fontSize: "14px", marginTop: "10px" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
            }} 
            style={{
              background: "none",
              border: "none",
              color: "#3b82f6",
              fontWeight: "bold",
              cursor: "pointer",
              marginLeft: "5px",
              fontSize: "14px"
            }}
          >
            {isLogin ? "Create one" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;

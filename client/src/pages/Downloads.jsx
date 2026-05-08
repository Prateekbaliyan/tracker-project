import React from "react";

const Downloads = () => {
  return (
    <div style={{
      background: "#f1f5f9",
      minHeight: "100vh",
      padding: "30px",
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        maxWidth: "900px", margin: "auto", padding: "40px",
        background: "#fff", borderRadius: "15px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
        color: "#333"
      }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "10px", color: "#1e293b" }}>Download Center</h1>
          <p style={{ fontSize: "1.1rem", color: "#64748b" }}>Get the AI Productivity Tracker tools to start analyzing your work.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
          {/* Desktop App */}
          <div style={{
            padding: "30px", border: "1px solid #e2e8f0", borderRadius: "12px",
            display: "flex", flexDirection: "column", background: "#f8fafc"
          }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#2563eb", display: "flex", alignItems: "center", gap: "10px" }}>
              🖥️ Desktop Tracker App
            </h2>
            <p style={{ color: "#475569", flexGrow: 1, marginBottom: "20px", lineHeight: "1.6" }}>
              The core desktop application. It runs in the background and tracks your application usage on Windows.
            </p>
            <a
              href="/downloads/system-tracker-setup.exe"
              download
              style={{
                display: "block", textAlign: "center", padding: "12px 20px",
                background: "#2563eb", color: "#fff", textDecoration: "none",
                borderRadius: "8px", fontWeight: "bold", fontSize: "1rem", transition: "background 0.3s"
              }}
            >
              Download Desktop App (.exe)
            </a>

            <div style={{ marginTop: "25px", padding: "20px", background: "#e0e7ff", borderRadius: "8px" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#1e40af" }}>Setup Instructions:</h4>
              <ol style={{ margin: 0, paddingLeft: "20px", color: "#3730a3", fontSize: "0.95rem", lineHeight: "1.5" }}>
                <li>Click the download button above.</li>
                <li>Run the <b>system-tracker-setup.exe</b> file.</li>
                <li>Follow the installer instructions.</li>
                <li>Login with your account to start tracking!</li>
              </ol>
            </div>
          </div>

          {/* Chrome Extension */}
          <div style={{
            padding: "30px", border: "1px solid #e2e8f0", borderRadius: "12px",
            display: "flex", flexDirection: "column", background: "#f8fafc"
          }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#ea4335", display: "flex", alignItems: "center", gap: "10px" }}>
              🌐 Chrome Extension
            </h2>
            <p style={{ color: "#475569", flexGrow: 1, marginBottom: "20px", lineHeight: "1.6" }}>
              Tracks your web browsing activity and productive URLs. Works alongside the desktop app.
            </p>
            <a
              href="/downloads/extension.zip"
              download
              style={{
                display: "block", textAlign: "center", padding: "12px 20px",
                background: "#ea4335", color: "#fff", textDecoration: "none",
                borderRadius: "8px", fontWeight: "bold", fontSize: "1rem", transition: "background 0.3s"
              }}
            >
              Download Extension (.zip)
            </a>

            <div style={{ marginTop: "25px", padding: "20px", background: "#fee2e2", borderRadius: "8px" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#991b1b" }}>Setup Instructions:</h4>
              <ol style={{ margin: 0, paddingLeft: "20px", color: "#7f1d1d", fontSize: "0.95rem", lineHeight: "1.5" }}>
                <li>Extract the downloaded <b>extension.zip</b> file.</li>
                <li>Open Chrome and go to <b>chrome://extensions/</b>.</li>
                <li>Enable <b>Developer mode</b> in the top right.</li>
                <li>Click <b>Load unpacked</b> and select the extracted folder.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Downloads;

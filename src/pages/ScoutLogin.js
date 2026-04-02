import React, { useState } from "react";
import { loginUser, registerUser } from "../utils/localAuth";

export default function ScoutLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) { alert("Enter username and password"); return; }
    try {
      if (mode === "login") {
        loginUser(username, password);
      } else {
        registerUser(username, password);
        alert("Account created! Now log in.");
        setMode("login");
        return;
      }
      window.location.href = "/";
    } catch (err) {
      alert(err.message || "Error");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "24px 20px",
      background: "var(--bg-base)"
    }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{
          width: 72, height: 72,
          borderRadius: 20,
          background: "linear-gradient(135deg, var(--red) 0%, var(--blue) 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
          boxShadow: "0 0 40px rgba(59,130,246,0.2)"
        }}>
          <svg width="36" height="36" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 6 }}>EHP Scout</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>FRC Scouting Platform</p>
      </div>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 360,
        background: "var(--bg-card)",
        borderRadius: 20,
        border: "1px solid var(--border)",
        padding: "28px 24px",
        boxShadow: "0 24px 48px rgba(0,0,0,0.4)"
      }}>
        {/* Mode toggle */}
        <div style={{
          display: "flex",
          background: "var(--bg-surface)",
          borderRadius: 10,
          padding: 4,
          marginBottom: 24
        }}>
          {["login", "register"].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: 8,
                background: mode === m ? "var(--bg-card)" : "transparent",
                color: mode === m ? "var(--text-primary)" : "var(--text-muted)",
                fontWeight: mode === m ? 600 : 400,
                fontSize: 14,
                border: mode === m ? "1px solid var(--border)" : "1px solid transparent",
                boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.3)" : "none"
              }}
            >
              {m === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6, letterSpacing: "0.03em" }}>
              USERNAME
            </label>
            <input
              placeholder="your_username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6, letterSpacing: "0.03em" }}>
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" style={{
            width: "100%", padding: "14px 0",
            fontSize: 15, fontWeight: 700,
            background: "var(--blue)",
            borderRadius: 12,
            boxShadow: "0 4px 16px rgba(59,130,246,0.3)"
          }}>
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>

      <p style={{ marginTop: 24, fontSize: 12, color: "var(--text-muted)" }}>
        Built for FIRST Robotics Competition
      </p>
    </div>
  );
}

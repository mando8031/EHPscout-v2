import React, { useState } from "react";
import { loginUser, registerUser } from "../utils/localAuth";

const ScoutLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    try {
      if (mode === "login") {
        loginUser(username, password);
      } else {
        registerUser(username, password);
        alert("Account created! Now log in.");
        setMode("login");
        return;
      }

      window.location.href = "/team-select";
    } catch (err) {
      console.error("Auth error:", err);
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
      padding: 20,
      background: "linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)"
    }}>
      {/* Logo/Title */}
      <div style={{
        marginBottom: 40,
        textAlign: "center"
      }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          background: "linear-gradient(135deg, #ef4444 0%, #3b82f6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)"
        }}>
          <svg width="40" height="40" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          margin: 0,
          background: "linear-gradient(135deg, #f0f0f5 0%, #9898a8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          EHP Scout
        </h1>
        <p style={{
          color: "#6b6b78",
          fontSize: 14,
          marginTop: 8
        }}>
          FRC Scouting Made Simple
        </p>
      </div>

      {/* Login Card */}
      <div style={{
        width: "100%",
        maxWidth: 380,
        background: "#12121a",
        borderRadius: 20,
        padding: 24,
        border: "1px solid #2a2a38"
      }}>
        <h2 style={{
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 24,
          textAlign: "center",
          color: "#f0f0f5"
        }}>
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              color: "#9898a8",
              marginBottom: 8
            }}>
              Username
            </label>
            <input
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              color: "#9898a8",
              marginBottom: 8
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: 16,
              fontSize: 16,
              fontWeight: 600,
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              borderRadius: 12,
              marginBottom: 12
            }}
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          style={{
            width: "100%",
            padding: 14,
            background: "transparent",
            border: "1px solid #2a2a38",
            color: "#9898a8",
            borderRadius: 12,
            fontWeight: 500
          }}
        >
          {mode === "login" ? "Create New Account" : "Already have an account?"}
        </button>
      </div>

      {/* Footer */}
      <p style={{
        marginTop: 32,
        fontSize: 12,
        color: "#6b6b78"
      }}>
        Built for FIRST Robotics Competition
      </p>
    </div>
  );
};

export default ScoutLogin;

import React from "react";
import { useNavigate } from "react-router-dom";

export default function NoEvent() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "calc(100vh - 100px)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      textAlign: "center"
    }}>
      {/* Icon */}
      <div style={{
        width: 80,
        height: 80,
        borderRadius: 20,
        background: "#12121a",
        border: "1px solid #2a2a38",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24
      }}>
        <svg width="40" height="40" fill="none" stroke="#6b6b78" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      {/* Text */}
      <h1 style={{
        fontSize: 24,
        fontWeight: 700,
        marginBottom: 8,
        color: "#f0f0f5"
      }}>
        No Event Selected
      </h1>
      <p style={{
        fontSize: 15,
        color: "#6b6b78",
        marginBottom: 32,
        maxWidth: 280
      }}>
        Select an event to start scouting or view team rankings.
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/event-select")}
        style={{
          padding: "16px 32px",
          fontSize: 16,
          fontWeight: 600,
          background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)"
        }}
      >
        Select Event
      </button>
    </div>
  );
}

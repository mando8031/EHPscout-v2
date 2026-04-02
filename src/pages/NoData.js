import React from "react";
import { useNavigate } from "react-router-dom";

export default function NoData() {
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>

      {/* Text */}
      <h1 style={{
        fontSize: 24,
        fontWeight: 700,
        marginBottom: 8,
        color: "#f0f0f5"
      }}>
        No Data Yet
      </h1>
      <p style={{
        fontSize: 15,
        color: "#6b6b78",
        marginBottom: 32,
        maxWidth: 280
      }}>
        No teams have been scouted for this event yet. Start scouting to see rankings!
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/scout")}
        style={{
          padding: "16px 32px",
          fontSize: 16,
          fontWeight: 600,
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(239, 68, 68, 0.3)"
        }}
      >
        Start Scouting
      </button>
    </div>
  );
}

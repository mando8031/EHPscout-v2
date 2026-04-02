import React, { useState } from "react";

export default function CreateTeam() {
  const [teamName, setTeamName] = useState("");

  const handleCreate = () => {
    if (!teamName) return;

    const teams = JSON.parse(localStorage.getItem("teams") || "[]");

    teams.push({
      name: teamName,
      members: []
    });

    localStorage.setItem("teams", JSON.stringify(teams));
    alert("Team created!");
  };

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: "0 auto" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 24,
        paddingTop: 8
      }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>Create Team</h1>
          <p style={{ margin: 0, fontSize: 13, color: "#6b6b78" }}>
            Set up a new scouting team
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div style={{
        padding: 20,
        borderRadius: 16,
        background: "#12121a",
        border: "1px solid #2a2a38"
      }}>
        <label style={{
          display: "block",
          fontSize: 13,
          fontWeight: 500,
          color: "#9898a8",
          marginBottom: 8
        }}>
          Team Name
        </label>
        <input
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
          placeholder="Enter team name"
          style={{ marginBottom: 20 }}
        />

        <button
          onClick={handleCreate}
          disabled={!teamName}
          style={{
            width: "100%",
            padding: 16,
            fontSize: 16,
            fontWeight: 600,
            background: teamName 
              ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" 
              : "#1a1a24",
            borderRadius: 12,
            color: teamName ? "white" : "#6b6b78"
          }}
        >
          Create Team
        </button>
      </div>
    </div>
  );
}

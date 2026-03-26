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
    <div style={{ padding: "20px", color: "white" }}>
      <h1>Create Team</h1>

      <input
        value={teamName}
        onChange={e => setTeamName(e.target.value)}
        placeholder="Team name"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button onClick={handleCreate} style={{ width: "100%", padding: "15px" }}>
        Create
      </button>
    </div>
  );
}

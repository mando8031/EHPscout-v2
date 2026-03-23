import React, { useState } from "react";
import { joinTeam } from "../utils/localTeams";
import { getCurrentUser } from "../utils/localAuth";

const JoinTeam = () => {

  const [teamId, setTeamId] = useState("");

  const handleJoin = () => {

    const user = getCurrentUser();
    if (!user) {
      alert("You must be logged in");
      return;
    }

    try {
      joinTeam(teamId, user.username);
      alert("Joined team!");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Join Team</h1>

      <input
        placeholder="Team ID"
        value={teamId}
        onChange={(e) => setTeamId(e.target.value)}
      />

      <button onClick={handleJoin}>Join</button>
    </div>
  );
};

export default JoinTeam;

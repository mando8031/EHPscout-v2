import React, { useState } from "react";
import { createTeam } from "../utils/localTeams";

const CreateTeam = () => {

  const [name, setName] = useState("");

  const handleCreate = () => {
    const team = createTeam(name);
    alert("Team created: " + team.name);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Team</h1>

      <input
        placeholder="Team Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={handleCreate}>Create</button>
    </div>
  );
};

export default CreateTeam;

import React, { useState } from "react";
import { createTeam } from "../utils/localTeams";
import { getCurrentUser } from "../utils/localAuth";

const CreateTeam = () => {

  const [name, setName] = useState("");

  const handleCreate = () => {

    if (!name) {
      alert("Enter a team name");
      return;
    }

    try {
      const user = getCurrentUser();

      const team = createTeam(name, user.username);

      alert(`Team created! Join Code: ${team.code}`);

      //  FORCE FULL RELOAD so App.js updates userHasTeam
      window.location.href = "/dashboard";

    } catch (err) {
      console.error(err);
      alert("Error creating team");
    }
  };

  return (
    <div>
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

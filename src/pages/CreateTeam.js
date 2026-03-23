import React, { useState } from "react";
import { createTeam } from "../utils/localTeams";
import { getCurrentUser } from "../utils/localAuth";
import { useNavigate } from "react-router-dom";

const CreateTeam = () => {

  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleCreate = () => {

    const user = getCurrentUser();

    const team = createTeam(name, user.username);

    alert(`Team created! Join Code: ${team.code}`);

    navigate("/dashboard");
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

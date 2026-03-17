import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";

import {
collection,
addDoc,
doc,
updateDoc,
query,
where,
getDocs
} from "firebase/firestore";

function generateCode() {
return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const CreateTeam = () => {

const navigate = useNavigate();

const [teamName, setTeamName] = useState("");
const [creating, setCreating] = useState(false);

async function createTeam(e) {


e.preventDefault();

const user = auth.currentUser;

if (!user) {
  alert("Not logged in");
  return;
}

if (!teamName.trim()) {
  alert("Enter a team name");
  return;
}

setCreating(true);

try {

  // Prevent duplicate team names
  const teamQuery = query(
    collection(db, "teams"),
    where("name", "==", teamName.trim())
  );

  const existing = await getDocs(teamQuery);

  if (!existing.empty) {
    alert("A team with this name already exists.");
    setCreating(false);
    return;
  }

  const joinCode = generateCode();

  const teamRef = await addDoc(
    collection(db, "teams"),
    {
      name: teamName.trim(),
      joinCode: joinCode,
      createdBy: user.uid,
      createdAt: new Date()
    }
  );

  const teamId = teamRef.id;

  await updateDoc(
    doc(db, "users", user.uid),
    {
      role: "admin",
      teamId: teamId
    }
  );

  // Immediately go to dashboard
  navigate("/dashboard");

} catch (err) {

  console.error(err);
  alert("Error creating team");

}

setCreating(false);


}

return (


<div style={{ maxWidth: "500px", margin: "auto" }}>

  <h1>Create Team</h1>

  <form onSubmit={createTeam}>

    <input
      placeholder="Team Name"
      value={teamName}
      onChange={(e)=>setTeamName(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        marginBottom: "15px"
      }}
    />

    <button
      type="submit"
      style={{
        width: "100%",
        padding: "12px"
      }}
    >
      {creating ? "Creating..." : "Create Team"}
    </button>

  </form>

</div>


);

};

export default CreateTeam;

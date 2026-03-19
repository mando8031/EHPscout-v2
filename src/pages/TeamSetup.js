import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";

function generateCode() {
return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const TeamSetup = () => {

const navigate = useNavigate();
const [teamName, setTeamName] = useState("");
const [loading, setLoading] = useState(false);

async function createTeam(e) {


e.preventDefault();

if (!teamName.trim()) {
  alert("Please enter a team name");
  return;
}

const user = auth.currentUser;

if (!user) {
  alert("User not logged in");
  return;
}

setLoading(true);

try {

      const teamRef = await addDoc(collection(db, "teams"), {
        name: teamName.trim(),
        joinCode: generateCode(),
        createdBy: user.uid,
        adminUid: user.uid,   
        createdAt: new Date()
});
  });

  await updateDoc(doc(db, "users", user.uid), {
    role: "admin",
    teamId: teamRef.id
  });

  // hard redirect guarantees dashboard loads
  window.location.href = "/dashboard";

} catch (err) {

  console.error("Create team error:", err);
  alert("Failed to create team");

}

setLoading(false);


}

function goJoin() {
navigate("/join-team");
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
      disabled={loading}
      style={{
        width: "100%",
        padding: "12px"
      }}
    >
      {loading ? "Creating..." : "Create Team"}
    </button>

  </form>

  <hr style={{ margin: "40px 0" }} />

  <h2>Join Team</h2>

  <button
    onClick={goJoin}
    style={{
      width: "100%",
      padding: "12px"
    }}
  >
    Join Existing Team
  </button>

</div>


);

};

export default TeamSetup;

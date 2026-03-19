import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
collection,
addDoc,
query,
where,
getDocs,
updateDoc,
doc
} from "firebase/firestore";

const TeamSetup = () => {

const navigate = useNavigate();

const [teamName, setTeamName] = useState("");
const [joinCode, setJoinCode] = useState("");
const [loading, setLoading] = useState(false);

function generateCode() {
return Math.random().toString(36).substring(2, 8).toUpperCase();
}

//  CREATE TEAM
async function createTeam() {


if (!teamName.trim()) {
  alert("Enter a team name");
  return;
}

setLoading(true);

try {

  const user = auth.currentUser;
  if (!user) return;

  //  Prevent duplicate team names
  const q = query(
    collection(db, "teams"),
    where("name", "==", teamName.trim())
  );

  const existing = await getDocs(q);

  if (!existing.empty) {
    alert("Team name already exists");
    setLoading(false);
    return;
  }

  const code = generateCode();

  //  CREATE TEAM WITH adminUid (CRITICAL FIX)
  const teamRef = await addDoc(collection(db, "teams"), {
    name: teamName.trim(),
    joinCode: code,
    adminUid: user.uid,
    createdAt: new Date(),
    eventKey: "",
    eventName: ""
  });

  //  LINK USER TO TEAM AS ADMIN
  await updateDoc(doc(db, "users", user.uid), {
    teamId: teamRef.id,
    role: "admin"
  });

  // 🚀 GO TO DASHBOARD IMMEDIATELY
  navigate("/dashboard");

} catch (err) {

  console.error("Create team error:", err);
  alert("Failed to create team");

}

setLoading(false);


}

//  JOIN TEAM
async function joinTeam() {


if (!joinCode.trim()) {
  alert("Enter a join code");
  return;
}

setLoading(true);

try {

  const user = auth.currentUser;
  if (!user) return;

  const q = query(
    collection(db, "teams"),
    where("joinCode", "==", joinCode.trim().toUpperCase())
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    alert("Team not found");
    setLoading(false);
    return;
  }

  const teamDoc = snap.docs[0];

  //  LINK USER AS SCOUT
  await updateDoc(doc(db, "users", user.uid), {
    teamId: teamDoc.id,
    role: "scout"
  });

  // 🚀 GO TO DASHBOARD
  navigate("/dashboard");

} catch (err) {

  console.error("Join team error:", err);
  alert("Failed to join team");

}

setLoading(false);


}

return (


<div style={{ maxWidth: "500px", margin: "auto" }}>

  <h1>Team Setup</h1>

  {/* CREATE TEAM */}
  <div style={{
    border: "1px solid #444",
    padding: "20px",
    marginBottom: "20px"
  }}>

    <h2>Create Team</h2>

    <input
      placeholder="Team Name"
      value={teamName}
      onChange={(e)=>setTeamName(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        marginBottom: "10px"
      }}
    />

    <button
      onClick={createTeam}
      disabled={loading}
      style={{ width: "100%", padding: "12px" }}
    >
      Create Team
    </button>

  </div>

  {/* JOIN TEAM */}
  <div style={{
    border: "1px solid #444",
    padding: "20px"
  }}>

    <h2>Join Team</h2>

    <input
      placeholder="Enter Join Code"
      value={joinCode}
      onChange={(e)=>setJoinCode(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        marginBottom: "10px"
      }}
    />

    <button
      onClick={joinTeam}
      disabled={loading}
      style={{ width: "100%", padding: "12px" }}
    >
      Join Team
    </button>

  </div>

</div>


);

};

export default TeamSetup;

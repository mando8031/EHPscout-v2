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

//  CREATE TEAM (FORM SUBMIT)
async function handleCreate(e) {
e.preventDefault();


if (!teamName.trim()) {
  alert("Enter a team name");
  return;
}

setLoading(true);

try {

  const user = auth.currentUser;
  if (!user) {
    alert("Not logged in");
    return;
  }

  // prevent duplicate names
  const q = query(
    collection(db, "teams"),
    where("name", "==", teamName.trim())
  );

  const existing = await getDocs(q);

  if (!existing.empty) {
    alert("Team already exists");
    setLoading(false);
    return;
  }

  const code = generateCode();

  const teamRef = await addDoc(collection(db, "teams"), {
    name: teamName.trim(),
    joinCode: code,
    adminUid: user.uid, //  CRITICAL FIX
    createdAt: new Date(),
    eventKey: "",
    eventName: ""
  });

  await updateDoc(doc(db, "users", user.uid), {
    teamId: teamRef.id,
    role: "admin"
  });

  // force redirect (more reliable than navigate sometimes)
  window.location.href = "/dashboard";

} catch (err) {

  console.error("CREATE ERROR:", err);
  alert("Failed to create team");

}

setLoading(false);


}

//  JOIN TEAM
async function handleJoin(e) {
e.preventDefault();


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

  await updateDoc(doc(db, "users", user.uid), {
    teamId: teamDoc.id,
    role: "scout"
  });

  window.location.href = "/dashboard";

} catch (err) {

  console.error("JOIN ERROR:", err);
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

    <form onSubmit={handleCreate}>

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
        type="submit"
        disabled={loading}
        style={{ width: "100%", padding: "12px" }}
      >
        {loading ? "Creating..." : "Create Team"}
      </button>

    </form>

  </div>

  {/* JOIN TEAM */}
  <div style={{
    border: "1px solid #444",
    padding: "20px"
  }}>

    <h2>Join Team</h2>

    <form onSubmit={handleJoin}>

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
        type="submit"
        disabled={loading}
        style={{ width: "100%", padding: "12px" }}
      >
        {loading ? "Joining..." : "Join Team"}
      </button>

    </form>

  </div>

</div>


);

};

export default TeamSetup;

import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const Dashboard = () => {

const [eventName, setEventName] = useState("");

useEffect(() => {


async function loadTeam() {

  try {

    const user = auth.currentUser;
    if (!user) return;

    const userSnap = await getDoc(doc(db, "users", user.uid));
    if (!userSnap.exists()) return;

    const teamId = userSnap.data().teamId;

    const teamSnap = await getDoc(doc(db, "teams", teamId));
    if (!teamSnap.exists()) return;

    const teamData = teamSnap.data();

    setEventName(teamData.eventName || "No event selected");

  } catch (err) {

    console.error("Dashboard error:", err);

  }

}

loadTeam();


}, []);

return (


<div>

  <h1>Dashboard</h1>

  <div style={{
    border: "1px solid #444",
    padding: "20px",
    marginBottom: "20px"
  }}>
    <h2>Current Event</h2>
    <div style={{ fontSize: "20px" }}>
      {eventName}
    </div>
  </div>

  <p>Welcome to your scouting dashboard.</p>

</div>

);

};

export default Dashboard;

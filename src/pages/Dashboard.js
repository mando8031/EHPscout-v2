import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

const [eventName, setEventName] = useState("Loading...");
const navigate = useNavigate();

useEffect(() => {


async function loadTeam() {

  try {

    const user = auth.currentUser;

    if (!user) {
      navigate("/login");
      return;
    }

    //  get user doc
    const userSnap = await getDoc(doc(db, "users", user.uid));

    if (!userSnap.exists()) {
      navigate("/team");
      return;
    }

    const userData = userSnap.data();
    const teamId = userData.teamId;

    //  no team → go back
    if (!teamId) {
      navigate("/team");
      return;
    }

    //  get team doc
    const teamSnap = await getDoc(doc(db, "teams", teamId));

    //  team missing → FIX BROKEN STATE
    if (!teamSnap.exists()) {
      console.error("Team does not exist");
      navigate("/team");
      return;
    }

    const teamData = teamSnap.data();

    setEventName(
      teamData.eventName && teamData.eventName !== ""
        ? teamData.eventName
        : "No event selected"
    );

  } catch (err) {

    console.error("Dashboard error:", err);
    setEventName("Error loading event");

  }

}

loadTeam();


}, [navigate]);

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

import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
doc,
getDoc,
updateDoc,
collection,
query,
where,
getDocs
} from "firebase/firestore";

const AdminPage = () => {

const [teamId, setTeamId] = useState("");
const [joinCode, setJoinCode] = useState("");
const [events, setEvents] = useState([]);
const [selectedEvent, setSelectedEvent] = useState("");
const [members, setMembers] = useState([]);

useEffect(() => {


async function loadData() {

  try {

    const user = auth.currentUser;
    if (!user) return;

    const userSnap = await getDoc(doc(db, "users", user.uid));
    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    setTeamId(userData.teamId);

    // team data
    const teamSnap = await getDoc(doc(db, "teams", userData.teamId));

    if (teamSnap.exists()) {
      const teamData = teamSnap.data();
      setJoinCode(teamData.joinCode || "");
      setSelectedEvent(teamData.eventKey || "");
    }

    // load members
    const q = query(
      collection(db, "users"),
      where("teamId", "==", userData.teamId)
    );

    const snap = await getDocs(q);

    const list = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setMembers(list);

    // load events
    const res = await fetch(
      "https://www.thebluealliance.com/api/v3/events/2026",
      {
        headers: {
          "X-TBA-Auth-Key": process.env.REACT_APP_TBA_KEY
        }
      }
    );

    const eventData = await res.json();
    setEvents(eventData);

  } catch (err) {
    console.error("Admin load error:", err);
  }

}

loadData();


}, []);

async function saveEvent(e) {


e.preventDefault();

if (!teamId || !selectedEvent) {
  alert("Select an event");
  return;
}

try {

  const selected = events.find(ev => ev.key === selectedEvent);

  await updateDoc(doc(db, "teams", teamId), {
    eventKey: selectedEvent,
    eventName: selected ? selected.name : ""
  });

  alert("Event saved");

} catch (err) {
  console.error("Save error:", err);
  alert("Failed to save event");
}


}

//  REMOVE MEMBER
async function removeMember(memberId) {


if (!window.confirm("Remove this user from team?")) return;

try {

  await updateDoc(doc(db, "users", memberId), {
    teamId: null,
    role: "scout"
  });

  setMembers(prev => prev.filter(m => m.id !== memberId));

} catch (err) {
  console.error("Remove error:", err);
}


}

//  TRANSFER ADMIN
async function makeAdmin(memberId) {


if (!window.confirm("Transfer admin role?")) return;

try {

  await updateDoc(doc(db, "teams", teamId), {
    adminUid: memberId
  });

  await updateDoc(doc(db, "users", memberId), {
    role: "admin"
  });

  await updateDoc(doc(db, "users", auth.currentUser.uid), {
    role: "scout"
  });

  alert("Admin transferred");
  window.location.reload();

} catch (err) {
  console.error("Transfer error:", err);
}


}

return (


<div style={{ maxWidth: "700px", margin: "auto" }}>

  <h1>Admin Panel</h1>

  {/* JOIN CODE */}
  <div style={{
    border: "1px solid #444",
    padding: "20px",
    marginBottom: "20px"
  }}>
    <h2>Join Code</h2>
    <div style={{ fontSize: "24px" }}>
      {joinCode}
    </div>
  </div>

  {/* EVENT SELECT */}
  <div style={{
    border: "1px solid #444",
    padding: "20px",
    marginBottom: "20px"
  }}>

    <h2>Select Event</h2>

    <form onSubmit={saveEvent}>

      <select
        value={selectedEvent}
        onChange={(e)=>setSelectedEvent(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px"
        }}
      >

        <option value="">-- Select Event --</option>

        {events.map(event => (
          <option key={event.key} value={event.key}>
            {event.name}
          </option>
        ))}

      </select>

      <button style={{ width: "100%", padding: "12px" }}>
        Save Event
      </button>

    </form>

  </div>

  {/* TEAM MEMBERS */}
  <div style={{
    border: "1px solid #444",
    padding: "20px"
  }}>

    <h2>Team Members</h2>

    {members.map(member => (

      <div key={member.id} style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px"
      }}>

        <span>
          {member.email || member.id} ({member.role || "scout"})
        </span>

        {member.id !== auth.currentUser.uid && (
          <div>

            <button
              onClick={()=>makeAdmin(member.id)}
              style={{ marginRight: "5px" }}
            >
              Make Admin
            </button>

            <button
              onClick={()=>removeMember(member.id)}
            >
              Remove
            </button>

          </div>
        )}

      </div>

    ))}

  </div>

</div>


);

};

export default AdminPage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MatchList = () => {

const navigate = useNavigate();
const [matches, setMatches] = useState([]);

useEffect(() => {


async function loadMatches() {

  try {

    const user = auth.currentUser;
    if (!user) return;

    const userSnap = await getDoc(doc(db, "users", user.uid));
    if (!userSnap.exists()) return;

    const teamId = userSnap.data().teamId;

    const teamSnap = await getDoc(doc(db, "teams", teamId));
    if (!teamSnap.exists()) return;

    const eventKey = teamSnap.data().eventKey;

    if (!eventKey) {
      alert("No event selected by admin");
      return;
    }

    const res = await fetch(
      "https://www.thebluealliance.com/api/v3/event/" +
      eventKey +
      "/matches/simple",
      {
        headers: {
          "X-TBA-Auth-Key": process.env.REACT_APP_TBA_KEY
        }
      }
    );

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Bad API response:", data);
      return;
    }

    const qm = data.filter(m => m.comp_level === "qm");

    setMatches(qm);

  } catch (err) {

    console.error("Match load error:", err);

  }

}

loadMatches();


}, []);

return (


<div>

  <h1>Matches</h1>

  {matches.length === 0 && (
    <p>No matches loaded</p>
  )}

  {matches.map(match => (

    <div
      key={match.key}
      onClick={() => navigate("/scout/" + match.match_number)}
      style={{
        border: "1px solid #444",
        padding: "10px",
        marginBottom: "10px",
        cursor: "pointer"
      }}
    >
      Match {match.match_number}
    </div>

  ))}

</div>


);

};

export default MatchList;

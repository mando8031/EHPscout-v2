import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
collection,
addDoc,
serverTimestamp,
query,
where,
getDocs
} from "firebase/firestore";

import { db } from "../firebase";

const ScoutForm = () => {

const { eventKey, matchNumber } = useParams();
const navigate = useNavigate();

const scoutName = localStorage.getItem("scoutName") || "Unknown";

const [team, setTeam] = useState("");

const [auton, setAuton] = useState(5);
const [accuracy, setAccuracy] = useState(5);

const [climb, setClimb] = useState("none");
const [movement, setMovement] = useState("1");
const [intake, setIntake] = useState("none");

const [submitting, setSubmitting] = useState(false);

async function submitScout(e) {


e.preventDefault();

if (!team) {
  alert("Enter team number");
  return;
}

setSubmitting(true);

try {

  const existingQuery = query(
    collection(db,"scouting"),
    where("matchNumber","==",Number(matchNumber)),
    where("team","==",Number(team))
  );

  const existing = await getDocs(existingQuery);

  if (!existing.empty) {
    alert("This team was already scouted for this match.");
    setSubmitting(false);
    return;
  }

  const climbScore =
    climb === "L3" ? 10 :
    climb === "L2" ? 6 :
    climb === "L1" ? 3 : 0;

  const movementScore = Number(movement);
  const intakeScore = Number(intake);

  const overall =
    Number(auton) * 2 +
    Number(accuracy) * 2 +
    climbScore +
    movementScore +
    intakeScore;

  const payload = {

    eventKey,
    matchNumber: Number(matchNumber),

    team: Number(team),

    auton: Number(auton),
    climb,
    movement,
    intake,
    accuracy: Number(accuracy),

    overall,

    scout: scoutName,

    created: serverTimestamp()

  };

  await addDoc(collection(db,"scouting"), payload);

  alert("Saved!");

  navigate(-1);

} catch(err){

  console.error(err);
  alert("Error saving");

}

setSubmitting(false);


}

const buttonStyle = (selected) => ({
flex:1,
padding:"18px",
fontSize:"18px",
borderRadius:"10px",
border:"none",
background:selected ? "#3498db":"#ecf0f1",
color:selected ? "white":"black"
});

return (


<div style={{maxWidth:"500px",margin:"auto",padding:"20px"}}>

  <h1 style={{fontSize:"28px",marginBottom:"10px"}}>
    Match {matchNumber}
  </h1>

  <p style={{marginBottom:"20px"}}>
    Scout: <b>{scoutName}</b>
  </p>

  <form onSubmit={submitScout}>

    <label style={{fontSize:"20px"}}>Team Number</label>

    <input
      type="number"
      value={team}
      onChange={(e)=>setTeam(e.target.value)}
      style={{
        width:"100%",
        padding:"16px",
        fontSize:"20px",
        marginBottom:"25px"
      }}
    />

    <h2>Auton</h2>

    <div style={{textAlign:"center",fontSize:"24px"}}>
      {auton}
    </div>

    <input
      type="range"
      min="1"
      max="10"
      value={auton}
      onChange={(e)=>setAuton(e.target.value)}
      style={{width:"100%",marginBottom:"30px"}}
    />

    <h2>Climb</h2>

    <div style={{display:"flex",gap:"10px",marginBottom:"30px"}}>

      {["none","L1","L2","L3"].map((c)=>(

        <button
          key={c}
          type="button"
          style={buttonStyle(climb===c)}
          onClick={()=>setClimb(c)}
        >
          {c}
        </button>

      ))}

    </div>

    <h2>Movement</h2>

    <div style={{display:"flex",gap:"10px",marginBottom:"30px"}}>

      {["1","2","3"].map((m)=>(

        <button
          key={m}
          type="button"
          style={buttonStyle(movement===m)}
          onClick={()=>setMovement(m)}
        >
          {m}
        </button>

      ))}

    </div>

    <h2>Intake</h2>

    <div style={{display:"flex",gap:"10px",marginBottom:"30px"}}>

      {["none","1","2","3"].map((i)=>(

        <button
          key={i}
          type="button"
          style={buttonStyle(intake===i)}
          onClick={()=>setIntake(i)}
        >
          {i}
        </button>

      ))}

    </div>

    <h2>Accuracy</h2>

    <div style={{textAlign:"center",fontSize:"24px"}}>
      {accuracy}
    </div>

    <input
      type="range"
      min="1"
      max="10"
      value={accuracy}
      onChange={(e)=>setAccuracy(e.target.value)}
      style={{width:"100%",marginBottom:"40px"}}
    />

    <button
      type="submit"
      disabled={submitting}
      style={{
        width:"100%",
        padding:"20px",
        fontSize:"22px",
        background:"#2ecc71",
        border:"none",
        borderRadius:"12px",
        color:"white"
      }}
    >
      {submitting ? "Saving..." : "Submit Scouting"}
    </button>

  </form>

</div>


);

};

export default ScoutForm;

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { saveScoutEntry } from "../utils/localDB";

const ScoutForm = () => {

  const { eventKey, matchNumber } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState("");
  const [auton, setAuton] = useState(5);
  const [accuracy, setAccuracy] = useState(5);
  const [climb, setClimb] = useState("none");
  const [movement, setMovement] = useState("1");
  const [intake, setIntake] = useState("none");

  const [submitting, setSubmitting] = useState(false);

  function submitScout(e) {
    e.preventDefault();

    if (!team) {
      alert("Enter team number");
      return;
    }

    setSubmitting(true);

    const payload = {
      eventKey,
      matchNumber: Number(matchNumber),
      team: Number(team),
      auton: Number(auton),
      climb,
      movement,
      intake,
      accuracy: Number(accuracy),
      created: Date.now()
    };

    saveScoutEntry(payload);

    alert("Saved locally!");
    navigate(-1);
    setSubmitting(false);
  }

  const buttonStyle = (selected) => ({
    flex: 1,
    padding: "18px",
    fontSize: "18px",
    borderRadius: "10px",
    border: "none",
    background: selected ? "#3498db" : "#ecf0f1",
    color: selected ? "white" : "black"
  });

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h1>Match {matchNumber}</h1>

      <form onSubmit={submitScout}>

        <input
          type="number"
          placeholder="Team Number"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          style={{ width: "100%", padding: "16px", fontSize: "20px", marginBottom: "20px" }}
        />

        <h2>Auton: {auton}</h2>
        <input type="range" min="1" max="10" step="1"
          value={auton}
          onChange={(e) => setAuton(e.target.value)}
          style={{ width: "100%" }}
        />

        <h2>Climb</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          {["none","L1","L2","L3"].map(c=>(
            <button type="button" key={c} style={buttonStyle(climb===c)} onClick={()=>setClimb(c)}>{c}</button>
          ))}
        </div>

        <h2>Movement</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          {["1","2","3"].map(m=>(
            <button type="button" key={m} style={buttonStyle(movement===m)} onClick={()=>setMovement(m)}>{m}</button>
          ))}
        </div>

        <h2>Intake</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          {["none","1","2","3"].map(i=>(
            <button type="button" key={i} style={buttonStyle(intake===i)} onClick={()=>setIntake(i)}>{i}</button>
          ))}
        </div>

        <h2>Accuracy: {accuracy}</h2>
        <input type="range" min="1" max="10" step="1"
          value={accuracy}
          onChange={(e)=>setAccuracy(e.target.value)}
          style={{ width:"100%" }}
        />

        <button type="submit" disabled={submitting}
          style={{ width:"100%", padding:"20px", fontSize:"22px", background:"#2ecc71", border:"none", borderRadius:"12px", color:"white" }}>
          {submitting ? "Saving..." : "Submit"}
        </button>

      </form>
    </div>
  );
};

export default ScoutForm;

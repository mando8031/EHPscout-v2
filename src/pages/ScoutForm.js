import { useLocation } from "react-router-dom";
import { useState } from "react";

function ScoutForm(){

  const { state } = useLocation();

  const [accuracy,setAccuracy]=useState(5);
  const [auton,setAuton]=useState(5);
  const [movement,setMovement]=useState(2);
  const [intake,setIntake]=useState(1);
  const [climb,setClimb]=useState(0);
  const [overall,setOverall]=useState(5);
  const [notes,setNotes]=useState("");

  const submit=()=>{

    const data={
      team:state.team,
      match:state.match,
      accuracy,
      auton,
      movement,
      intake,
      climb,
      overall,
      notes
    };

    console.log(data);

    alert("Scouting saved");
  };

  return(

    <div>

      <h1>Team {state.team} - Match {state.match}</h1>

      <p>Accuracy</p>
      <input type="range" min="0" max="10"
      value={accuracy}
      onChange={(e)=>setAccuracy(e.target.value)} />

      <p>Auton</p>
      <input type="range" min="0" max="10"
      value={auton}
      onChange={(e)=>setAuton(e.target.value)} />

      <p>Movement</p>
      <select onChange={(e)=>setMovement(e.target.value)}>
        <option value="1">Bad</option>
        <option value="2">Mediocre</option>
        <option value="3">Good</option>
      </select>

      <p>Intake Speed</p>
      <select onChange={(e)=>setIntake(e.target.value)}>
        <option value="0">None</option>
        <option value="1">Slow</option>
        <option value="2">Medium</option>
        <option value="3">Fast</option>
      </select>

      <p>Climb</p>
      <select onChange={(e)=>setClimb(e.target.value)}>
        <option value="0">None</option>
        <option value="1">Low</option>
        <option value="2">Mid</option>
        <option value="3">High</option>
      </select>

      <p>Overall</p>
      <input type="range" min="0" max="10"
      value={overall}
      onChange={(e)=>setOverall(e.target.value)} />

      <textarea
      placeholder="Notes"
      onChange={(e)=>setNotes(e.target.value)} />

      <button onClick={submit}>
        Submit
      </button>

    </div>

  );
}

export default ScoutForm;

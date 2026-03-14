import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

function ScoutForm(){

  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state;

  if(!state){
    return(
      <div style={{padding:"40px"}}>
        <h2>No match selected</h2>
        <button onClick={()=>navigate("/")}>
          Go back
        </button>
      </div>
    );
  }

  const [accuracy,setAccuracy]=useState(5);
  const [auton,setAuton]=useState(5);
  const [movement,setMovement]=useState(2);
  const [intake,setIntake]=useState(1);
  const [climb,setClimb]=useState(0);
  const [overall,setOverall]=useState(5);
  const [notes,setNotes]=useState("");

  const submit=async()=>{

    await addDoc(collection(db,"scouting"),{

      team:state.team,
      match:state.match,
      accuracy:Number(accuracy),
      auton:Number(auton),
      movement:Number(movement),
      intake:Number(intake),
      climb:Number(climb),
      overall:Number(overall),
      notes,
      timestamp:Date.now()

    });

    alert("Scouting data saved");
    navigate("/");
  };

  return(

    <div style={{maxWidth:"600px",padding:"20px"}}>

      <h2>Team {state.team} — Match {state.match}</h2>

      <label>Accuracy</label>
      <input type="range" min="0" max="10"
      value={accuracy}
      onChange={(e)=>setAccuracy(e.target.value)} />

      <label>Auton</label>
      <input type="range" min="0" max="10"
      value={auton}
      onChange={(e)=>setAuton(e.target.value)} />

      <label>Movement</label>
      <select value={movement}
      onChange={(e)=>setMovement(e.target.value)}>
        <option value="1">Bad</option>
        <option value="2">Average</option>
        <option value="3">Good</option>
      </select>

      <label>Notes</label>
      <textarea
      onChange={(e)=>setNotes(e.target.value)} />

      <br/>

      <button onClick={submit}>
        Submit
      </button>

    </div>
  );

}

export default ScoutForm;

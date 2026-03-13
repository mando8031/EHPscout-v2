import { useLocation } from "react-router-dom"
import { useState } from "react"

import { addDoc, collection } from "firebase/firestore"
import { db } from "../firebase"

function ScoutForm(){

  const {state}=useLocation()

  const [accuracy,setAccuracy]=useState(5)
  const [auton,setAuton]=useState(5)
  const [movement,setMovement]=useState(2)
  const [intake,setIntake]=useState(1)
  const [climb,setClimb]=useState(0)
  const [overall,setOverall]=useState(5)
  const [notes,setNotes]=useState("")

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

    })

    alert("Scouting data saved")

  }

  return(

    <div className="max-w-xl">

      <h1 className="text-2xl mb-4">

        Team {state.team} — Match {state.match}

      </h1>

      <label>Accuracy</label>
      <input type="range" min="0" max="10"
      value={accuracy}
      onChange={(e)=>setAccuracy(e.target.value)}
      className="w-full"/>

      <label>Auton</label>
      <input type="range" min="0" max="10"
      value={auton}
      onChange={(e)=>setAuton(e.target.value)}
      className="w-full"/>

      <label>Movement</label>

      <select
      value={movement}
      onChange={(e)=>setMovement(e.target.value)}
      className="w-full bg-gray-800 p-2 rounded">

        <option value="1">Bad</option>
        <option value="2">Mediocre</option>
        <option value="3">Good</option>

      </select>

      <label>Intake</label>

      <select
      value={intake}
      onChange={(e)=>setIntake(e.target.value)}
      className="w-full bg-gray-800 p-2 rounded">

        <option value="0">None</option>
        <option value="1">Slow</option>
        <option value="2">Medium</option>
        <option value="3">Fast</option>

      </select>

      <label>Climb</label>

      <select
      value={climb}
      onChange={(e)=>setClimb(e.target.value)}
      className="w-full bg-gray-800 p-2 rounded">

        <option value="0">None</option>
        <option value="1">Low</option>
        <option value="2">Mid</option>
        <option value="3">High</option>

      </select>

      <label>Overall</label>

      <input type="range" min="0" max="10"
      value={overall}
      onChange={(e)=>setOverall(e.target.value)}
      className="w-full"/>

      <textarea
      placeholder="Notes"
      onChange={(e)=>setNotes(e.target.value)}
      className="w-full bg-gray-800 p-3 rounded mt-4"/>

      <button
      onClick={submit}
      className="bg-green-600 px-6 py-3 rounded mt-4">

        Submit

      </button>

    </div>

  )

}

export default ScoutForm

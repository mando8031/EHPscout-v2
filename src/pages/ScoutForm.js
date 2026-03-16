import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const ScoutForm = () => {

const navigate = useNavigate();

const [team, setTeam] = useState("");
const [matchNumber, setMatchNumber] = useState("");

const [auton, setAuton] = useState(0);
const [accuracy, setAccuracy] = useState(0);
const [movement, setMovement] = useState(0);

const [climb, setClimb] = useState("none");
const [intake, setIntake] = useState("slow");

const [submitting, setSubmitting] = useState(false);

async function submitScout(e) {
e.preventDefault();

```
if (!team) {
  alert("Enter team number");
  return;
}

setSubmitting(true);

try {

  // convert categorical values to numeric values
  const climbScore =
    climb === "high" ? 10 :
    climb === "mid" ? 6 :
    climb === "low" ? 3 : 0;

  const intakeScore =
    intake === "fast" ? 5 :
    intake === "slow" ? 3 : 0;

  const movementScore = Number(movement);

  // calculate overall score
  const overall =
    Number(auton) * 2 +
    Number(accuracy) * 2 +
    climbScore +
    intakeScore +
    movementScore;

  const payload = {
    team: Number(team),
    matchNumber: Number(matchNumber),

    auton: Number(auton),
    accuracy: Number(accuracy),
    movement: movementScore,

    climb,
    intake,

    overall,

    created: serverTimestamp()
  };

  await addDoc(collection(db, "scouting"), payload);

  alert("Scouting data saved!");

  navigate(-1);

} catch (err) {

  console.error(err);
  alert("Error saving scouting data");

}

setSubmitting(false);
```

}

return (

```
<div className="p-6">

  <h1 className="text-2xl font-bold mb-6">
    Scout Match
  </h1>

  <form onSubmit={submitScout} className="space-y-4">

    <input
      type="number"
      placeholder="Team Number"
      value={team}
      onChange={(e)=>setTeam(e.target.value)}
      className="border p-2 w-full"
    />

    <input
      type="number"
      placeholder="Match Number"
      value={matchNumber}
      onChange={(e)=>setMatchNumber(e.target.value)}
      className="border p-2 w-full"
    />

    <div>
      <label>Autonomous Score</label>
      <input
        type="number"
        value={auton}
        onChange={(e)=>setAuton(e.target.value)}
        className="border p-2 w-full"
      />
    </div>

    <div>
      <label>Shooting Accuracy</label>
      <input
        type="number"
        value={accuracy}
        onChange={(e)=>setAccuracy(e.target.value)}
        className="border p-2 w-full"
      />
    </div>

    <div>
      <label>Robot Movement</label>
      <input
        type="number"
        value={movement}
        onChange={(e)=>setMovement(e.target.value)}
        className="border p-2 w-full"
      />
    </div>

    <div>
      <label>Climb Level</label>
      <select
        value={climb}
        onChange={(e)=>setClimb(e.target.value)}
        className="border p-2 w-full"
      >
        <option value="none">None</option>
        <option value="low">Low</option>
        <option value="mid">Mid</option>
        <option value="high">High</option>
      </select>
    </div>

    <div>
      <label>Intake Speed</label>
      <select
        value={intake}
        onChange={(e)=>setIntake(e.target.value)}
        className="border p-2 w-full"
      >
        <option value="slow">Slow</option>
        <option value="fast">Fast</option>
      </select>
    </div>

    <button
      type="submit"
      disabled={submitting}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      {submitting ? "Saving..." : "Submit Scout Data"}
    </button>

  </form>

</div>
```

);

};

export default ScoutForm;

import React from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

const JoinTeam = () => {

const { code } = useParams();

async function joinTeam() {


const uid = auth.currentUser.uid;

await setDoc(doc(db,"users",uid),{
  role: "scout",
  teamId: code
});

alert("Joined team!");


}

return (


<div style={{textAlign:"center"}}>

  <h2>Join Scouting Team</h2>

  <p>Team Code: {code}</p>

  <button onClick={joinTeam}>
    Join
  </button>

</div>

);

};

export default JoinTeam;

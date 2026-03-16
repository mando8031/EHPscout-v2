import React, { useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import QRCode from "react-qr-code";

const TeamSetup = () => {

const [teamName, setTeamName] = useState("");
const [joinCode, setJoinCode] = useState("");
const [inviteCode, setInviteCode] = useState("");

const uid = auth.currentUser?.uid;

async function createTeam() {


const code = Math.random().toString(36).substring(2,8);

await setDoc(doc(db,"teams",code),{
  name: teamName,
  adminUid: uid,
  inviteCode: code
});

await setDoc(doc(db,"users",uid),{
  teamId: code,
  role: "admin"
});

setInviteCode(code);


}

async function joinTeam() {


const teamRef = doc(db,"teams",joinCode);
const team = await getDoc(teamRef);

if(!team.exists()){
  alert("Team not found");
  return;
}

await setDoc(doc(db,"users",uid),{
  teamId: joinCode,
  role: "scout"
});

alert("Joined team!");


}

return (


<div style={{maxWidth:"500px",margin:"auto"}}>

  <h2>Create Team</h2>

  <input
    placeholder="Team Name"
    value={teamName}
    onChange={(e)=>setTeamName(e.target.value)}
    style={{width:"100%",padding:"10px"}}
  />

  <button onClick={createTeam}>
    Create Team
  </button>

  {inviteCode && (

    <div style={{marginTop:"30px"}}>

      <h3>Invite Scouts</h3>

      <QRCode value={inviteCode} />

      <p>Join Code: {inviteCode}</p>

    </div>

  )}

  <hr style={{margin:"40px 0"}}/>

  <h2>Join Team</h2>

  <input
    placeholder="Enter team code"
    value={joinCode}
    onChange={(e)=>setJoinCode(e.target.value)}
    style={{width:"100%",padding:"10px"}}
  />

  <button onClick={joinTeam}>
    Join Team
  </button>

</div>


);

};

export default TeamSetup;

import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const MatchBoard = () => {

const [entries,setEntries] = useState([]);

useEffect(()=>{


const unsub = onSnapshot(collection(db,"scouting"),(snap)=>{

  const data = snap.docs.map(doc=>doc.data());

  setEntries(data);

});

return ()=>unsub();


},[]);

return (


<div style={{maxWidth:"700px",margin:"auto",padding:"20px"}}>

  <h1 style={{fontSize:"32px",marginBottom:"20px"}}>
    Live Match Scouting
  </h1>

  {entries.map((entry,i)=>(

    <div
      key={i}
      style={{
        background:"#ecf0f1",
        padding:"15px",
        marginBottom:"10px",
        borderRadius:"10px"
      }}
    >

      Match {entry.matchNumber} • Team {entry.team}

      <div style={{fontSize:"14px"}}>
        Scout: {entry.scout}
      </div>

    </div>

  ))}

</div>


);

};

export default MatchBoard;

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function Picklist(){

  const [teams,setTeams]=useState([]);

  useEffect(()=>{

    async function load(){

      const snapshot=await getDocs(collection(db,"scouting"));

      const data=snapshot.docs.map(d=>d.data());

      const grouped={};

      data.forEach(entry=>{

        if(!grouped[entry.team]){
          grouped[entry.team]=[];
        }

        grouped[entry.team].push(entry);
      });

      const rankings=Object.keys(grouped).map(team=>{

        const entries=grouped[team];

        const score =
          entries.reduce((sum,e)=>sum+Number(e.overall),0)/entries.length;

        return {team,score};

      });

      rankings.sort((a,b)=>b.score-a.score);

      setTeams(rankings);

    }

    load();

  },[]);

  return(

    <div>

      <h1>Alliance Picklist</h1>

      {teams.map((team,i)=>(

        <div key={team.team}>

          {i+1}. Team {team.team} — {team.score.toFixed(2)}

        </div>

      ))}

    </div>

  );
}

export default Picklist;

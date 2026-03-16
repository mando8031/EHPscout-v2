import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Dashboard = () => {

const [teams, setTeams] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(()=>{

```
async function loadData(){

  try {

    const snapshot = await getDocs(collection(db,"scouting"));

    const data = snapshot.docs.map(doc => doc.data());

    const teamMap = {};

    data.forEach(entry=>{

      if(!teamMap[entry.team]){
        teamMap[entry.team] = {
          team: entry.team,
          matches: 0,
          totalScore: 0
        };
      }

      teamMap[entry.team].matches += 1;
      teamMap[entry.team].totalScore += entry.overall || 0;

    });

    const teamStats = Object.values(teamMap).map(team=>({

      team: team.team,
      overall: team.matches > 0
        ? team.totalScore / team.matches
        : 0

    }));

    teamStats.sort((a,b)=>b.overall - a.overall);

    setTeams(teamStats);

  } catch(err){

    console.error("Error loading scouting data",err);

  }

  setLoading(false);

}

loadData();
```

},[]);

if(loading){
return ( <div className="p-6"> <h1 className="text-2xl">Loading rankings...</h1> </div>
);
}

return (

```
<div className="p-6">

  <h1 className="text-3xl font-bold mb-6">
    Team Rankings
  </h1>

  <div className="space-y-3">

    {teams.map((team,index)=>(

      <div
        key={team.team}
        className="p-4 bg-gray-100 rounded flex justify-between items-center"
      >

        <div className="font-bold">
          #{index+1} Team {team.team}
        </div>

        <div>
          Score: {team.overall.toFixed(2)}
        </div>

      </div>

    ))}

  </div>

</div>
```

);

};

export default Dashboard;

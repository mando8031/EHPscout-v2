import React, { useEffect, useState } from "react";
import { getScoutEntries, clearScoutEntries } from "../utils/localDB";
import { calculateTeamStats } from "../utils/statsCalculator";

const Dashboard = () => {

  const [stats, setStats] = useState([]);

  useEffect(() => {
    const data = getScoutEntries();
    const calculated = calculateTeamStats(data);
    setStats(calculated);
  }, []);

  return (
    <div style={{ padding: "20px" }}>

      <h1>Dashboard</h1>

      <button onClick={()=>{
        clearScoutEntries();
        window.location.reload();
      }}>
        Clear Data
      </button>

      {stats.map(team => (
        <div key={team.team} style={{
          padding:"10px",
          margin:"10px 0",
          background:"#2c2c2c",
          borderRadius:"8px"
        }}>
          <strong>Team {team.team}</strong><br/>
          Auton: {team.autonAvg}<br/>
          Accuracy: {team.accuracyAvg}
        </div>
      ))}

    </div>
  );
};

export default Dashboard;

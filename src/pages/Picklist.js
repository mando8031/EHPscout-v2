import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import { calculateTeamStats } from "../utils/statsCalculator";

const Picklist = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    async function load() {
      const snapshot = await getDocs(collection(db, "scouting"));

      const data = snapshot.docs.map((doc) => doc.data());

      const stats = calculateTeamStats(data);

      stats.sort((a, b) => b.overall - a.overall);

      setTeams(stats);
    }

    load();
  }, []);

  return (
    <div>
      <h1 className="text-3xl mb-6">Alliance Picklist</h1>

      {teams.map((team, i) => (
        <div
          key={team.team}
          className="bg-gray-800 p-3 rounded mb-2"
        >
          {i + 1}. Team {team.team} — {team.overall.toFixed(2)}
        </div>
      ))}
    </div>
  );
};

export default Picklist;

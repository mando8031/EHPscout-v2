import React, { useEffect, useState } from "react";
import { getScoutEntries } from "../utils/localDB";

const Picklist = () => {

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const data = getScoutEntries();

    const grouped = {};

    data.forEach(entry => {
      if (!grouped[entry.team]) {
        grouped[entry.team] = [];
      }
      grouped[entry.team].push(entry);
    });

    const results = Object.keys(grouped).map(team => {
      const matches = grouped[team];

      const avgAccuracy =
        matches.reduce((sum, m) => sum + (m.accuracy || 0), 0) / matches.length;

      return {
        team,
        score: avgAccuracy.toFixed(2)
      };
    });

    results.sort((a, b) => b.score - a.score);

    setTeams(results);

  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Picklist</h1>

      {teams.map((t, i) => (
        <div key={t.team}>
          {i + 1}. Team {t.team} — Score: {t.score}
        </div>
      ))}
    </div>
  );
};

export default Picklist;

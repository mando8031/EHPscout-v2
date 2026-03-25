import React, { useEffect, useState } from "react";

export default function Dashboard() {

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const eventKey = localStorage.getItem("selectedEvent");
    const data = JSON.parse(localStorage.getItem("scoutingData") || "[]");

    const filtered = data.filter(d => d.event === eventKey);

    const grouped = {};

    filtered.forEach(entry => {
      if (!grouped[entry.team]) grouped[entry.team] = [];
      grouped[entry.team].push(entry);
    });

    const ranked = Object.keys(grouped).map(team => {
      const entries = grouped[team];

      let totalScore = 0;

      entries.forEach(e => {
        totalScore += Number(e.accuracy || 0);
        totalScore += Number(e.shootingSpeed || 0);
        totalScore += Number(e.intakeSpeed || 0);
      });

      return {
        team,
        entries,
        score: totalScore / entries.length
      };
    });

    ranked.sort((a, b) => b.score - a.score);
    setTeams(ranked);

  }, []);

  return (
    <div style={{ padding: "10px", color: "white" }}>
      <h2>Team Rankings</h2>

      {teams.length === 0 && (
        <p>No data for this event yet</p>
      )}

      {!selectedTeam && teams.map(t => (
        <div key={t.team}
          onClick={() => setSelectedTeam(t)}
          style={{
            background: "#1e1e1e",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "10px"
          }}
        >
          <h3>Team {t.team.replace("frc", "")}</h3>
          <p>Score: {t.score.toFixed(2)}</p>
        </div>
      ))}

      {selectedTeam && (
        <div>
          <button onClick={() => setSelectedTeam(null)}>Back</button>

          <h2>Team {selectedTeam.team.replace("frc", "")}</h2>

          {selectedTeam.entries.map((e, i) => (
            <div key={i} style={{ background: "#1e1e1e", padding: "10px", marginBottom: "10px" }}>
              <p><b>Match:</b> {e.match}</p>

              {/* ✅ SLIDERS NOW SHOWN */}
              <p><b>Accuracy:</b> {e.accuracy}</p>
              <p><b>Shooting Speed:</b> {e.shootingSpeed}</p>
              <p><b>Intake Speed:</b> {e.intakeSpeed}</p>

              <p><b>Auton:</b> {e.auton?.join(", ")}</p>
              <p><b>Climb:</b> {e.climb?.join(", ")}</p>
              <p><b>Failures:</b> {e.failures?.join(", ")}</p>
              <p><b>Notes:</b> {e.notes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

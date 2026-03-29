import React, { useEffect, useState } from "react";
import NoEvent from "./NoEvent";
import NoData from "./NoData";

export default function Dashboard() {

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  const selectedEvent = localStorage.getItem("selectedEvent");

  useEffect(() => {

    if (!selectedEvent) {
      setLoading(false);
      return;
    }

    const data = JSON.parse(localStorage.getItem("scoutingData") || "[]");

    const filtered = data.filter(d => d.event === selectedEvent);

    if (filtered.length === 0) {
      setTeams([]);
      setLoading(false);
      return;
    }

    const grouped = {};

    filtered.forEach(entry => {
      if (!grouped[entry.team]) grouped[entry.team] = [];
      grouped[entry.team].push(entry);
    });

    const ranked = Object.keys(grouped).map(team => ({
      team,
      entries: grouped[team]
    }));

    setTeams(ranked);
    setLoading(false);

  }, [selectedEvent]);

  // 🔴 LOADING
  if (loading) {
    return <div style={{ padding: "20px", color: "white" }}>Loading...</div>;
  }

  // 🔴 NO EVENT
  if (!selectedEvent) {
    return <NoEvent />;
  }

  // 🔴 NO DATA
  if (teams.length === 0) {
    return <NoData />;
  }

  // 🧠 HELPER: display arrays + "Other"
  const formatField = (arr, other) => {
    if (!arr || arr.length === 0) return "None";

    let values = [...arr];

    if (arr.includes("Other") && other) {
      values = values.map(v => v === "Other" ? `Other: ${other}` : v);
    }

    return values.join(", ");
  };

  return (
    <div style={{ padding: "10px", color: "white" }}>
      <h2>Team Rankings</h2>

      {/* TEAM LIST */}
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
          <p>Matches: {t.entries.length}</p>
        </div>
      ))}

      {/* TEAM DETAIL */}
      {selectedTeam && (
        <div>
          <button onClick={() => setSelectedTeam(null)}>Back</button>

          <h2>Team {selectedTeam.team.replace("frc", "")}</h2>

          {selectedTeam.entries.map((e, i) => (
            <div key={i} style={{
              background: "#1e1e1e",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "10px"
            }}>

              <p><b>Scout:</b> {e.scout || "Unknown"}</p>
              <p><b>Match:</b> {e.match}</p>

              <hr style={{ opacity: 0.2 }} />

              <p><b>Robot Type:</b> {formatField(e.robotType)}</p>

              <p><b>Main Focus:</b> {formatField(e.focus, e.focusOther)}</p>

              <p><b>Failures:</b> {formatField(e.failures, e.failuresOther)}</p>

              <p><b>Auton:</b> {formatField(e.auton, e.autonOther)}</p>

              <p><b>Climb:</b> {formatField(e.climb)}</p>

              <p><b>Driver Awareness:</b> {e.awareness || "N/A"}</p>

              <hr style={{ opacity: 0.2 }} />

              <p><b>Accuracy:</b> {e.accuracy}</p>
              <p><b>Shooting Speed:</b> {e.shootingSpeed}</p>
              <p><b>Intake Speed:</b> {e.intakeSpeed}</p>

              <hr style={{ opacity: 0.2 }} />

              <p><b>Notes:</b> {e.notes || "None"}</p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

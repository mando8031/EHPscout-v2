import React, { useEffect, useState } from "react";
import NoEvent from "./NoEvent";
import NoData from "./NoData";

export default function Dashboard() {

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const selectedEvent = localStorage.getItem("selectedEvent");

  // 🧠 LOAD SETTINGS (with safe defaults)
  const getSettings = () => {
    return JSON.parse(localStorage.getItem("scoringSettings")) || {
      accuracy: 0.3,
      shootingSpeed: 0.2,
      intakeSpeed: 0.2,
      auton: 0.1,
      climb: 0.1,
      awareness: 0.1,
      focus: 0.1,
      robotType: 0.05,
      failurePenalty: 0.2,

      autonShoot: 1,
      autonCollectMiddle: 0.6,
      autonCollectDepot: 0.5,
      autonClimb: 0.8,

      focusScoring: 1,
      focusPassing: 0.6,
      focusDefense: 0.8,

      failureLostComm: 1,
      failureLostPower: 1,
      failureBrokenIntake: 0.6
    };
  };

  // 🧠 SCORE CALCULATION (0 → 1)
  const calculateScore = (entry) => {
    const s = getSettings();

    let score = 0;

    // 🎯 sliders (normalize 1–5 → 0–1)
    score += ((Number(entry.accuracy) - 1) / 4) * s.accuracy;
    score += ((Number(entry.shootingSpeed) - 1) / 4) * s.shootingSpeed;
    score += ((Number(entry.intakeSpeed) - 1) / 4) * s.intakeSpeed;

    // 🧠 awareness
    if (entry.awareness === "Yes") score += s.awareness;
    if (entry.awareness === "Kind of Lost") score += s.awareness * 0.5;

    // 🧗 climb
    if (entry.climb?.includes("L3")) score += s.climb;
    else if (entry.climb?.includes("L2")) score += s.climb * 0.7;
    else if (entry.climb?.includes("L1")) score += s.climb * 0.4;

    // 🤖 AUTON (FULLY CUSTOM)
    let autonScore = 0;

    if (entry.auton?.includes("Shoot")) {
      autonScore += s.autonShoot;
    }
    if (entry.auton?.includes("Collect Middle")) {
      autonScore += s.autonCollectMiddle;
    }
    if (entry.auton?.includes("Collect Depot")) {
      autonScore += s.autonCollectDepot;
    }
    if (entry.auton?.includes("Climb")) {
      autonScore += s.autonClimb;
    }

    if (entry.auton?.includes("No Auton / Not Working")) {
      autonScore = 0;
    }

    const maxAuton =
      s.autonShoot +
      s.autonCollectMiddle +
      s.autonCollectDepot +
      s.autonClimb;

    if (maxAuton > 0) autonScore /= maxAuton;

    score += autonScore * s.auton;

    // 🎯 FOCUS (FULLY CUSTOM)
    let focusScore = 0;

    if (entry.focus?.includes("Scoring")) {
      focusScore += s.focusScoring;
    }
    if (entry.focus?.includes("Passing / Moving Balls")) {
      focusScore += s.focusPassing;
    }
    if (entry.focus?.includes("Defense")) {
      focusScore += s.focusDefense;
    }

    const maxFocus =
      s.focusScoring +
      s.focusPassing +
      s.focusDefense;

    if (maxFocus > 0) focusScore /= maxFocus;

    score += focusScore * s.focus;

    // 🤖 ROBOT TYPE
    if (entry.robotType?.includes("Custom")) {
      score += s.robotType;
    }
    // Kitbot = 0 automatically

    // ❌ FAILURES (CUSTOM PENALTIES)
    let penalty = 0;

    if (entry.failures?.includes("Lost Communication")) {
      penalty += s.failureLostComm;
    }
    if (entry.failures?.includes("Lost Power")) {
      penalty += s.failureLostPower;
    }
    if (entry.failures?.includes("Broken Intake")) {
      penalty += s.failureBrokenIntake;
    }

    if (entry.failures?.includes("Other")) {
      penalty += 0.5; // default small penalty
    }

    score -= penalty * s.failurePenalty;

    // 🔒 clamp 0–1
    return Math.max(0, Math.min(1, score));
  };

  // 🔥 LOAD DATA
  const loadData = () => {
    if (!selectedEvent) {
      setTeams([]);
      return;
    }

    const data = JSON.parse(localStorage.getItem("scoutingData") || "[]");

    const filtered = data.filter(d => d.event === selectedEvent);

    if (filtered.length === 0) {
      setTeams([]);
      return;
    }

    const grouped = {};

    filtered.forEach(entry => {
      if (!grouped[entry.team]) grouped[entry.team] = [];
      grouped[entry.team].push(entry);
    });

    // 🧠 CALCULATE TEAM SCORES
    const ranked = Object.keys(grouped).map(team => {

      const entries = grouped[team];

      const scores = entries.map(e => calculateScore(e));

      const avgScore =
        scores.reduce((a, b) => a + b, 0) / scores.length;

      return {
        team,
        entries,
        avgScore
      };
    });

    // 🏆 SORT BEST → WORST
    ranked.sort((a, b) => b.avgScore - a.avgScore);

    setTeams(ranked);
  };

  useEffect(() => {
    loadData();
  }, [selectedEvent]);

  useEffect(() => {
    const handleFocus = () => loadData();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // 🔴 NO EVENT
  if (!selectedEvent) return <NoEvent />;

  // 🔴 NO DATA
  if (teams.length === 0) return <NoData />;

  // 🧠 FORMATTER
  const formatField = (arr, other) => {
    if (!arr || arr.length === 0) return "None";

    let values = [...arr];

    if (arr.includes("Other") && other) {
      values = values.map(v =>
        v === "Other" ? `Other: ${other}` : v
      );
    }

    return values.join(", ");
  };

  return (
    <div style={{ padding: "10px", color: "white" }}>
      <h2>Team Rankings</h2>

      {/* TEAM LIST */}
      {!selectedTeam && teams.map((t, index) => (
        <div key={t.team}
          onClick={() => setSelectedTeam(t)}
          style={{
            background: index === 0 ? "#2e7d32" : "#1e1e1e",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "10px"
          }}
        >
          <h3>
            #{index + 1} — Team {t.team.replace("frc", "")}
          </h3>
          <p>Score: {(t.avgScore * 100).toFixed(0)}%</p>
          <p>Matches: {t.entries.length}</p>
        </div>
      ))}

      {/* TEAM DETAIL */}
      {selectedTeam && (
        <div>
          <button onClick={() => setSelectedTeam(null)}>Back</button>

          <h2>
            Team {selectedTeam.team.replace("frc", "")} (
            {(selectedTeam.avgScore * 100).toFixed(0)}%)
          </h2>

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

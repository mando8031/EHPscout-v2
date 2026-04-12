import React, { useEffect, useState } from "react";
import NoEvent from "./NoEvent";
import NoData from "./NoData";

export default function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const selectedEvent = localStorage.getItem("selectedEvent");

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

  const calculateScore = (entry) => {
    const s = getSettings();
    let score = 0;

    score += ((Number(entry.accuracy) - 1) / 4) * s.accuracy;
    score += ((Number(entry.shootingSpeed) - 1) / 4) * s.shootingSpeed;
    score += ((Number(entry.intakeSpeed) - 1) / 4) * s.intakeSpeed;

    if (entry.awareness === "Yes") score += s.awareness;
    if (entry.awareness === "Kind of Lost") score += s.awareness * 0.5;

    if (entry.climb?.includes("L3")) score += s.climb;
    else if (entry.climb?.includes("L2")) score += s.climb * 0.7;
    else if (entry.climb?.includes("L1")) score += s.climb * 0.4;

    let autonScore = 0;
    if (entry.auton?.includes("Shoot")) autonScore += s.autonShoot;
    if (entry.auton?.includes("Collect Middle")) autonScore += s.autonCollectMiddle;
    if (entry.auton?.includes("Collect Depot")) autonScore += s.autonCollectDepot;
    if (entry.auton?.includes("Climb")) autonScore += s.autonClimb;
    if (entry.auton?.includes("No Auton / Not Working")) autonScore = 0;

    const maxAuton = s.autonShoot + s.autonCollectMiddle + s.autonCollectDepot + s.autonClimb;
    if (maxAuton > 0) autonScore /= maxAuton;
    score += autonScore * s.auton;

    let focusScore = 0;
    if (entry.focus?.includes("Scoring")) focusScore += s.focusScoring;
    if (entry.focus?.includes("Passing / Moving Balls")) focusScore += s.focusPassing;
    if (entry.focus?.includes("Defense")) focusScore += s.focusDefense;

    const maxFocus = s.focusScoring + s.focusPassing + s.focusDefense;
    if (maxFocus > 0) focusScore /= maxFocus;
    score += focusScore * s.focus;

    if (entry.robotType?.includes("Custom")) score += s.robotType;

    let penalty = 0;
    if (entry.failures?.includes("Lost Communication")) penalty += s.failureLostComm;
    if (entry.failures?.includes("Lost Power")) penalty += s.failureLostPower;
    if (entry.failures?.includes("Broken Intake")) penalty += s.failureBrokenIntake;
    if (entry.failures?.includes("Other")) penalty += 0.5;
    score -= penalty * s.failurePenalty;

    return Math.max(0, Math.min(1, score));
  };

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

    const ranked = Object.keys(grouped).map(team => {
      const entries = grouped[team];
      const scores = entries.map(e => calculateScore(e));
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      return { team, entries, avgScore };
    });

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

  if (!selectedEvent) return <NoEvent />;
  if (teams.length === 0) return <NoData />;

  const formatField = (arr, other) => {
    if (!arr || arr.length === 0) return "None";
    let values = [...arr];
    if (arr.includes("Other") && other) {
      values = values.map(v => v === "Other" ? `Other: ${other}` : v);
    }
    return values.join(", ");
  };

  const getScoreColor = (score) => {
    if (score >= 0.7) return "#22c55e";
    if (score >= 0.5) return "#3b82f6";
    if (score >= 0.3) return "#eab308";
    return "#ef4444";
  };

  const getRankBadge = (index) => {
    if (index === 0) return { bg: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)", text: "#000" };
    if (index === 1) return { bg: "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)", text: "#fff" };
    if (index === 2) return { bg: "linear-gradient(135deg, #cd7f32 0%, #a0522d 100%)", text: "#fff" };
    return { bg: "#1a1a24", text: "#6b6b78" };
  };

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: "0 auto" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
        paddingTop: 8
      }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>Team Rankings</h1>
          <p style={{ margin: 0, fontSize: 13, color: "#6b6b78" }}>
            {teams.length} teams scouted
          </p>
        </div>
      </div>

      {/* Team List */}
      {!selectedTeam && teams.map((t, index) => {
        const badge = getRankBadge(index);
        const scorePercent = (t.avgScore * 100).toFixed(0);
        
        return (
          <div
            key={t.team}
            onClick={() => setSelectedTeam(t)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: 16,
              marginBottom: 10,
              borderRadius: 14,
              background: "#12121a",
              border: "1px solid #2a2a38",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            {/* Rank Badge */}
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: badge.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 16,
              color: badge.text,
              flexShrink: 0
            }}>
              {index + 1}
            </div>

            {/* Team Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 17,
                fontWeight: 600,
                color: "#f0f0f5"
              }}>
                Team {t.team.replace("frc", "")}
              </div>
              <div style={{
                fontSize: 13,
                color: "#6b6b78",
                marginTop: 2
              }}>
                {t.entries.length} match{t.entries.length !== 1 ? "es" : ""} scouted
              </div>
            </div>

            {/* Score */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 4
            }}>
              <div style={{
                fontSize: 22,
                fontWeight: 700,
                color: getScoreColor(t.avgScore)
              }}>
                {scorePercent}%
              </div>
              <div style={{
                width: 60,
                height: 4,
                borderRadius: 2,
                background: "#2a2a38",
                overflow: "hidden"
              }}>
                <div style={{
                  width: `${scorePercent}%`,
                  height: "100%",
                  background: getScoreColor(t.avgScore),
                  borderRadius: 2
                }} />
              </div>
            </div>

            {/* Arrow */}
            <svg width="20" height="20" fill="none" stroke="#6b6b78" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        );
      })}

      {/* Team Detail View */}
      {selectedTeam && (
        <div>
          {/* Back Button */}
          <button
            onClick={() => setSelectedTeam(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              marginBottom: 16,
              background: "#1a1a24",
              border: "1px solid #2a2a38",
              color: "#9898a8",
              borderRadius: 10
            }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Rankings
          </button>

          {/* Team Header Card */}
          <div style={{
            padding: 20,
            marginBottom: 16,
            borderRadius: 16,
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%)",
            border: "1px solid #2a2a38"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, color: "#6b6b78", marginBottom: 4 }}>Team</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: "#f0f0f5" }}>
                  {selectedTeam.team.replace("frc", "")}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, color: "#6b6b78", marginBottom: 4 }}>Overall Score</div>
                <div style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: getScoreColor(selectedTeam.avgScore)
                }}>
                  {(selectedTeam.avgScore * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          {/* Match Entries */}
          <h3 style={{ fontSize: 16, marginBottom: 12, color: "#9898a8" }}>
            Match History ({selectedTeam.entries.length})
          </h3>

          {selectedTeam.entries.map((e, i) => (
            <div
              key={i}
              style={{
                padding: 16,
                marginBottom: 12,
                borderRadius: 14,
                background: "#12121a",
                border: "1px solid #2a2a38"
              }}
            >
              {/* Match Header */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12
              }}>
                <div style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#f0f0f5"
                }}>
                  {e.match.includes("qm") ? `Qual ${e.match.split("qm")[1]}` : e.match}
                </div>
                <div style={{
                  fontSize: 12,
                  color: "#6b6b78",
                  padding: "4px 10px",
                  background: "#1a1a24",
                  borderRadius: 6
                }}>
                  Scout: {e.scout || "Unknown"}
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #2a2a38", margin: "12px 0" }} />

              {/* Stats Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12
              }}>
                <StatItem label="Robot Type" value={formatField(e.robotType)} />
                <StatItem label="Main Focus" value={formatField(e.focus, e.focusOther)} />
                <StatItem label="Auton" value={formatField(e.auton, e.autonOther)} />
                <StatItem label="Climb" value={formatField(e.climb)} />
                <StatItem label="Failures" value={formatField(e.failures, e.failuresOther)} isWarning={e.failures && !e.failures.includes("None")} />
                <StatItem label="Awareness" value={e.awareness || "N/A"} />
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #2a2a38", margin: "12px 0" }} />

              {/* Performance Bars */}
              <div style={{ display: "flex", gap: 16 }}>
                <PerformanceBar label="Accuracy" value={e.accuracy} />
                <PerformanceBar label="Shooting" value={e.shootingSpeed} />
                <PerformanceBar label="Intake" value={e.intakeSpeed} />
              </div>

              {/* Notes */}
              {e.notes && (
                <>
                  <hr style={{ border: "none", borderTop: "1px solid #2a2a38", margin: "12px 0" }} />
                  <div style={{ fontSize: 13, color: "#9898a8" }}>
                    <span style={{ fontWeight: 600, color: "#f0f0f5" }}>Notes: </span>
                    {e.notes}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper Components
function StatItem({ label, value, isWarning }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#6b6b78", marginBottom: 2 }}>{label}</div>
      <div style={{
        fontSize: 13,
        fontWeight: 500,
        color: isWarning ? "#ef4444" : "#f0f0f5"
      }}>
        {value}
      </div>
    </div>
  );
}

function PerformanceBar({ label, value }) {
  const percent = ((value - 1) / 4) * 100;
  return (
    <div style={{ flex: 1 }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 11,
        color: "#6b6b78",
        marginBottom: 4
      }}>
        <span>{label}</span>
        <span style={{ color: "#3b82f6", fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{
        height: 4,
        background: "#2a2a38",
        borderRadius: 2,
        overflow: "hidden"
      }}>
        <div style={{
          width: `${percent}%`,
          height: "100%",
          background: "#3b82f6",
          borderRadius: 2
        }} />
      </div>
    </div>
  );
}

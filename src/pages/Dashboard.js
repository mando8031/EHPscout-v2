import React, { useEffect, useState } from "react";
import NoEvent from "./NoEvent";
import NoData from "./NoData";
import { PageHeader, Card } from "./EventSelect";

export default function Dashboard() {
  const [teams,        setTeams]        = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const selectedEvent = localStorage.getItem("selectedEvent");
  const eventName     = localStorage.getItem("selectedEventName") || "";

  const getSettings = () =>
    JSON.parse(localStorage.getItem("scoringSettings")) || {
      accuracy: 0.3, shootingSpeed: 0.2, intakeSpeed: 0.2,
      auton: 0.1, climb: 0.1, awareness: 0.1, focus: 0.1, robotType: 0.05,
      failurePenalty: 0.2, autonShoot: 1, autonCollectMiddle: 0.6,
      autonCollectDepot: 0.5, autonClimb: 0.8,
      focusScoring: 1, focusPassing: 0.6, focusDefense: 0.8,
      failureLostComm: 1, failureLostPower: 1, failureBrokenIntake: 0.6
    };

  const calculateScore = (entry) => {
    const s = getSettings();
    let score = 0;
    score += ((Number(entry.accuracy) - 1) / 4) * s.accuracy;
    score += ((Number(entry.shootingSpeed) - 1) / 4) * s.shootingSpeed;
    score += ((Number(entry.intakeSpeed) - 1) / 4) * s.intakeSpeed;
    if (entry.awareness === "Yes")          score += s.awareness;
    if (entry.awareness === "Kind of Lost") score += s.awareness * 0.5;
    if (entry.climb?.includes("L3"))        score += s.climb;
    else if (entry.climb?.includes("L2"))   score += s.climb * 0.7;
    else if (entry.climb?.includes("L1"))   score += s.climb * 0.4;
    let autonScore = 0;
    if (entry.auton?.includes("Shoot"))          autonScore += s.autonShoot;
    if (entry.auton?.includes("Collect Middle")) autonScore += s.autonCollectMiddle;
    if (entry.auton?.includes("Collect Depot"))  autonScore += s.autonCollectDepot;
    if (entry.auton?.includes("Climb"))          autonScore += s.autonClimb;
    if (entry.auton?.includes("No Auton / Not Working")) autonScore = 0;
    const maxAuton = s.autonShoot + s.autonCollectMiddle + s.autonCollectDepot + s.autonClimb;
    if (maxAuton > 0) autonScore /= maxAuton;
    score += autonScore * s.auton;
    let focusScore = 0;
    if (entry.focus?.includes("Scoring"))              focusScore += s.focusScoring;
    if (entry.focus?.includes("Passing / Moving Balls")) focusScore += s.focusPassing;
    if (entry.focus?.includes("Defense"))              focusScore += s.focusDefense;
    const maxFocus = s.focusScoring + s.focusPassing + s.focusDefense;
    if (maxFocus > 0) focusScore /= maxFocus;
    score += focusScore * s.focus;
    if (entry.robotType?.includes("Custom")) score += s.robotType;
    let penalty = 0;
    if (entry.failures?.includes("Lost Communication")) penalty += s.failureLostComm;
    if (entry.failures?.includes("Lost Power"))         penalty += s.failureLostPower;
    if (entry.failures?.includes("Broken Intake"))      penalty += s.failureBrokenIntake;
    if (entry.failures?.includes("Other"))              penalty += 0.5;
    score -= penalty * s.failurePenalty;
    return Math.max(0, Math.min(1, score));
  };

  const loadData = () => {
    if (!selectedEvent) { setTeams([]); return; }
    const data     = JSON.parse(localStorage.getItem("scoutingData") || "[]");
    const filtered = data.filter(d => d.event === selectedEvent);
    if (filtered.length === 0) { setTeams([]); return; }
    const grouped = {};
    filtered.forEach(e => { if (!grouped[e.team]) grouped[e.team] = []; grouped[e.team].push(e); });
    const ranked = Object.keys(grouped).map(team => {
      const entries = grouped[team];
      const scores  = entries.map(e => calculateScore(e));
      const avg     = scores.reduce((a, b) => a + b, 0) / scores.length;
      return { team, entries, avgScore: avg };
    });
    ranked.sort((a, b) => b.avgScore - a.avgScore);
    setTeams(ranked);
  };

  useEffect(() => { loadData(); }, [selectedEvent]);
  useEffect(() => {
    const h = () => loadData();
    window.addEventListener("focus", h);
    return () => window.removeEventListener("focus", h);
  }, []);

  if (!selectedEvent) return <NoEvent />;
  if (teams.length === 0) return <NoData />;

  const formatField = (arr, other) => {
    if (!arr || arr.length === 0) return "None";
    return arr.map(v => v === "Other" && other ? `Other: ${other}` : v).join(", ");
  };

  const scoreColor = (s) => {
    if (s >= 0.7) return "#22c55e";
    if (s >= 0.5) return "#3b82f6";
    if (s >= 0.3) return "#eab308";
    return "#ef4444";
  };

  const rankBadge = (i) => {
    if (i === 0) return { bg: "linear-gradient(135deg, #fbbf24, #d97706)", text: "#000" };
    if (i === 1) return { bg: "linear-gradient(135deg, #d1d5db, #9ca3af)", text: "#111" };
    if (i === 2) return { bg: "linear-gradient(135deg, #cd7f32, #92400e)", text: "#fff" };
    return { bg: "var(--bg-elevated)", text: "var(--text-muted)" };
  };

  return (
    <div style={{ padding: "0 14px 16px", maxWidth: 600, margin: "0 auto" }}>
      <PageHeader
        title="Team Rankings"
        subtitle={eventName || `${teams.length} teams scouted`}
        iconBg="var(--blue)"
        icon={
          <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
      />

      {/* Rankings list */}
      {!selectedTeam && teams.map((t, i) => {
        const badge   = rankBadge(i);
        const pct     = (t.avgScore * 100).toFixed(0);
        const color   = scoreColor(t.avgScore);
        return (
          <button
            key={t.team}
            onClick={() => setSelectedTeam(t)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              width: "100%", padding: "13px 14px", marginBottom: 8,
              borderRadius: 12, textAlign: "left",
              background: "var(--bg-card)", border: "1px solid var(--border)",
              color: "var(--text-primary)", transition: "border-color 0.15s"
            }}
          >
            {/* Rank */}
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: badge.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: badge.text
            }}>
              {i + 1}
            </div>

            {/* Name + matches */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>
                Team {t.team.replace("frc", "")}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {t.entries.length} match{t.entries.length !== 1 ? "es" : ""}
              </div>
            </div>

            {/* Score */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color, lineHeight: 1, marginBottom: 6 }}>
                {pct}%
              </div>
              <div style={{ width: 56, height: 3, background: "var(--bg-elevated)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 2 }} />
              </div>
            </div>

            <svg width="16" height="16" fill="none" stroke="var(--text-muted)" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        );
      })}

      {/* Team Detail */}
      {selectedTeam && (
        <div>
          <button
            onClick={() => setSelectedTeam(null)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "9px 14px", marginBottom: 14,
              background: "var(--bg-card)", border: "1px solid var(--border)",
              color: "var(--text-secondary)", borderRadius: 10, fontSize: 13
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Team hero */}
          <Card style={{ marginBottom: 12, padding: "20px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Team</div>
                <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em" }}>
                  {selectedTeam.team.replace("frc", "")}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Score</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: scoreColor(selectedTeam.avgScore), letterSpacing: "-0.03em" }}>
                  {(selectedTeam.avgScore * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </Card>

          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>
            Match History ({selectedTeam.entries.length})
          </div>

          {selectedTeam.entries.map((e, i) => (
            <Card key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  {e.match.includes("qm") ? `Qual ${e.match.split("qm")[1]}` : e.match}
                </span>
                <span style={{ fontSize: 11, color: "var(--text-muted)", background: "var(--bg-elevated)", padding: "3px 8px", borderRadius: 6 }}>
                  {e.scout || "Unknown"}
                </span>
              </div>

              <div style={{ height: 1, background: "var(--border)", marginBottom: 12 }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <StatItem label="Robot Type" value={formatField(e.robotType)} />
                <StatItem label="Main Focus"  value={formatField(e.focus, e.focusOther)} />
                <StatItem label="Auton"       value={formatField(e.auton, e.autonOther)} />
                <StatItem label="Climb"       value={formatField(e.climb)} />
                <StatItem label="Failures"    value={formatField(e.failures, e.failuresOther)}
                  color={e.failures && !e.failures.includes("None") ? "var(--red)" : undefined} />
                <StatItem label="Awareness"   value={e.awareness || "N/A"} />
              </div>

              <div style={{ height: 1, background: "var(--border)", marginBottom: 12 }} />

              <div style={{ display: "flex", gap: 12 }}>
                <PerfBar label="Accuracy" value={e.accuracy} />
                <PerfBar label="Shooting" value={e.shootingSpeed} />
                <PerfBar label="Intake"   value={e.intakeSpeed} />
              </div>

              {e.notes && (
                <>
                  <div style={{ height: 1, background: "var(--border)", margin: "12px 0" }} />
                  <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Notes: </span>{e.notes}
                  </p>
                </>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function StatItem({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: color || "var(--text-primary)" }}>{value}</div>
    </div>
  );
}

function PerfBar({ label, value }) {
  const pct = ((value - 1) / 4) * 100;
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginBottom: 5 }}>
        <span>{label}</span>
        <span style={{ color: "var(--blue)", fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ height: 3, background: "var(--bg-elevated)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "var(--blue)", borderRadius: 2 }} />
      </div>
    </div>
  );
}

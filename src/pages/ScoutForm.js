import React, { useEffect, useState } from "react";
import { getMatches } from "../services/tbaService";
import { PageHeader, Card, SectionLabel } from "./EventSelect";

const SECTION = ({ title, icon, children }) => (
  <Card style={{ marginBottom: 12 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <span style={{ color: "var(--text-muted)" }}>{icon}</span>
      <h3 style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>{title}</h3>
    </div>
    {children}
  </Card>
);

const CHIP_BASE = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  padding: "10px 14px", borderRadius: 10,
  fontSize: 13, fontWeight: 500, cursor: "pointer",
  transition: "all 0.15s ease", border: "1px solid transparent",
  margin: "3px"
};

export default function ScoutForm() {
  const [matches,       setMatches]       = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [teams,         setTeams]         = useState([]);
  const [selectedTeam,  setSelectedTeam]  = useState("");

  const [form, setForm] = useState({
    robotType: [], focus: [], focusOther: "",
    failures: [], failuresOther: "",
    accuracy: 3, shootingSpeed: 3, intakeSpeed: 3,
    auton: [], autonOther: "",
    climb: [], awareness: "", notes: ""
  });

  const eventKey  = localStorage.getItem("selectedEvent");
  const eventName = localStorage.getItem("selectedEventName") || "No event selected";

  useEffect(() => {
    async function loadMatches() {
      if (!eventKey) return;
      const data = await getMatches(eventKey);
      if (Array.isArray(data)) {
        setMatches(
          data.filter(m => m.comp_level === "qm")
              .sort((a, b) => a.match_number - b.match_number)
        );
      }
    }
    loadMatches();
  }, [eventKey]);

  useEffect(() => {
    if (!selectedMatch) return;
    const match = matches.find(m => m.key === selectedMatch);
    if (!match) return;
    setTeams([...match.alliances.red.team_keys, ...match.alliances.blue.team_keys]);
  }, [selectedMatch, matches]);

  const toggleMulti = (field, value) => {
    setForm(prev => {
      const exclusive = { climb: ["No"], failures: ["None"], auton: ["No Auton / Not Working"] };
      const isExcl = exclusive[field]?.includes(value);
      const current = prev[field];
      if (isExcl) return { ...prev, [field]: current.includes(value) ? [] : [value] };
      let next = current.filter(v => !exclusive[field]?.includes(v));
      if (current.includes(value)) next = next.filter(v => v !== value);
      else next.push(value);
      return { ...prev, [field]: next };
    });
  };

  const handleSubmit = () => {
    if (!selectedMatch)                                               return alert("Select a match");
    if (!selectedTeam)                                                return alert("Select a team");
    if (!form.awareness)                                              return alert("Select driver awareness");
    if (form.robotType.length === 0)                                  return alert("Select robot type");
    if (form.focus.length === 0 && !form.focusOther.trim())          return alert("Fill out main focus");
    if (form.failures.length === 0 && !form.failuresOther.trim())    return alert("Fill out failures");
    if (form.auton.length === 0 && !form.autonOther.trim())          return alert("Fill out auton");
    if (form.climb.length === 0)                                      return alert("Select climb");

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const entry = { id: `${Date.now()}`, event: eventKey, match: selectedMatch, team: selectedTeam, scout: user.username, ...form };
    const existing = JSON.parse(localStorage.getItem("scoutingData") || "[]");
    localStorage.setItem("scoutingData", JSON.stringify([...existing, entry]));

    const idx = matches.findIndex(m => m.key === selectedMatch);
    const nextKey = idx !== -1 && idx < matches.length - 1 ? matches[idx + 1].key : "";

    setForm({ robotType: [], focus: [], focusOther: "", failures: [], failuresOther: "", accuracy: 3, shootingSpeed: 3, intakeSpeed: 3, auton: [], autonOther: "", climb: [], awareness: "", notes: "" });
    setSelectedTeam("");
    setTimeout(() => setSelectedMatch(nextKey), 0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---- chip helpers ----
  const chip = (label, active, onClick, colorActive = "var(--blue)") => (
    <button key={label} onClick={onClick} style={{
      ...CHIP_BASE,
      background: active ? `${colorActive}20` : "var(--bg-elevated)",
      border: `1px solid ${active ? colorActive : "transparent"}`,
      color: active ? colorActive : "var(--text-secondary)",
      fontWeight: active ? 600 : 500
    }}>
      {label}
    </button>
  );

  const redChip  = (label, active, fn) => chip(label, active, fn, "var(--red)");
  const blueChip = (label, active, fn) => chip(label, active, fn, "var(--blue)");

  // ---- slider ----
  const Slider = ({ label, field, low, high }) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 28, fontWeight: 800, color: "var(--blue)", lineHeight: 1 }}>{form[field]}</span>
      </div>
      <input
        type="range" min="1" max="5"
        value={form[field]}
        onChange={e => setForm({ ...form, [field]: e.target.value })}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
        <span>{low}</span><span>{high}</span>
      </div>
    </div>
  );

  const match = matches.find(m => m.key === selectedMatch);
  const redTeams  = match?.alliances?.red?.team_keys  || [];
  const blueTeams = match?.alliances?.blue?.team_keys || [];

  return (
    <div style={{ padding: "0 14px 16px", maxWidth: 600, margin: "0 auto" }}>
      <PageHeader
        title="Scout Match"
        subtitle={eventName}
        iconBg="linear-gradient(135deg, var(--red) 0%, var(--blue) 100%)"
        icon={
          <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        }
      />

      {/* Match */}
      <SECTION title="Match" icon={
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      }>
        <select value={selectedMatch} onChange={e => setSelectedMatch(e.target.value)}>
          <option value="">Select qualification match...</option>
          {matches.map(m => (
            <option key={m.key} value={m.key}>Qualification {m.match_number}</option>
          ))}
        </select>
      </SECTION>

      {/* Teams - red left, blue right */}
      <SECTION title="Team" icon={
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      }>
        {teams.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "8px 0" }}>Select a match first</p>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            {/* Red - Left */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--red)", textAlign: "center", marginBottom: 2 }}>Red</div>
              {redTeams.map(t => {
                const active = selectedTeam === t;
                return (
                  <button key={t} onClick={() => setSelectedTeam(t)} style={{
                    width: "100%", padding: "15px 8px",
                    borderRadius: 12,
                    background: active ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.07)",
                    border: `${active ? 2 : 1}px solid ${active ? "var(--red)" : "rgba(239,68,68,0.25)"}`,
                    color: active ? "var(--red)" : "#f87171",
                    fontSize: 20, fontWeight: 700
                  }}>
                    {t.replace("frc", "")}
                  </button>
                );
              })}
            </div>
            {/* Blue - Right */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--blue)", textAlign: "center", marginBottom: 2 }}>Blue</div>
              {blueTeams.map(t => {
                const active = selectedTeam === t;
                return (
                  <button key={t} onClick={() => setSelectedTeam(t)} style={{
                    width: "100%", padding: "15px 8px",
                    borderRadius: 12,
                    background: active ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.07)",
                    border: `${active ? 2 : 1}px solid ${active ? "var(--blue)" : "rgba(59,130,246,0.25)"}`,
                    color: active ? "var(--blue)" : "#60a5fa",
                    fontSize: 20, fontWeight: 700
                  }}>
                    {t.replace("frc", "")}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </SECTION>

      {/* Auton */}
      <SECTION title="Autonomous" icon={
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      }>
        <div style={{ display: "flex", flexWrap: "wrap", margin: -3 }}>
          {["No Auton / Not Working", "Shoot", "Collect Middle", "Collect Depot", "Climb", "Other"].map(opt =>
            chip(opt, form.auton.includes(opt), () => toggleMulti("auton", opt))
          )}
        </div>
        {form.auton.includes("Other") && (
          <input placeholder="Describe other auton..." value={form.autonOther}
            onChange={e => setForm({ ...form, autonOther: e.target.value })}
            style={{ marginTop: 12 }} />
        )}
      </SECTION>

      {/* Robot Type */}
      <SECTION title="Robot Type" icon={
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      }>
        <div style={{ display: "flex", flexWrap: "wrap", margin: -3 }}>
          {["Kitbot", "Custom", "Not Sure"].map(opt =>
            chip(opt, form.robotType.includes(opt), () => setForm(prev => ({ ...prev, robotType: [opt] })))
          )}
        </div>
      </SECTION>

      {/* Main Focus */}
      <SECTION title="Main Focus" icon={
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      }>
        <div style={{ display: "flex", flexWrap: "wrap", margin: -3 }}>
          {["Scoring", "Passing / Moving Balls", "Defense", "Other"].map(opt =>
            chip(opt, form.focus.includes(opt), () => toggleMulti("focus", opt))
          )}
        </div>
        {form.focus.includes("Other") && (
          <input placeholder="Describe other focus..." value={form.focusOther}
            onChange={e => setForm({ ...form, focusOther: e.target.value })}
            style={{ marginTop: 12 }} />
        )}
      </SECTION>

      {/* Performance Sliders */}
      <SECTION title="Performance Ratings" icon={
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      }>
        <Slider label="Accuracy"       field="accuracy"      low="Poor"  high="Excellent" />
        <Slider label="Shooting Speed" field="shootingSpeed" low="Slow"  high="Fast" />
        <Slider label="Intake Speed"   field="intakeSpeed"   low="Slow"  high="Fast" />
      </SECTION>

      {/* Climb */}
      <SECTION title="Climb" icon={
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      }>
        <div style={{ display: "flex", flexWrap: "wrap", margin: -3 }}>
          {["No", "L1", "L2", "L3", "Tried and Failed"].map(opt => {
            const active = form.climb.includes(opt);
            const color = opt === "L3" ? "var(--blue)" : opt === "Tried and Failed" ? "var(--red)" : "var(--blue)";
            return chip(opt, active, () => toggleMulti("climb", opt), color);
          })}
        </div>
      </SECTION>

      {/* Failures */}
      <SECTION title="Failures" icon={
        <svg width="16" height="16" fill="none" stroke="var(--red)" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      }>
        <div style={{ display: "flex", flexWrap: "wrap", margin: -3 }}>
          {["None", "Lost Communication", "Lost Power", "Broken Intake", "Other"].map(opt =>
            chip(opt, form.failures.includes(opt), () => toggleMulti("failures", opt),
              opt === "None" ? "var(--green)" : "var(--red)")
          )}
        </div>
        {form.failures.includes("Other") && (
          <input placeholder="Describe failure..." value={form.failuresOther}
            onChange={e => setForm({ ...form, failuresOther: e.target.value })}
            style={{ marginTop: 12 }} />
        )}
      </SECTION>

      {/* Driver Awareness */}
      <SECTION title="Driver Awareness" icon={
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      }>
        <div style={{ display: "flex", flexWrap: "wrap", margin: -3 }}>
          {["Yes", "No", "Kind of Lost"].map(opt =>
            chip(opt, form.awareness === opt, () => setForm({ ...form, awareness: opt }),
              opt === "Yes" ? "var(--green)" : opt === "No" ? "var(--red)" : "var(--yellow)")
          )}
        </div>
      </SECTION>

      {/* Notes */}
      <SECTION title="Additional Notes" icon={
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      }>
        <textarea
          placeholder="Any other observations about this robot..."
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
        />
      </SECTION>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "17px 0",
          fontSize: 16,
          fontWeight: 700,
          background: "var(--blue)",
          borderRadius: 14,
          marginBottom: 8,
          boxShadow: "0 4px 20px rgba(59,130,246,0.35)",
          letterSpacing: "-0.01em"
        }}
      >
        Save Entry
      </button>
    </div>
  );
}

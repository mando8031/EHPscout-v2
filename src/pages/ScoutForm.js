import React, { useEffect, useState } from "react";
import { getMatches } from "../services/tbaService";

export default function ScoutForm() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");

  const [form, setForm] = useState({
    robotType: [],
    focus: [],
    focusOther: "",
    failures: [],
    failuresOther: "",
    accuracy: 3,
    shootingSpeed: 3,
    intakeSpeed: 3,
    auton: [],
    autonOther: "",
    climb: [],
    awareness: "",
    notes: ""
  });

  const eventKey = localStorage.getItem("selectedEvent");

  useEffect(() => {
    async function loadMatches() {
      if (!eventKey) return;

      const data = await getMatches(eventKey);

      if (Array.isArray(data)) {
        const filtered = data
          .filter(m => m.comp_level === "qm")
          .sort((a, b) => a.match_number - b.match_number);

        setMatches(filtered);
      }
    }

    loadMatches();
  }, [eventKey]);

  useEffect(() => {
    if (!selectedMatch) return;

    const match = matches.find(m => m.key === selectedMatch);
    if (!match) return;

    const allTeams = [
      ...match.alliances.red.team_keys,
      ...match.alliances.blue.team_keys
    ];

    setTeams(allTeams);
  }, [selectedMatch, matches]);

  const toggleMulti = (field, value) => {
    setForm(prev => {
      const current = prev[field];
      const exists = current.includes(value);

      const exclusiveOptions = {
        climb: ["No"],
        failures: ["None"],
        auton: ["No Auton / Not Working"]
      };
  
      const isExclusive = exclusiveOptions[field]?.includes(value);

      if (isExclusive) {
        return {
          ...prev,
          [field]: exists ? [] : [value]
        };
      }

      let newValues = current.filter(
        v => !exclusiveOptions[field]?.includes(v)
      );

      if (exists) {
        newValues = newValues.filter(v => v !== value);
      } else {
        newValues.push(value);
      }

      return {
        ...prev,
        [field]: newValues
      };
    });
  };

  const handleSubmit = () => {
    if (!selectedMatch) return alert("Select a match");
    if (!selectedTeam) return alert("Select a team");
    if (!form.awareness) return alert("Select driver awareness");
    if (form.robotType.length === 0) return alert("Select robot type");
    if (form.focus.length === 0 && form.focusOther.trim() === "") return alert("Fill out main focus");
    if (form.failures.length === 0 && form.failuresOther.trim() === "") return alert("Fill out failures");
    if (form.auton.length === 0 && form.autonOther.trim() === "") return alert("Fill out auton");
    if (form.climb.length === 0) return alert("Select climb");

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const entry = {
      id: `${Date.now()}`,
      event: eventKey,
      match: selectedMatch,
      team: selectedTeam,
      scout: user.username,
      ...form
    };

    const existing = JSON.parse(localStorage.getItem("scoutingData") || "[]");
    localStorage.setItem("scoutingData", JSON.stringify([...existing, entry]));

    const currentIndex = matches.findIndex(m => m.key === selectedMatch);

    let nextMatchKey = "";
    if (currentIndex !== -1 && currentIndex < matches.length - 1) {
      nextMatchKey = matches[currentIndex + 1].key;
    }

    setForm({
      robotType: [],
      focus: [],
      focusOther: "",
      failures: [],
      failuresOther: "",
      accuracy: 3,
      shootingSpeed: 3,
      intakeSpeed: 3,
      auton: [],
      autonOther: "",
      climb: [],
      awareness: "",
      notes: ""
    });

    setSelectedTeam("");

    setTimeout(() => {
      setSelectedMatch(nextMatchKey);
    }, 0);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get team alliance color
  const getTeamAlliance = (teamKey) => {
    if (!selectedMatch) return null;
    const match = matches.find(m => m.key === selectedMatch);
    if (!match) return null;
    
    if (match.alliances.red.team_keys.includes(teamKey)) return "red";
    if (match.alliances.blue.team_keys.includes(teamKey)) return "blue";
    return null;
  };

  // Styles
  const sectionStyle = {
    marginBottom: 16,
    padding: 16,
    background: "#12121a",
    borderRadius: 16,
    border: "1px solid #2a2a38"
  };

  const sectionHeaderStyle = {
    fontSize: 15,
    fontWeight: 600,
    color: "#f0f0f5",
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    gap: 8
  };

  const buttonStyle = (active, variant = "default") => {
    const baseStyle = {
      padding: "12px 16px",
      margin: 4,
      borderRadius: 10,
      border: "none",
      fontSize: 14,
      fontWeight: 500,
      transition: "all 0.2s ease",
      cursor: "pointer"
    };

    if (active) {
      if (variant === "red") {
        return { ...baseStyle, background: "#ef4444", color: "white" };
      } else if (variant === "blue") {
        return { ...baseStyle, background: "#3b82f6", color: "white" };
      }
      return { ...baseStyle, background: "#3b82f6", color: "white" };
    }

    return { ...baseStyle, background: "#1a1a24", color: "#9898a8", border: "1px solid #2a2a38" };
  };

  const sliderLabelStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  };

  const sliderValueStyle = {
    fontSize: 20,
    fontWeight: 700,
    color: "#3b82f6"
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
          background: "linear-gradient(135deg, #ef4444 0%, #3b82f6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>Scout Match</h1>
          <p style={{ margin: 0, fontSize: 13, color: "#6b6b78" }}>
            {localStorage.getItem("selectedEventName") || "No event selected"}
          </p>
        </div>
      </div>

      {/* Match Selection */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Match
        </div>
        <select
          value={selectedMatch}
          onChange={(e) => setSelectedMatch(e.target.value)}
        >
          <option value="">Select Match</option>
          {matches.map(m => (
            <option key={m.key} value={m.key}>
              Qualification {m.match_number}
            </option>
          ))}
        </select>
      </div>

      {/* Team Selection */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Team
        </div>
        {teams.length === 0 ? (
          <p style={{ color: "#6b6b78", fontSize: 14 }}>Select a match first</p>
        ) : (() => {
          const match = matches.find(m => m.key === selectedMatch);
          const redTeams = match?.alliances?.red?.team_keys || [];
          const blueTeams = match?.alliances?.blue?.team_keys || [];
          
          return (
            <div style={{ display: "flex", gap: 12 }}>
              {/* Red Alliance - Left */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ 
                  fontSize: 11, 
                  fontWeight: 700, 
                  color: "#ef4444", 
                  textAlign: "center",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 4
                }}>
                  Red Alliance
                </div>
                {redTeams.map(t => {
                  const isSelected = selectedTeam === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setSelectedTeam(t)}
                      style={{
                        width: "100%",
                        padding: "14px 8px",
                        borderRadius: 12,
                        border: isSelected ? "2px solid #ef4444" : "1px solid rgba(239, 68, 68, 0.3)",
                        background: isSelected 
                          ? "rgba(239, 68, 68, 0.25)" 
                          : "rgba(239, 68, 68, 0.08)",
                        color: isSelected ? "#ef4444" : "#f87171",
                        fontSize: 18,
                        fontWeight: 700,
                        transition: "all 0.2s ease"
                      }}
                    >
                      {t.replace("frc", "")}
                    </button>
                  );
                })}
              </div>

              {/* Blue Alliance - Right */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ 
                  fontSize: 11, 
                  fontWeight: 700, 
                  color: "#3b82f6", 
                  textAlign: "center",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 4
                }}>
                  Blue Alliance
                </div>
                {blueTeams.map(t => {
                  const isSelected = selectedTeam === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setSelectedTeam(t)}
                      style={{
                        width: "100%",
                        padding: "14px 8px",
                        borderRadius: 12,
                        border: isSelected ? "2px solid #3b82f6" : "1px solid rgba(59, 130, 246, 0.3)",
                        background: isSelected 
                          ? "rgba(59, 130, 246, 0.25)" 
                          : "rgba(59, 130, 246, 0.08)",
                        color: isSelected ? "#3b82f6" : "#60a5fa",
                        fontSize: 18,
                        fontWeight: 700,
                        transition: "all 0.2s ease"
                      }}
                    >
                      {t.replace("frc", "")}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Auton */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Autonomous
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {["No Auton / Not Working", "Shoot", "Collect Middle", "Collect Depot", "Climb", "Other"].map(opt => (
            <button
              key={opt}
              style={buttonStyle(form.auton.includes(opt))}
              onClick={() => toggleMulti("auton", opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        {form.auton.includes("Other") && (
          <input
            placeholder="Describe other auton..."
            value={form.autonOther}
            onChange={(e) => setForm({...form, autonOther: e.target.value})}
            style={{ marginTop: 12 }}
          />
        )}
      </div>

      {/* Robot Type */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Robot Type
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {["Kitbot", "Custom", "Not Sure"].map(opt => (
            <button
              key={opt}
              style={buttonStyle(form.robotType.includes(opt))}
              onClick={() => setForm(prev => ({ ...prev, robotType: [opt] }))}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Focus */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Main Focus
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {["Scoring", "Passing / Moving Balls", "Defense", "Other"].map(opt => (
            <button
              key={opt}
              style={buttonStyle(form.focus.includes(opt))}
              onClick={() => toggleMulti("focus", opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        {form.focus.includes("Other") && (
          <input
            placeholder="Describe other focus..."
            value={form.focusOther}
            onChange={(e) => setForm({...form, focusOther: e.target.value})}
            style={{ marginTop: 12 }}
          />
        )}
      </div>

      {/* Performance Sliders */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Performance Ratings
        </div>
        
        {/* Accuracy */}
        <div style={{ marginBottom: 28, maxWidth: 320, margin: "0 auto 28px" }}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <span style={{ color: "#9898a8", fontSize: 14, fontWeight: 500 }}>Accuracy</span>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#3b82f6", marginTop: 4 }}>{form.accuracy}</div>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={form.accuracy}
            onChange={(e) => setForm({...form, accuracy: e.target.value})}
            style={{ width: "100%" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b6b78", marginTop: 8, padding: "0 4px" }}>
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Shooting Speed */}
        <div style={{ marginBottom: 28, maxWidth: 320, margin: "0 auto 28px" }}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <span style={{ color: "#9898a8", fontSize: 14, fontWeight: 500 }}>Shooting Speed</span>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#3b82f6", marginTop: 4 }}>{form.shootingSpeed}</div>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={form.shootingSpeed}
            onChange={(e) => setForm({...form, shootingSpeed: e.target.value})}
            style={{ width: "100%" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b6b78", marginTop: 8, padding: "0 4px" }}>
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>

        {/* Intake Speed */}
        <div style={{ maxWidth: 320, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <span style={{ color: "#9898a8", fontSize: 14, fontWeight: 500 }}>Intake Speed</span>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#3b82f6", marginTop: 4 }}>{form.intakeSpeed}</div>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={form.intakeSpeed}
            onChange={(e) => setForm({...form, intakeSpeed: e.target.value})}
            style={{ width: "100%" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b6b78", marginTop: 8, padding: "0 4px" }}>
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>
      </div>

      {/* Climb */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          Climb
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {["No", "L1", "L2", "L3", "Tried and Failed"].map(opt => (
            <button
              key={opt}
              style={buttonStyle(form.climb.includes(opt), opt === "L3" ? "blue" : opt === "Tried and Failed" ? "red" : "default")}
              onClick={() => toggleMulti("climb", opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Failures */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <svg width="18" height="18" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span style={{ color: "#ef4444" }}>Failures</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {["None", "Lost Communication", "Lost Power", "Broken Intake", "Other"].map(opt => (
            <button
              key={opt}
              style={buttonStyle(form.failures.includes(opt), opt !== "None" ? "red" : "default")}
              onClick={() => toggleMulti("failures", opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        {form.failures.includes("Other") && (
          <input
            placeholder="Describe other failures..."
            value={form.failuresOther}
            onChange={(e) => setForm({...form, failuresOther: e.target.value})}
            style={{ marginTop: 12 }}
          />
        )}
      </div>

      {/* Driver Awareness */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Did they look like they knew what they were doing?
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {["Yes", "No", "Kind of Lost"].map(opt => (
            <button
              key={opt}
              style={buttonStyle(form.awareness === opt)}
              onClick={() => setForm({...form, awareness: opt})}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Additional Notes
        </div>
        <textarea
          placeholder="Any other observations..."
          value={form.notes}
          onChange={(e) => setForm({...form, notes: e.target.value})}
          style={{ minHeight: 100 }}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: 18,
          fontSize: 17,
          fontWeight: 600,
          background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
          borderRadius: 14,
          marginBottom: 20,
          boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)"
        }}
      >
        Save Entry
      </button>
    </div>
  );
}

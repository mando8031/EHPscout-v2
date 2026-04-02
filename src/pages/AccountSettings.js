import React, { useState, useEffect } from "react";

export default function AccountSettings() {
  const defaultSettings = {
    accuracy: 0.1818,
    shootingSpeed: 0.1818,
    intakeSpeed: 0.1818,
    auton: 0.1,
    climb: 0.05,
    awareness: 0.1,
    focus: 0.1,
    robotType: 0.1,
    failurePenalty: 0.1,
    autonShoot: 0.25,
    autonCollectMiddle: 0.25,
    autonCollectDepot: 0.25,
    autonClimb: 0.25,
    focusScoring: 0.3333,
    focusPassing: 0.3333,
    focusDefense: 0.3333,
    failureLostComm: 0.3333,
    failureLostPower: 0.3333,
    failureBrokenIntake: 0.3333
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [presetName, setPresetName] = useState("");
  const [presets, setPresets] = useState({});
  const [teamsInput, setTeamsInput] = useState("");
  const [activeSection, setActiveSection] = useState("presets");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scoringSettings"));
    const savedPresets = JSON.parse(localStorage.getItem("scoringPresets")) || {};
    if (saved) setSettings({ ...defaultSettings, ...saved });
    setPresets(savedPresets);
  }, []);

  useEffect(() => {
    localStorage.setItem("scoringSettings", JSON.stringify(settings));
  }, [settings]);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: Number(value) }));
  };

  const normalizeGroup = (fields, obj = settings) => {
    const total = fields.reduce((sum, f) => sum + obj[f], 0);
    if (total === 0) return obj;
    const updated = { ...obj };
    fields.forEach(f => { updated[f] = obj[f] / total; });
    return updated;
  };

  const total = (fields) => fields.reduce((sum, f) => sum + settings[f], 0);

  const totalDisplay = (value) => (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 10px",
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 600,
      background: Math.abs(value - 1) > 0.01 ? "rgba(239, 68, 68, 0.15)" : "rgba(34, 197, 94, 0.15)",
      color: Math.abs(value - 1) > 0.01 ? "#ef4444" : "#22c55e"
    }}>
      Total: {(value * 100).toFixed(0)}%
    </div>
  );

  const slider = (label, field) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8
      }}>
        <span style={{ fontSize: 13, color: "#9898a8" }}>{label}</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#3b82f6" }}>
          {(settings[field] * 100).toFixed(0)}%
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={settings[field]}
        onChange={(e) => handleChange(field, e.target.value)}
      />
    </div>
  );

  const applyPreset = (type) => {
    const presetMap = {
      balanced: {"accuracy":0.18181818181818182,"shootingSpeed":0.18181818181818182,"intakeSpeed":0.18181818181818182,"auton":0.1,"climb":0.05,"awareness":0.1,"focus":0.1,"robotType":0.1,"failurePenalty":0.1,"autonShoot":0.25,"autonCollectMiddle":0.25,"autonCollectDepot":0.25,"autonClimb":0.25,"focusScoring":0.3333333333333333,"focusPassing":0.3333333333333333,"focusDefense":0.3333333333333333,"failureLostComm":0.3333333333333333,"failureLostPower":0.3333333333333333,"failureBrokenIntake":0.3333333333333333},
      offense: {"accuracy":0.15,"shootingSpeed":0.2,"intakeSpeed":0.2,"auton":0.1,"climb":0.05,"awareness":0.1,"focus":0.1,"robotType":0.1,"failurePenalty":0.1,"autonShoot":0.4,"autonCollectMiddle":0.2,"autonCollectDepot":0.2,"autonClimb":0.2,"focusScoring":0.7142857142857143,"focusPassing":0.14285714285714285,"focusDefense":0.14285714285714285,"failureLostComm":0.5,"failureLostPower":0.25,"failureBrokenIntake":0.25},
      defense: {"accuracy":0.1,"shootingSpeed":0.1,"intakeSpeed":0.1,"auton":0.05,"climb":0.2,"awareness":0.2,"focus":0.2,"robotType":0.05,"failurePenalty":0.2,"autonShoot":0.15,"autonCollectMiddle":0.15,"autonCollectDepot":0.15,"autonClimb":0.55,"focusScoring":0.1,"focusPassing":0.2,"focusDefense":0.7,"failureLostComm":0.5,"failureLostPower":0.4,"failureBrokenIntake":0.1}
    };
    setSettings(presetMap[type]);
  };

  const savePreset = () => {
    if (!presetName) return;
    const updated = { ...presets, [presetName]: settings };
    setPresets(updated);
    localStorage.setItem("scoringPresets", JSON.stringify(updated));
    setPresetName("");
  };

  const loadPreset = (name) => setSettings(presets[name]);

  const exportSettings = () => {
    navigator.clipboard.writeText(JSON.stringify(settings));
    alert("Copied to clipboard!");
  };

  const importSettings = () => {
    const data = prompt("Paste JSON");
    if (data === null || data.trim() === "") return;
    try { setSettings(JSON.parse(data)); } catch { alert("Invalid JSON"); }
  };

  const runCalibration = () => {
    const input = teamsInput.split(",").map(t => t.trim()).filter(Boolean);
    if (input.length === 0) return alert("Enter teams");

    const teams = input.map(t => t.startsWith("frc") ? t : `frc${t}`);
    const data = JSON.parse(localStorage.getItem("scoutingData") || "[]");
    const event = localStorage.getItem("selectedEvent");
    const filtered = data.filter(d => d.event === event && teams.includes(d.team));
    if (filtered.length === 0) return alert("No data for those teams");

    const avg = {
      accuracy: 0, shootingSpeed: 0, intakeSpeed: 0, awareness: 0, climb: 0, robotType: 0,
      auton: { shoot: 0, middle: 0, depot: 0, climb: 0 },
      focus: { scoring: 0, passing: 0, defense: 0 },
      failures: { comm: 0, power: 0, intake: 0 }
    };

    filtered.forEach(e => {
      avg.accuracy += Number(e.accuracy || 0);
      avg.shootingSpeed += Number(e.shootingSpeed || 0);
      avg.intakeSpeed += Number(e.intakeSpeed || 0);
      if (e.awareness === "Yes") avg.awareness += 1;
      else if (e.awareness === "Kind of Lost") avg.awareness += 0.5;
      if (e.climb?.includes("L3")) avg.climb += 1;
      else if (e.climb?.includes("L2")) avg.climb += 0.7;
      else if (e.climb?.includes("L1")) avg.climb += 0.4;
      if (e.robotType?.includes("Custom")) avg.robotType += 1;
      if (e.auton?.includes("Shoot")) avg.auton.shoot += 1;
      if (e.auton?.includes("Collect Middle")) avg.auton.middle += 1;
      if (e.auton?.includes("Collect Depot")) avg.auton.depot += 1;
      if (e.auton?.includes("Climb")) avg.auton.climb += 1;
      if (e.focus?.includes("Scoring")) avg.focus.scoring += 1;
      if (e.focus?.includes("Passing / Moving Balls")) avg.focus.passing += 1;
      if (e.focus?.includes("Defense")) avg.focus.defense += 1;
      if (e.failures?.includes("Lost Communication")) avg.failures.comm += 1;
      if (e.failures?.includes("Lost Power")) avg.failures.power += 1;
      if (e.failures?.includes("Broken Intake")) avg.failures.intake += 1;
    });

    const count = filtered.length;
    const safe = v => v / count;

    avg.accuracy = safe(avg.accuracy);
    avg.shootingSpeed = safe(avg.shootingSpeed);
    avg.intakeSpeed = safe(avg.intakeSpeed);
    avg.awareness = safe(avg.awareness);
    avg.climb = safe(avg.climb);
    avg.robotType = safe(avg.robotType);

    Object.keys(avg.auton).forEach(k => avg.auton[k] = safe(avg.auton[k]));
    Object.keys(avg.focus).forEach(k => avg.focus[k] = safe(avg.focus[k]));
    Object.keys(avg.failures).forEach(k => avg.failures[k] = safe(avg.failures[k]));

    const norm = {
      accuracy: (avg.accuracy - 1) / 4,
      shootingSpeed: (avg.shootingSpeed - 1) / 4,
      intakeSpeed: (avg.intakeSpeed - 1) / 4,
      awareness: avg.awareness,
      climb: avg.climb,
      robotType: avg.robotType,
      auton: (avg.auton.shoot + avg.auton.middle + avg.auton.depot + avg.auton.climb) / 4,
      focus: (avg.focus.scoring + avg.focus.passing + avg.focus.defense) / 3,
      failures: (avg.failures.comm + avg.failures.power + avg.failures.intake) / 3
    };

    let updated = {};
    updated.accuracy = norm.accuracy + 0.01;
    updated.shootingSpeed = norm.shootingSpeed + 0.01;
    updated.intakeSpeed = norm.intakeSpeed + 0.01;
    updated.awareness = norm.awareness + 0.01;
    updated.climb = norm.climb + 0.01;
    updated.auton = norm.auton + 0.01;
    updated.focus = norm.focus + 0.01;
    updated.robotType = norm.robotType + 0.01;
    updated.autonShoot = avg.auton.shoot + 0.01;
    updated.autonCollectMiddle = avg.auton.middle + 0.01;
    updated.autonCollectDepot = avg.auton.depot + 0.01;
    updated.autonClimb = avg.auton.climb + 0.01;
    updated.focusScoring = avg.focus.scoring + 0.01;
    updated.focusPassing = avg.focus.passing + 0.01;
    updated.focusDefense = avg.focus.defense + 0.01;
    updated.failureLostComm = (1 - avg.failures.comm) + 0.01;
    updated.failureLostPower = (1 - avg.failures.power) + 0.01;
    updated.failureBrokenIntake = (1 - avg.failures.intake) + 0.01;
    updated.failurePenalty = settings.failurePenalty;

    const normalize = (fields) => {
      const t = fields.reduce((sum, f) => sum + updated[f], 0);
      if (t === 0) return;
      fields.forEach(f => updated[f] /= t);
    };

    normalize(["accuracy","shootingSpeed","intakeSpeed","auton","climb","awareness","focus","robotType"]);
    normalize(["autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"]);
    normalize(["focusScoring","focusPassing","focusDefense"]);
    normalize(["failureLostComm","failureLostPower","failureBrokenIntake"]);

    setSettings(updated);
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const sections = [
    { id: "presets", label: "Presets" },
    { id: "main", label: "Main Weights" },
    { id: "auton", label: "Auton" },
    { id: "focus", label: "Focus" },
    { id: "failures", label: "Failures" }
  ];

  const cardStyle = {
    padding: 16,
    marginBottom: 16,
    borderRadius: 14,
    background: "#12121a",
    border: "1px solid #2a2a38"
  };

  const btnStyle = (active) => ({
    padding: "10px 16px",
    margin: 4,
    borderRadius: 10,
    border: "none",
    background: active ? "#3b82f6" : "#1a1a24",
    color: active ? "white" : "#9898a8",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer"
  });

  const normalizeBtn = {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid #2a2a38",
    background: "#1a1a24",
    color: "#9898a8",
    fontSize: 12,
    fontWeight: 500,
    marginTop: 8
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
          background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>Settings</h1>
          <p style={{ margin: 0, fontSize: 13, color: "#6b6b78" }}>
            Customize scoring weights
          </p>
        </div>
      </div>

      {/* Section Tabs */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: 16
      }}>
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={btnStyle(activeSection === s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Calibration */}
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12
        }}>
          <svg width="18" height="18" fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 style={{ margin: 0, fontSize: 15, color: "#f0f0f5" }}>Auto-Calibrate</h3>
        </div>
        <p style={{ fontSize: 13, color: "#6b6b78", marginBottom: 12 }}>
          Enter team numbers to optimize weights based on their performance.
        </p>
        <input
          placeholder="1234, 254, 1678"
          value={teamsInput}
          onChange={(e) => setTeamsInput(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <button
          onClick={runCalibration}
          style={{
            width: "100%",
            padding: 12,
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            borderRadius: 10,
            fontWeight: 600
          }}
        >
          Calibrate
        </button>
      </div>

      {/* Presets Section */}
      {activeSection === "presets" && (
        <div style={cardStyle}>
          <h3 style={{ fontSize: 15, marginBottom: 12, color: "#f0f0f5" }}>Quick Presets</h3>
          <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 16 }}>
            <button onClick={() => applyPreset("balanced")} style={btnStyle(false)}>Balanced</button>
            <button onClick={() => applyPreset("offense")} style={btnStyle(false)}>Offense</button>
            <button onClick={() => applyPreset("defense")} style={btnStyle(false)}>Defense</button>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #2a2a38", margin: "16px 0" }} />

          <h4 style={{ fontSize: 13, color: "#9898a8", marginBottom: 12 }}>Custom Presets</h4>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Preset name"
              style={{ flex: 1 }}
            />
            <button onClick={savePreset} style={{ ...btnStyle(true), margin: 0 }}>Save</button>
          </div>
          {Object.keys(presets).length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {Object.keys(presets).map(p => (
                <button key={p} onClick={() => loadPreset(p)} style={btnStyle(false)}>
                  {p}
                </button>
              ))}
            </div>
          )}

          <hr style={{ border: "none", borderTop: "1px solid #2a2a38", margin: "16px 0" }} />

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={exportSettings} style={{ ...btnStyle(false), flex: 1, margin: 0 }}>Export</button>
            <button onClick={importSettings} style={{ ...btnStyle(false), flex: 1, margin: 0 }}>Import</button>
          </div>
        </div>
      )}

      {/* Main Weights */}
      {activeSection === "main" && (
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, color: "#f0f0f5" }}>Main Weights</h3>
            {totalDisplay(total(["accuracy","shootingSpeed","intakeSpeed","auton","climb","awareness","focus","robotType"]))}
          </div>
          {slider("Accuracy", "accuracy")}
          {slider("Shooting Speed", "shootingSpeed")}
          {slider("Intake Speed", "intakeSpeed")}
          {slider("Auton", "auton")}
          {slider("Climb", "climb")}
          {slider("Awareness", "awareness")}
          {slider("Focus", "focus")}
          {slider("Robot Type", "robotType")}
          <button
            onClick={() => setSettings(normalizeGroup(["accuracy","shootingSpeed","intakeSpeed","auton","climb","awareness","focus","robotType"]))}
            style={normalizeBtn}
          >
            Normalize to 100%
          </button>
        </div>
      )}

      {/* Auton Weights */}
      {activeSection === "auton" && (
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, color: "#f0f0f5" }}>Auton Weights</h3>
            {totalDisplay(total(["autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"]))}
          </div>
          {slider("Shoot", "autonShoot")}
          {slider("Collect Middle", "autonCollectMiddle")}
          {slider("Collect Depot", "autonCollectDepot")}
          {slider("Climb", "autonClimb")}
          <button
            onClick={() => setSettings(normalizeGroup(["autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"]))}
            style={normalizeBtn}
          >
            Normalize to 100%
          </button>
        </div>
      )}

      {/* Focus Weights */}
      {activeSection === "focus" && (
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, color: "#f0f0f5" }}>Focus Weights</h3>
            {totalDisplay(total(["focusScoring","focusPassing","focusDefense"]))}
          </div>
          {slider("Scoring", "focusScoring")}
          {slider("Passing", "focusPassing")}
          {slider("Defense", "focusDefense")}
          <button
            onClick={() => setSettings(normalizeGroup(["focusScoring","focusPassing","focusDefense"]))}
            style={normalizeBtn}
          >
            Normalize to 100%
          </button>
        </div>
      )}

      {/* Failure Weights */}
      {activeSection === "failures" && (
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, color: "#f0f0f5" }}>Failure Penalties</h3>
            {totalDisplay(total(["failureLostComm","failureLostPower","failureBrokenIntake"]))}
          </div>
          {slider("Lost Communication", "failureLostComm")}
          {slider("Lost Power", "failureLostPower")}
          {slider("Broken Intake", "failureBrokenIntake")}
          {slider("Overall Penalty", "failurePenalty")}
          <button
            onClick={() => setSettings(normalizeGroup(["failureLostComm","failureLostPower","failureBrokenIntake"]))}
            style={normalizeBtn}
          >
            Normalize to 100%
          </button>
        </div>
      )}

      {/* Logout */}
      <button
        onClick={logout}
        style={{
          width: "100%",
          padding: 16,
          background: "transparent",
          border: "1px solid #ef4444",
          color: "#ef4444",
          borderRadius: 12,
          fontWeight: 600,
          marginTop: 8
        }}
      >
        Log Out
      </button>
    </div>
  );
}

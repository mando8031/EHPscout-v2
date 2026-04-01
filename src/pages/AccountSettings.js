import React, { useState, useEffect } from "react";

export default function AccountSettings() {

  const defaultSettings = {
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

  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scoringSettings"));
    if (saved) setSettings({ ...defaultSettings, ...saved });
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  const saveSettings = () => {
    localStorage.setItem("scoringSettings", JSON.stringify(settings));
    alert("Settings saved!");
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // 🔥 TOTAL CALCULATIONS
  const mainTotal =
    settings.accuracy +
    settings.shootingSpeed +
    settings.intakeSpeed +
    settings.auton +
    settings.climb +
    settings.awareness +
    settings.focus +
    settings.robotType;

  const autonTotal =
    settings.autonShoot +
    settings.autonCollectMiddle +
    settings.autonCollectDepot +
    settings.autonClimb;

  const focusTotal =
    settings.focusScoring +
    settings.focusPassing +
    settings.focusDefense;

  const failureTotal =
    settings.failureLostComm +
    settings.failureLostPower +
    settings.failureBrokenIntake;

  // 🎛️ SLIDER
  const slider = (label, field, isPercent = true) => (
    <div style={{ marginBottom: "12px" }}>
      <p>
        {label}: {isPercent
          ? (settings[field] * 100).toFixed(0) + "%"
          : settings[field].toFixed(2)}
      </p>
      <input
        type="range"
        min="0"
        max={isPercent ? "1" : "2"}
        step="0.05"
        value={settings[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        style={{ width: "100%" }}
      />
    </div>
  );

  // 🔥 TOTAL DISPLAY COMPONENT
  const totalDisplay = (label, total) => (
    <p style={{
      color: Math.abs(total - 1) > 0.01 ? "#ff5252" : "#4caf50",
      fontWeight: "bold"
    }}>
      {label}: {(total * 100).toFixed(0)}%
    </p>
  );

  return (
    <div style={{ padding: "15px", color: "white" }}>
      <h2>Account Settings</h2>

      {/* MAIN WEIGHTS */}
      <div style={box}>
        <h3>Main Weights</h3>
        {totalDisplay("Total", mainTotal)}

        {slider("Accuracy", "accuracy")}
        {slider("Shooting Speed", "shootingSpeed")}
        {slider("Intake Speed", "intakeSpeed")}
        {slider("Auton", "auton")}
        {slider("Climb", "climb")}
        {slider("Awareness", "awareness")}
        {slider("Focus", "focus")}
        {slider("Robot Type", "robotType")}
      </div>

      {/* AUTON */}
      <div style={box}>
        <h3>Auton Breakdown</h3>
        {totalDisplay("Total", autonTotal)}

        {slider("Shoot", "autonShoot", false)}
        {slider("Collect Middle", "autonCollectMiddle", false)}
        {slider("Collect Depot", "autonCollectDepot", false)}
        {slider("Climb", "autonClimb", false)}
      </div>

      {/* FOCUS */}
      <div style={box}>
        <h3>Focus Breakdown</h3>
        {totalDisplay("Total", focusTotal)}

        {slider("Scoring", "focusScoring", false)}
        {slider("Passing", "focusPassing", false)}
        {slider("Defense", "focusDefense", false)}
      </div>

      {/* FAILURES */}
      <div style={box}>
        <h3>Failure Penalties</h3>
        {totalDisplay("Total", failureTotal)}

        {slider("Lost Communication", "failureLostComm", false)}
        {slider("Lost Power", "failureLostPower", false)}
        {slider("Broken Intake", "failureBrokenIntake", false)}
        {slider("Penalty Strength", "failurePenalty")}
      </div>

      <button onClick={saveSettings} style={btn}>Save</button>

      <button onClick={logout} style={{ ...btn, background: "#c62828" }}>
        Logout
      </button>
    </div>
  );
}

// 🎨 STYLES
const box = {
  background: "#1e1e1e",
  padding: "15px",
  borderRadius: "12px",
  marginBottom: "15px"
};

const btn = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  border: "none",
  borderRadius: "10px",
  background: "#2d8cf0",
  color: "white"
};

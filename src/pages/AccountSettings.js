import React, { useState, useEffect } from "react";

export default function AccountSettings() {

  const defaultSettings = {
    accuracy: 0.3,
    shootingSpeed: 0.2,
    intakeSpeed: 0.2,
    auton: 0.1,
    climb: 0.1,
    awareness: 0.1,

    // 🔥 NEW
    focus: 0.1,
    robotType: 0.05,
    failurePenalty: 0.2,

    // AUTON BREAKDOWN
    autonShoot: 1,
    autonCollectMiddle: 0.6,
    autonCollectDepot: 0.5,
    autonClimb: 0.8,

    // 🔥 FOCUS BREAKDOWN
    focusScoring: 1,
    focusPassing: 0.6,
    focusDefense: 0.8,

    // 🔥 FAILURE BREAKDOWN
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

  const slider = (label, field) => (
    <div style={{ marginBottom: "12px" }}>
      <p>{label}: {(settings[field] * 100).toFixed(0)}%</p>
      <input
        type="range"
        min="0"
        max="2"
        step="0.05"
        value={settings[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        style={{ width: "100%" }}
      />
    </div>
  );

  return (
    <div style={{ padding: "15px", color: "white" }}>
      <h2>Account Settings</h2>

      {/* MAIN WEIGHTS */}
      <div style={box}>
        <h3>Main Weights</h3>
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
        {slider("Shoot", "autonShoot")}
        {slider("Collect Middle", "autonCollectMiddle")}
        {slider("Collect Depot", "autonCollectDepot")}
        {slider("Climb", "autonClimb")}
      </div>

      {/* FOCUS */}
      <div style={box}>
        <h3>Focus Breakdown</h3>
        {slider("Scoring", "focusScoring")}
        {slider("Passing", "focusPassing")}
        {slider("Defense", "focusDefense")}
      </div>

      {/* FAILURES */}
      <div style={box}>
        <h3>Failure Penalties</h3>
        {slider("Lost Communication", "failureLostComm")}
        {slider("Lost Power", "failureLostPower")}
        {slider("Broken Intake", "failureBrokenIntake")}
        {slider("Overall Penalty Strength", "failurePenalty")}
      </div>

      <button onClick={saveSettings} style={btn}>Save</button>

      <button onClick={logout} style={{ ...btn, background: "#c62828" }}>
        Logout
      </button>
    </div>
  );
}

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

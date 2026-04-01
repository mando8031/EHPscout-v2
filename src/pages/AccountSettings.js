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
  const [presetName, setPresetName] = useState("");
  const [presets, setPresets] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scoringSettings"));
    const savedPresets = JSON.parse(localStorage.getItem("scoringPresets")) || {};

    if (saved) setSettings({ ...defaultSettings, ...saved });
    setPresets(savedPresets);
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  // 🔥 GENERIC NORMALIZE FUNCTION
  const normalizeGroup = (fields) => {
    const total = fields.reduce((sum, f) => sum + settings[f], 0);
    if (total === 0) return;

    const updated = { ...settings };

    fields.forEach(f => {
      updated[f] = settings[f] / total;
    });

    setSettings(updated);
  };

  // 🔥 PRESETS
  const applyPreset = (type) => {
    const presetMap = {

      balanced: {
        accuracy: 0.18181818181818182,
        shootingSpeed: 0.18181818181818182,
        intakeSpeed: 0.18181818181818182,
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

        focusScoring: 0.3333333333333333,
        focusPassing: 0.3333333333333333,
        focusDefense: 0.3333333333333333,

        failureLostComm: 0.3333333333333333,
        failureLostPower: 0.3333333333333333,
        failureBrokenIntake: 0.3333333333333333
      },

      offense: {
        accuracy: 0.15,
        shootingSpeed: 0.2,
        intakeSpeed: 0.2,
        auton: 0.1,
        climb: 0.05,
        awareness: 0.1,
        focus: 0.1,
        robotType: 0.1,
        failurePenalty: 0.1,

        autonShoot: 0.4,
        autonCollectMiddle: 0.2,
        autonCollectDepot: 0.2,
        autonClimb: 0.2,

        focusScoring: 0.7142857142857143,
        focusPassing: 0.14285714285714285,
        focusDefense: 0.14285714285714285,

        failureLostComm: 0.5,
        failureLostPower: 0.25,
        failureBrokenIntake: 0.25
      },

      defense: {
        accuracy: 0.1,
        shootingSpeed: 0.1,
        intakeSpeed: 0.1,
        auton: 0.05,
        climb: 0.2,
        awareness: 0.2,
        focus: 0.2,
        robotType: 0.05,
        failurePenalty: 0.2,

        autonShoot: 0.15,
        autonCollectMiddle: 0.15,
        autonCollectDepot: 0.15,
        autonClimb: 0.55,

        focusScoring: 0.1,
        focusPassing: 0.2,
        focusDefense: 0.7,

        failureLostComm: 0.5,
        failureLostPower: 0.4,
        failureBrokenIntake: 0.1
      }
    };

    setSettings(prev => ({
      ...prev,
      ...presetMap[type]
    }));
  };

  // 🔥 SAVE PRESET
  const savePreset = () => {
    if (!presetName) return alert("Enter name");

    const updated = { ...presets, [presetName]: settings };
    setPresets(updated);
    localStorage.setItem("scoringPresets", JSON.stringify(updated));
    setPresetName("");
  };

  const loadPreset = (name) => setSettings(presets[name]);

  const exportSettings = () => {
    navigator.clipboard.writeText(JSON.stringify(settings));
    alert("Copied!");
  };

  const importSettings = () => {
    const data = prompt("Paste JSON");
    if (!data) return;
    try {
      setSettings(JSON.parse(data));
    } catch {
      alert("Invalid");
    }
  };

  const saveSettings = () => {
    localStorage.setItem("scoringSettings", JSON.stringify(settings));
    alert("Saved!");
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // 🔥 TOTALS
  const total = (fields) =>
    fields.reduce((sum, f) => sum + settings[f], 0);

  const totalDisplay = (label, value) => (
    <p style={{
      color: Math.abs(value - 1) > 0.01 ? "red" : "lime",
      fontWeight: "bold"
    }}>
      {label}: {(value * 100).toFixed(0)}%
    </p>
  );

  const slider = (label, field, percent = true) => (
    <div style={{ marginBottom: "10px" }}>
      <p>{label}: {percent
        ? (settings[field] * 100).toFixed(0) + "%"
        : settings[field].toFixed(2)}</p>
      <input
        type="range"
        min="0"
        max={percent ? "1" : "2"}
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

      {/* PRESETS */}
      <div style={box}>
        <h3>Presets</h3>
        <button onClick={() => applyPreset("balanced")} style={btnSmall}>Balanced</button>
        <button onClick={() => applyPreset("offense")} style={btnSmall}>Offense</button>
        <button onClick={() => applyPreset("defense")} style={btnSmall}>Defense</button>

        <hr />

        <input
          placeholder="Preset name"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
        />
        <button onClick={savePreset} style={btnSmall}>Save Preset</button>

        {Object.keys(presets).map(name => (
          <button key={name} onClick={() => loadPreset(name)} style={btnSmall}>
            Load {name}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <div style={box}>
        <h3>Main Weights</h3>
        {totalDisplay("Total", total([
          "accuracy","shootingSpeed","intakeSpeed",
          "auton","climb","awareness","focus","robotType"
        ]))}

        {slider("Accuracy", "accuracy")}
        {slider("Shooting Speed", "shootingSpeed")}
        {slider("Intake Speed", "intakeSpeed")}
        {slider("Auton", "auton")}
        {slider("Climb", "climb")}
        {slider("Awareness", "awareness")}
        {slider("Focus", "focus")}
        {slider("Robot Type", "robotType")}

        <button onClick={() =>
          normalizeGroup([
            "accuracy","shootingSpeed","intakeSpeed",
            "auton","climb","awareness","focus","robotType"
          ])
        } style={btnSmall}>
          Normalize
        </button>
      </div>

      {/* AUTON */}
      <div style={box}>
        <h3>Auton Breakdown</h3>
        {totalDisplay("Total", total([
          "autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"
        ]))}

        {slider("Shoot", "autonShoot", false)}
        {slider("Collect Middle", "autonCollectMiddle", false)}
        {slider("Collect Depot", "autonCollectDepot", false)}
        {slider("Climb", "autonClimb", false)}

        <button onClick={() =>
          normalizeGroup([
            "autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"
          ])
        } style={btnSmall}>
          Normalize
        </button>
      </div>

      {/* FOCUS */}
      <div style={box}>
        <h3>Focus Breakdown</h3>
        {totalDisplay("Total", total([
          "focusScoring","focusPassing","focusDefense"
        ]))}

        {slider("Scoring", "focusScoring", false)}
        {slider("Passing", "focusPassing", false)}
        {slider("Defense", "focusDefense", false)}

        <button onClick={() =>
          normalizeGroup([
            "focusScoring","focusPassing","focusDefense"
          ])
        } style={btnSmall}>
          Normalize
        </button>
      </div>

      {/* FAILURES */}
      <div style={box}>
        <h3>Failure Penalties</h3>
        {totalDisplay("Total", total([
          "failureLostComm","failureLostPower","failureBrokenIntake"
        ]))}

        {slider("Lost Comm", "failureLostComm", false)}
        {slider("Lost Power", "failureLostPower", false)}
        {slider("Broken Intake", "failureBrokenIntake", false)}
        {slider("Penalty Strength", "failurePenalty")}

        <button onClick={() =>
          normalizeGroup([
            "failureLostComm","failureLostPower","failureBrokenIntake"
          ])
        } style={btnSmall}>
          Normalize
        </button>
      </div>

      {/* IMPORT EXPORT */}
      <div style={box}>
        <h3>Import / Export</h3>
        <button onClick={exportSettings} style={btnSmall}>Export</button>
        <button onClick={importSettings} style={btnSmall}>Import</button>
      </div>

      <button onClick={saveSettings} style={btn}>Save</button>

      <button onClick={logout} style={{ ...btn, background: "red" }}>
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

const btnSmall = {
  margin: "5px",
  padding: "8px 12px",
  borderRadius: "8px",
  border: "none",
  background: "#333",
  color: "white"
};

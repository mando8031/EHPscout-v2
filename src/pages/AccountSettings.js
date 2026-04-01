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
  const [presets, setPresets] = useState({});
  const [presetName, setPresetName] = useState("");

  const [calibrationTeams, setCalibrationTeams] = useState([]);
  const [teamInput, setTeamInput] = useState("");

  // 🔥 LOAD SETTINGS
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scoringSettings"));
    const savedPresets = JSON.parse(localStorage.getItem("scoringPresets")) || {};

    if (saved) setSettings({ ...defaultSettings, ...saved });
    setPresets(savedPresets);
  }, []);

  // 🔥 AUTO SAVE
  useEffect(() => {
    localStorage.setItem("scoringSettings", JSON.stringify(settings));
  }, [settings]);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  // 🔥 NORMALIZE
  const normalizeGroup = (fields) => {
    const total = fields.reduce((sum, f) => sum + settings[f], 0);
    if (total === 0) return;

    const updated = { ...settings };
    fields.forEach(f => updated[f] = settings[f] / total);
    setSettings(updated);
  };

  // 🔥 TOTAL DISPLAY
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
      <p>
        {label}: {percent
          ? (settings[field] * 100).toFixed(0) + "%"
          : settings[field].toFixed(2)}
      </p>
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

  // 🔥 BUILT-IN PRESETS
  const builtInPresets = {
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

  const applyPreset = (type) => {
    setSettings(builtInPresets[type]);
  };

  // 🔥 CUSTOM PRESETS
  const savePreset = () => {
    if (!presetName) return alert("Enter name");

    const updated = { ...presets, [presetName]: settings };
    setPresets(updated);
    localStorage.setItem("scoringPresets", JSON.stringify(updated));
    setPresetName("");
  };

  const loadPreset = (name) => setSettings(presets[name]);

  // 🔥 CALIBRATION
  const addTeam = () => {
    if (!teamInput) return;
    if (calibrationTeams.length >= 5) return alert("Max 5 teams");

    setCalibrationTeams([...calibrationTeams, teamInput]);
    setTeamInput("");
  };

  const runCalibration = () => {
    const data = JSON.parse(localStorage.getItem("scoutingData") || "[]");

    const filtered = data.filter(d =>
      calibrationTeams.includes(d.team.replace("frc", ""))
    );

    if (!filtered.length) return alert("No data");

    let avg = { accuracy: 0, shootingSpeed: 0, intakeSpeed: 0 };

    filtered.forEach(e => {
      avg.accuracy += Number(e.accuracy || 0);
      avg.shootingSpeed += Number(e.shootingSpeed || 0);
      avg.intakeSpeed += Number(e.intakeSpeed || 0);
    });

    Object.keys(avg).forEach(k => avg[k] /= filtered.length);

    const totalVal = Object.values(avg).reduce((a, b) => a + b, 0);

    const updated = { ...settings };
    Object.keys(avg).forEach(k => {
      updated[k] = avg[k] / totalVal;
    });

    setSettings(updated);
    alert("Calibration done");
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: "15px", color: "white" }}>
      <h2>Account Settings (Auto-Save Enabled)</h2>

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
        <button onClick={savePreset} style={btnSmall}>Save</button>

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

      {/* CALIBRATION */}
      <div style={box}>
        <h3>Calibration</h3>

        <input
          placeholder="Team #"
          value={teamInput}
          onChange={(e) => setTeamInput(e.target.value)}
        />
        <button onClick={addTeam} style={btnSmall}>Add</button>

        <p>{calibrationTeams.join(", ")}</p>

        <button onClick={runCalibration} style={btnSmall}>
          Calibrate
        </button>
      </div>

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

import React, { useState, useEffect } from "react";

export default function AccountSettings() {

  const defaultSettings = {
    accuracy: 0.18,
    shootingSpeed: 0.18,
    intakeSpeed: 0.18,
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

    focusScoring: 0.33,
    focusPassing: 0.33,
    focusDefense: 0.33,

    failureLostComm: 0.33,
    failureLostPower: 0.33,
    failureBrokenIntake: 0.33
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [teamsInput, setTeamsInput] = useState("");
  const [presets, setPresets] = useState({});
  const [presetName, setPresetName] = useState("");

  // 🔥 LOAD
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scoringSettings"));
    const savedPresets = JSON.parse(localStorage.getItem("scoringPresets")) || {};

    if (saved) setSettings({ ...defaultSettings, ...saved });
    setPresets(savedPresets);
  }, []);

  // 🔥 AUTOSAVE
  useEffect(() => {
    localStorage.setItem("scoringSettings", JSON.stringify(settings));
  }, [settings]);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  // 🔥 SAFE IMPORT (FIXED CRASH)
  const importSettings = () => {
    const data = prompt("Paste JSON");
    if (!data) return; // ✅ FIX

    try {
      const parsed = JSON.parse(data);
      setSettings(prev => ({ ...prev, ...parsed }));
    } catch {
      alert("Invalid JSON");
    }
  };

  const exportSettings = () => {
    navigator.clipboard.writeText(JSON.stringify(settings));
    alert("Copied!");
  };

  // 🔥 PRESETS
  const savePreset = () => {
    if (!presetName) return alert("Enter name");

    const updated = { ...presets, [presetName]: settings };
    setPresets(updated);
    localStorage.setItem("scoringPresets", JSON.stringify(updated));
    setPresetName("");
  };

  const loadPreset = (name) => setSettings(presets[name]);

  // 🔥 NORMALIZE
  const normalize = (fields) => {
    const total = fields.reduce((s, f) => s + settings[f], 0);
    if (total === 0) return;

    const updated = { ...settings };
    fields.forEach(f => {
      updated[f] = settings[f] / total;
    });

    setSettings(updated);
  };

  // 🔥 CALIBRATION (FULLY FIXED)
  const calibrate = () => {

    if (!teamsInput) return alert("Enter teams");

    const raw = JSON.parse(localStorage.getItem("scoutingData") || "[]");

    const teams = teamsInput
      .split(",")
      .map(t => "frc" + t.trim()); // ✅ FIX (auto add frc)

    const filtered = raw.filter(d => teams.includes(d.team));

    if (filtered.length === 0) {
      alert("No data for those teams");
      return;
    }

    // 🔥 COUNT FEATURE IMPORTANCE
    const counts = {
      accuracy: 0,
      shootingSpeed: 0,
      intakeSpeed: 0,
      auton: 0,
      climb: 0,
      awareness: 0,
      focus: 0,
      robotType: 0,
      failures: 0
    };

    const sub = {
      autonShoot: 0,
      autonCollectMiddle: 0,
      autonCollectDepot: 0,
      autonClimb: 0,

      focusScoring: 0,
      focusPassing: 0,
      focusDefense: 0,

      failureLostComm: 0,
      failureLostPower: 0,
      failureBrokenIntake: 0
    };

    filtered.forEach(e => {
      counts.accuracy += Number(e.accuracy || 0);
      counts.shootingSpeed += Number(e.shootingSpeed || 0);
      counts.intakeSpeed += Number(e.intakeSpeed || 0);

      if (e.auton?.length) counts.auton++;
      if (e.climb?.length) counts.climb++;
      if (e.awareness === "Yes") counts.awareness++;

      if (e.focus?.length) counts.focus++;
      if (e.robotType?.includes("Custom")) counts.robotType++;

      if (e.failures?.length) counts.failures++;

      // 🔥 SUB CATEGORIES
      if (e.auton?.includes("Shoot")) sub.autonShoot++;
      if (e.auton?.includes("Collect Middle")) sub.autonCollectMiddle++;
      if (e.auton?.includes("Collect Depot")) sub.autonCollectDepot++;
      if (e.auton?.includes("Climb")) sub.autonClimb++;

      if (e.focus?.includes("Scoring")) sub.focusScoring++;
      if (e.focus?.includes("Passing / Moving Balls")) sub.focusPassing++;
      if (e.focus?.includes("Defense")) sub.focusDefense++;

      if (e.failures?.includes("Lost Communication")) sub.failureLostComm++;
      if (e.failures?.includes("Lost Power")) sub.failureLostPower++;
      if (e.failures?.includes("Broken Intake")) sub.failureBrokenIntake++;
    });

    // 🔥 NORMALIZE MAIN
    const totalMain = Object.values(counts).reduce((a, b) => a + b, 0);

    const updated = { ...settings };

    Object.keys(counts).forEach(k => {
      if (k === "failures") {
        updated.failurePenalty = counts[k] / totalMain;
      } else {
        updated[k] = counts[k] / totalMain;
      }
    });

    // 🔥 NORMALIZE SUB GROUPS
    const normalizeSub = (keys) => {
      const total = keys.reduce((s, k) => s + sub[k], 0);
      if (total === 0) return;

      keys.forEach(k => {
        updated[k] = sub[k] / total;
      });
    };

    normalizeSub(["autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"]);
    normalizeSub(["focusScoring","focusPassing","focusDefense"]);
    normalizeSub(["failureLostComm","failureLostPower","failureBrokenIntake"]);

    setSettings(updated);

    alert("Calibration applied!");
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const slider = (label, field) => (
    <div style={{ marginBottom: "10px" }}>
      <p>{label}: {(settings[field] * 100).toFixed(0)}%</p>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={settings[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        style={{ width: "100%" }}
      />
    </div>
  );

  return (
    <div style={{ padding: "15px", color: "white" }}>
      <h2>Account Settings</h2>

      {/* CALIBRATION */}
      <div style={box}>
        <h3>Calibration</h3>
        <input
          placeholder="Enter teams (1234, 5678)"
          value={teamsInput}
          onChange={(e) => setTeamsInput(e.target.value)}
        />
        <button onClick={calibrate} style={btn}>Calibrate</button>
      </div>

      {/* PRESETS */}
      <div style={box}>
        <h3>Presets</h3>

        <input
          placeholder="Preset name"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
        />

        <button onClick={savePreset} style={btn}>Save Preset</button>

        {Object.keys(presets).map(name => (
          <button key={name} onClick={() => loadPreset(name)} style={btn}>
            Load {name}
          </button>
        ))}
      </div>

      {/* MAIN */}
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

      {/* IMPORT / EXPORT */}
      <div style={box}>
        <button onClick={exportSettings} style={btn}>Export</button>
        <button onClick={importSettings} style={btn}>Import</button>
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
  padding: "10px",
  marginTop: "10px",
  border: "none",
  borderRadius: "10px",
  background: "#2d8cf0",
  color: "white"
};

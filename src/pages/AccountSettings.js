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
  const [calibrationTeams, setCalibrationTeams] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scoringSettings"));
    const savedPresets = JSON.parse(localStorage.getItem("scoringPresets")) || {};

    if (saved) setSettings({ ...defaultSettings, ...saved });
    setPresets(savedPresets);
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: Number(value) }));
  };

  // 🔥 NORMALIZE
  const normalize = (obj) => {
    const sum = Object.values(obj).reduce((a, b) => a + b, 0);
    if (sum === 0) return obj;
    const result = {};
    Object.keys(obj).forEach(k => result[k] = obj[k] / sum);
    return result;
  };

  const normalizeGroup = (fields) => {
    const total = fields.reduce((s, f) => s + settings[f], 0);
    if (total === 0) return;

    const updated = { ...settings };
    fields.forEach(f => updated[f] = settings[f] / total);
    setSettings(updated);
  };

  // 🔥 FULL CALIBRATION
  const calibrateWeights = () => {
    const event = localStorage.getItem("selectedEvent");
    if (!event) return alert("No event selected");

    const data = JSON.parse(localStorage.getItem("scoutingData") || "[]");

    const teams = calibrationTeams
      .split(",")
      .map(t => "frc" + t.trim());

    const filtered = data.filter(d =>
      d.event === event && teams.includes(d.team)
    );

    if (filtered.length === 0) return alert("No data found");

    let totals = {
      accuracy: 0,
      shootingSpeed: 0,
      intakeSpeed: 0,
      climb: 0,
      awareness: 0,

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
      totals.accuracy += Number(e.accuracy || 0);
      totals.shootingSpeed += Number(e.shootingSpeed || 0);
      totals.intakeSpeed += Number(e.intakeSpeed || 0);

      if (e.climb?.includes("L3")) totals.climb += 3;
      else if (e.climb?.includes("L2")) totals.climb += 2;
      else if (e.climb?.includes("L1")) totals.climb += 1;

      if (e.awareness === "Yes") totals.awareness += 3;
      else if (e.awareness === "Kind of Lost") totals.awareness += 1;

      if (e.auton?.includes("Shoot")) totals.autonShoot++;
      if (e.auton?.includes("Collect Middle")) totals.autonCollectMiddle++;
      if (e.auton?.includes("Collect Depot")) totals.autonCollectDepot++;
      if (e.auton?.includes("Climb")) totals.autonClimb++;

      if (e.focus?.includes("Scoring")) totals.focusScoring++;
      if (e.focus?.includes("Passing / Moving Balls")) totals.focusPassing++;
      if (e.focus?.includes("Defense")) totals.focusDefense++;

      if (e.failures?.includes("Lost Communication")) totals.failureLostComm++;
      if (e.failures?.includes("Lost Power")) totals.failureLostPower++;
      if (e.failures?.includes("Broken Intake")) totals.failureBrokenIntake++;
    });

    const count = filtered.length;

    let main = normalize({
      accuracy: totals.accuracy / count,
      shootingSpeed: totals.shootingSpeed / count,
      intakeSpeed: totals.intakeSpeed / count,
      climb: totals.climb / count,
      awareness: totals.awareness / count,
      auton: (totals.autonShoot + totals.autonCollectMiddle + totals.autonCollectDepot + totals.autonClimb) / count,
      focus: (totals.focusScoring + totals.focusPassing + totals.focusDefense) / count,
      robotType: 0.1
    });

    let auton = normalize({
      autonShoot: totals.autonShoot,
      autonCollectMiddle: totals.autonCollectMiddle,
      autonCollectDepot: totals.autonCollectDepot,
      autonClimb: totals.autonClimb
    });

    let focus = normalize({
      focusScoring: totals.focusScoring,
      focusPassing: totals.focusPassing,
      focusDefense: totals.focusDefense
    });

    let failures = normalize({
      failureLostComm: totals.failureLostComm,
      failureLostPower: totals.failureLostPower,
      failureBrokenIntake: totals.failureBrokenIntake
    });

    const totalFailures =
      totals.failureLostComm +
      totals.failureLostPower +
      totals.failureBrokenIntake;

    const failurePenalty =
      totalFailures === 0 ? 0.3 : Math.max(0.05, 1 - totalFailures / (count * 3));

    setSettings(prev => ({
      ...prev,
      ...main,
      ...auton,
      ...focus,
      ...failures,
      failurePenalty
    }));

    alert("🔥 Calibration complete");
  };

  // 🔥 PRESETS (unchanged behavior)
  const applyPreset = (type) => {
    const presetMap = { /* KEEP YOUR EXISTING PRESETS HERE */ };
    setSettings(prev => ({ ...prev, ...presetMap[type] }));
  };

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
    try { setSettings(JSON.parse(data)); }
    catch { alert("Invalid"); }
  };

  const saveSettings = () => {
    localStorage.setItem("scoringSettings", JSON.stringify(settings));
    alert("Saved!");
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

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

      {/* 🔥 CALIBRATION */}
      <div style={box}>
        <h3>Auto Calibration</h3>
        <input
          placeholder="254, 1678, 1114..."
          value={calibrationTeams}
          onChange={(e) => setCalibrationTeams(e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        />
        <button onClick={calibrateWeights} style={btnSmall}>
          Calibrate to Top Teams
        </button>
      </div>

      {/* KEEP REST OF YOUR UI EXACTLY THE SAME */}

      <button onClick={saveSettings} style={btn}>Save</button>
      <button onClick={logout} style={{ ...btn, background: "red" }}>Logout</button>
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

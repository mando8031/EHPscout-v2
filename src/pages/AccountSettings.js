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
    setSettings(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  const normalizeGroup = (fields) => {
    const total = fields.reduce((sum, f) => sum + settings[f], 0);
    if (total === 0) return;

    const updated = { ...settings };
    fields.forEach(f => updated[f] /= total);
    setSettings(updated);
  };

  const total = (fields) =>
    fields.reduce((sum, f) => sum + settings[f], 0);

  const totalDisplay = (value) => (
    <p style={{
      color: Math.abs(value - 1) > 0.01 ? "red" : "lime",
      fontWeight: "bold"
    }}>
      Total: {(value * 100).toFixed(0)}%
    </p>
  );

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

  // 🔥 PRESETS
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

  // 🔥 IMPORT / EXPORT FIX
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
      alert("Invalid JSON");
    }
  };

  // 🔥 CALIBRATION (AVERAGE TEAM → 100%)
  const runCalibration = () => {
    const input = teamsInput.split(",").map(t => t.trim()).filter(Boolean);
    if (input.length === 0) return alert("Enter teams");

    const teams = input.map(t => t.startsWith("frc") ? t : `frc${t}`);
    const data = JSON.parse(localStorage.getItem("scoutingData") || "[]");
    const event = localStorage.getItem("selectedEvent");

    const filtered = data.filter(d => d.event === event && teams.includes(d.team));
    if (filtered.length === 0) return alert("No data");

    const count = filtered.length;

    const avg = {
      accuracy:0, shootingSpeed:0, intakeSpeed:0,
      awareness:0, climb:0, robotType:0,
      auton:{shoot:0,middle:0,depot:0,climb:0},
      focus:{scoring:0,passing:0,defense:0},
      failures:{comm:0,power:0,intake:0}
    };

    filtered.forEach(e=>{
      avg.accuracy+=Number(e.accuracy||0);
      avg.shootingSpeed+=Number(e.shootingSpeed||0);
      avg.intakeSpeed+=Number(e.intakeSpeed||0);

      if(e.awareness==="Yes") avg.awareness+=1;
      else if(e.awareness==="Kind of Lost") avg.awareness+=0.5;

      if(e.climb?.includes("L3")) avg.climb+=1;
      else if(e.climb?.includes("L2")) avg.climb+=0.7;
      else if(e.climb?.includes("L1")) avg.climb+=0.4;

      if(e.robotType?.includes("Custom")) avg.robotType+=1;

      if(e.auton?.includes("Shoot")) avg.auton.shoot++;
      if(e.auton?.includes("Collect Middle")) avg.auton.middle++;
      if(e.auton?.includes("Collect Depot")) avg.auton.depot++;
      if(e.auton?.includes("Climb")) avg.auton.climb++;

      if(e.focus?.includes("Scoring")) avg.focus.scoring++;
      if(e.focus?.includes("Passing")) avg.focus.passing++;
      if(e.focus?.includes("Defense")) avg.focus.defense++;

      if(e.failures?.includes("Lost Communication")) avg.failures.comm++;
      if(e.failures?.includes("Lost Power")) avg.failures.power++;
      if(e.failures?.includes("Broken Intake")) avg.failures.intake++;
    });

    Object.keys(avg).forEach(k=>{
      if(typeof avg[k]==="number") avg[k]/=count;
    });
    Object.keys(avg.auton).forEach(k=>avg.auton[k]/=count);
    Object.keys(avg.focus).forEach(k=>avg.focus[k]/=count);
    Object.keys(avg.failures).forEach(k=>avg.failures[k]/=count);

    let updated = { ...settings };

    const invert = v => 1 - Math.min(1, v/5);

    updated.accuracy = invert(avg.accuracy);
    updated.shootingSpeed = invert(avg.shootingSpeed);
    updated.intakeSpeed = invert(avg.intakeSpeed);
    updated.awareness = invert(avg.awareness*5);
    updated.climb = invert(avg.climb*5);
    updated.robotType = 1 - avg.robotType;

    updated.autonShoot = 1-avg.auton.shoot;
    updated.autonCollectMiddle = 1-avg.auton.middle;
    updated.autonCollectDepot = 1-avg.auton.depot;
    updated.autonClimb = 1-avg.auton.climb;

    updated.focusScoring = 1-avg.focus.scoring;
    updated.focusPassing = 1-avg.focus.passing;
    updated.focusDefense = 1-avg.focus.defense;

    updated.failureLostComm = avg.failures.comm;
    updated.failureLostPower = avg.failures.power;
    updated.failureBrokenIntake = avg.failures.intake;

    setSettings(updated);
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={{ padding:"15px", color:"white" }}>
      <h2>Account Settings</h2>

      <div style={box}>
        <h3>Calibration</h3>
        <input value={teamsInput} onChange={(e)=>setTeamsInput(e.target.value)} placeholder="1234, 254"/>
        <button onClick={runCalibration} style={btn}>Calibrate</button>
      </div>

      {/* KEEP REST EXACTLY SAME (sliders, presets, normalize, import/export) */}

      <button onClick={logout} style={{...btn, background:"red"}}>
        Logout
      </button>
    </div>
  );
}

const box = { background:"#1e1e1e", padding:"15px", borderRadius:"12px", marginBottom:"15px" };
const btn = { width:"100%", padding:"12px", marginTop:"10px", border:"none", borderRadius:"10px", background:"#2d8cf0", color:"white" };
const btnSmall = { margin:"5px", padding:"8px 12px", borderRadius:"8px", border:"none", background:"#333", color:"white" };

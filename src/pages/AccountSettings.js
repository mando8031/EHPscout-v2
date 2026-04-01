import React, { useState, useEffect } from "react";

export default function AccountSettings() {

  const balancedPreset = {"accuracy":0.18181818181818182,"shootingSpeed":0.18181818181818182,"intakeSpeed":0.18181818181818182,"auton":0.1,"climb":0.05,"awareness":0.1,"focus":0.1,"robotType":0.1,"failurePenalty":0.1,"autonShoot":0.25,"autonCollectMiddle":0.25,"autonCollectDepot":0.25,"autonClimb":0.25,"focusScoring":0.3333333333333333,"focusPassing":0.3333333333333333,"focusDefense":0.3333333333333333,"failureLostComm":0.3333333333333333,"failureLostPower":0.3333333333333333,"failureBrokenIntake":0.3333333333333333};

  const offensePreset = {"accuracy":0.15,"shootingSpeed":0.2,"intakeSpeed":0.2,"auton":0.1,"climb":0.05,"awareness":0.1,"focus":0.1,"robotType":0.1,"failurePenalty":0.1,"autonShoot":0.4,"autonCollectMiddle":0.2,"autonCollectDepot":0.2,"autonClimb":0.2,"focusScoring":0.7142857142857143,"focusPassing":0.14285714285714285,"focusDefense":0.14285714285714285,"failureLostComm":0.5,"failureLostPower":0.25,"failureBrokenIntake":0.25};

  const defensePreset = {"accuracy":0.1,"shootingSpeed":0.1,"intakeSpeed":0.1,"auton":0.05,"climb":0.2,"awareness":0.2,"focus":0.2,"robotType":0.05,"failurePenalty":0.2,"autonShoot":0.15,"autonCollectMiddle":0.15,"autonCollectDepot":0.15,"autonClimb":0.55,"focusScoring":0.1,"focusPassing":0.2,"focusDefense":0.7,"failureLostComm":0.5,"failureLostPower":0.4,"failureBrokenIntake":0.1};

  const [settings, setSettings] = useState(balancedPreset);
  const [presetName, setPresetName] = useState("");
  const [presets, setPresets] = useState({});
  const [teamsInput, setTeamsInput] = useState("");

  // LOAD
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scoringSettings"));
    const savedPresets = JSON.parse(localStorage.getItem("scoringPresets")) || {};
    if (saved) setSettings(saved);
    setPresets(savedPresets);
  }, []);

  // NORMALIZE FUNCTION
  const normalizeGroup = (obj, fields) => {
    const total = fields.reduce((sum, f) => sum + obj[f], 0);
    if (total === 0) return obj;
    const updated = { ...obj };
    fields.forEach(f => updated[f] = obj[f] / total);
    return updated;
  };

  // AUTO NORMALIZE + SAVE
  useEffect(() => {
    let updated = { ...settings };

    updated = normalizeGroup(updated, ["accuracy","shootingSpeed","intakeSpeed","auton","climb","awareness","focus","robotType"]);
    updated = normalizeGroup(updated, ["autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"]);
    updated = normalizeGroup(updated, ["focusScoring","focusPassing","focusDefense"]);
    updated = normalizeGroup(updated, ["failureLostComm","failureLostPower","failureBrokenIntake"]);

    localStorage.setItem("scoringSettings", JSON.stringify(updated));
    setSettings(updated);

  }, [
    settings.accuracy,
    settings.shootingSpeed,
    settings.intakeSpeed,
    settings.auton,
    settings.climb,
    settings.awareness,
    settings.focus,
    settings.robotType,

    settings.autonShoot,
    settings.autonCollectMiddle,
    settings.autonCollectDepot,
    settings.autonClimb,

    settings.focusScoring,
    settings.focusPassing,
    settings.focusDefense,

    settings.failureLostComm,
    settings.failureLostPower,
    settings.failureBrokenIntake
  ]);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  // 🔥 MANUAL NORMALIZE BUTTONS
  const normalizeMain = () => {
    setSettings(prev => normalizeGroup(prev, ["accuracy","shootingSpeed","intakeSpeed","auton","climb","awareness","focus","robotType"]));
  };

  const normalizeAuton = () => {
    setSettings(prev => normalizeGroup(prev, ["autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"]));
  };

  const normalizeFocus = () => {
    setSettings(prev => normalizeGroup(prev, ["focusScoring","focusPassing","focusDefense"]));
  };

  const normalizeFailures = () => {
    setSettings(prev => normalizeGroup(prev, ["failureLostComm","failureLostPower","failureBrokenIntake"]));
  };

  // CALIBRATION (same as before)
  const runCalibration = () => {
    const teams = teamsInput.split(",").map(t=>t.trim()).filter(Boolean).map(t=>t.startsWith("frc")?t:`frc${t}`);

    const eventKey = localStorage.getItem("selectedEvent");
    const data = JSON.parse(localStorage.getItem("scoutingData") || "[]");

    const filtered = data.filter(d => d.event === eventKey && teams.includes(d.team));
    if (!filtered.length) return alert("No data");

    let avg = { accuracy:0, shootingSpeed:0, intakeSpeed:0 };

    filtered.forEach(e=>{
      avg.accuracy += Number(e.accuracy||0);
      avg.shootingSpeed += Number(e.shootingSpeed||0);
      avg.intakeSpeed += Number(e.intakeSpeed||0);
    });

    const count = filtered.length;
    Object.keys(avg).forEach(k=>avg[k]/=count);

    setSettings(prev=>({
      ...prev,
      accuracy: 1 - avg.accuracy/5,
      shootingSpeed: 1 - avg.shootingSpeed/5,
      intakeSpeed: 1 - avg.intakeSpeed/5
    }));
  };

  // PRESETS
  const applyPreset = (preset) => setSettings(preset);

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
    alert("Copied!");
  };

  const importSettings = () => {
    const data = prompt("Paste JSON");
    if (!data) return;
    try { setSettings(JSON.parse(data)); }
    catch { alert("Invalid JSON"); }
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const slider = (label, field) => (
    <div style={{ marginBottom: 10 }}>
      <p>{label}: {(settings[field]*100).toFixed(0)}%</p>
      <input type="range" min="0" max="1" step="0.05"
        value={settings[field]}
        onChange={(e)=>handleChange(field,e.target.value)}
        style={{ width:"100%" }}
      />
    </div>
  );

  return (
    <div style={{ padding:15, color:"white" }}>

      <h2>Account Settings</h2>

      {/* CALIBRATION */}
      <div style={box}>
        <h3>Calibration</h3>
        <input value={teamsInput} onChange={e=>setTeamsInput(e.target.value)} placeholder="1234, 254"/>
        <button onClick={runCalibration} style={btn}>Calibrate</button>
      </div>

      {/* PRESETS */}
      <div style={box}>
        <h3>Presets</h3>
        <button onClick={()=>applyPreset(balancedPreset)} style={btnSmall}>Balanced</button>
        <button onClick={()=>applyPreset(offensePreset)} style={btnSmall}>Offense</button>
        <button onClick={()=>applyPreset(defensePreset)} style={btnSmall}>Defense</button>

        <hr/>

        <input value={presetName} onChange={e=>setPresetName(e.target.value)} placeholder="Preset name"/>
        <button onClick={savePreset} style={btnSmall}>Save</button>

        {Object.keys(presets).map(p=>(
          <button key={p} onClick={()=>loadPreset(p)} style={btnSmall}>{p}</button>
        ))}
      </div>

      {/* MAIN */}
      <div style={box}>
        <h3>Main</h3>
        {slider("Accuracy","accuracy")}
        {slider("Shooting","shootingSpeed")}
        {slider("Intake","intakeSpeed")}
        {slider("Auton","auton")}
        {slider("Climb","climb")}
        {slider("Awareness","awareness")}
        {slider("Focus","focus")}
        {slider("Robot Type","robotType")}
        <button onClick={normalizeMain} style={btnSmall}>Normalize</button>
      </div>

      {/* AUTON */}
      <div style={box}>
        <h3>Auton</h3>
        {slider("Shoot","autonShoot")}
        {slider("Middle","autonCollectMiddle")}
        {slider("Depot","autonCollectDepot")}
        {slider("Climb","autonClimb")}
        <button onClick={normalizeAuton} style={btnSmall}>Normalize</button>
      </div>

      {/* FOCUS */}
      <div style={box}>
        <h3>Focus</h3>
        {slider("Scoring","focusScoring")}
        {slider("Passing","focusPassing")}
        {slider("Defense","focusDefense")}
        <button onClick={normalizeFocus} style={btnSmall}>Normalize</button>
      </div>

      {/* FAILURES */}
      <div style={box}>
        <h3>Failures</h3>
        {slider("Lost Comm","failureLostComm")}
        {slider("Lost Power","failureLostPower")}
        {slider("Broken Intake","failureBrokenIntake")}
        {slider("Penalty","failurePenalty")}
        <button onClick={normalizeFailures} style={btnSmall}>Normalize</button>
      </div>

      <div style={box}>
        <button onClick={exportSettings} style={btnSmall}>Export</button>
        <button onClick={importSettings} style={btnSmall}>Import</button>
      </div>

      <button onClick={logout} style={{...btn, background:"red"}}>Logout</button>

    </div>
  );
}

const box = {
  background:"#1e1e1e",
  padding:"15px",
  borderRadius:"12px",
  marginBottom:"15px"
};

const btn = {
  width:"100%",
  padding:"12px",
  marginTop:"10px",
  border:"none",
  borderRadius:"10px",
  background:"#2d8cf0",
  color:"white"
};

const btnSmall = {
  margin:"5px",
  padding:"8px 12px",
  borderRadius:"8px",
  border:"none",
  background:"#333",
  color:"white"
};

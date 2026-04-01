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
  const [presetName, setPresetName] = useState("");
  const [presets, setPresets] = useState({});
  const [teamsInput, setTeamsInput] = useState("");

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

  // 🔥 NORMALIZE
  const normalizeGroup = (fields) => {
    const total = fields.reduce((sum, f) => sum + settings[f], 0);
    if (total === 0) return;

    const updated = { ...settings };
    fields.forEach(f => {
      updated[f] = settings[f] / total;
    });

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

  // 🔥 PRESETS (YOUR EXACT ONES)
  const applyPreset = (type) => {
    const presetMap = {

      balanced: {"accuracy":0.18181818181818182,"shootingSpeed":0.18181818181818182,"intakeSpeed":0.18181818181818182,"auton":0.1,"climb":0.05,"awareness":0.1,"focus":0.1,"robotType":0.1,"failurePenalty":0.1,"autonShoot":0.25,"autonCollectMiddle":0.25,"autonCollectDepot":0.25,"autonClimb":0.25,"focusScoring":0.3333333333333333,"focusPassing":0.3333333333333333,"focusDefense":0.3333333333333333,"failureLostComm":0.3333333333333333,"failureLostPower":0.3333333333333333,"failureBrokenIntake":0.3333333333333333},

      offense: {"accuracy":0.15,"shootingSpeed":0.2,"intakeSpeed":0.2,"auton":0.1,"climb":0.05,"awareness":0.1,"focus":0.1,"robotType":0.1,"failurePenalty":0.1,"autonShoot":0.4,"autonCollectMiddle":0.2,"autonCollectDepot":0.2,"autonClimb":0.2,"focusScoring":0.7142857142857143,"focusPassing":0.14285714285714285,"focusDefense":0.14285714285714285,"failureLostComm":0.5,"failureLostPower":0.25,"failureBrokenIntake":0.25},

      defense: {"accuracy":0.1,"shootingSpeed":0.1,"intakeSpeed":0.1,"auton":0.05,"climb":0.2,"awareness":0.2,"focus":0.2,"robotType":0.05,"failurePenalty":0.2,"autonShoot":0.15,"autonCollectMiddle":0.15,"autonCollectDepot":0.15,"autonClimb":0.55,"focusScoring":0.1,"focusPassing":0.2,"focusDefense":0.7,"failureLostComm":0.5,"failureLostPower":0.4,"failureBrokenIntake":0.1}
    };

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

  // 🔥 IMPORT / EXPORT (FIXED)
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

  // 🔥 CALIBRATION (FULL)
  const runCalibration = () => {
    if (selectedTeams.length === 0) {
      alert("Add teams first");
      return;
    }

    const eventKey = localStorage.getItem("selectedEvent");
    const data = JSON.parse(localStorage.getItem("scoutingData") || "[]");

    // 🔍 normalize team input (allow "1234" or "frc1234")
    const normalizedTeams = selectedTeams.map(t =>
      t.startsWith("frc") ? t : `frc${t}`
    );

    const filtered = data.filter(
      d => d.event === eventKey && normalizedTeams.includes(d.team)
    );

    if (filtered.length === 0) {
      alert("No data for selected teams");
      return;
    }

    // 🧠 BUILD AVERAGE TEAM PROFILE
    const avg = {
      accuracy: 0,
      shootingSpeed: 0,
      intakeSpeed: 0,

      awareness: 0,
      climb: 0,

      auton: {
        shoot: 0,
        middle: 0,
        depot: 0,
        climb: 0
      },

      focus: {
        scoring: 0,
        passing: 0,
        defense: 0
      },

      failures: {
        comm: 0,
        power: 0,
        intake: 0
      },

      robotType: 0
    };

    filtered.forEach(e => {
      avg.accuracy += Number(e.accuracy || 0);
      avg.shootingSpeed += Number(e.shootingSpeed || 0);
      avg.intakeSpeed += Number(e.intakeSpeed || 0);

      // awareness
      if (e.awareness === "Yes") avg.awareness += 1;
      else if (e.awareness === "Kind of Lost") avg.awareness += 0.5;

      // climb
      if (e.climb?.includes("L3")) avg.climb += 1;
      else if (e.climb?.includes("L2")) avg.climb += 0.7;
      else if (e.climb?.includes("L1")) avg.climb += 0.4;

      // auton
      if (e.auton?.includes("Shoot")) avg.auton.shoot += 1;
      if (e.auton?.includes("Collect Middle")) avg.auton.middle += 1;
      if (e.auton?.includes("Collect Depot")) avg.auton.depot += 1;
      if (e.auton?.includes("Climb")) avg.auton.climb += 1;

      // focus
      if (e.focus?.includes("Scoring")) avg.focus.scoring += 1;
      if (e.focus?.includes("Passing / Moving Balls")) avg.focus.passing += 1;
      if (e.focus?.includes("Defense")) avg.focus.defense += 1;

      // failures
      if (e.failures?.includes("Lost Communication")) avg.failures.comm += 1;
      if (e.failures?.includes("Lost Power")) avg.failures.power += 1;
      if (e.failures?.includes("Broken Intake")) avg.failures.intake += 1;

      // robot type
      if (e.robotType?.includes("Custom")) avg.robotType += 1;
    });

    const count = filtered.length;

    // 🔥 NORMALIZE (0–1)
    Object.keys(avg).forEach(k => {
      if (typeof avg[k] === "number") avg[k] /= count;
    });
 
    Object.keys(avg.auton).forEach(k => avg.auton[k] /= count);
    Object.keys(avg.focus).forEach(k => avg.focus[k] /= count);
    Object.keys(avg.failures).forEach(k => avg.failures[k] /= count);

    // 🧠 INVERT (weakness → higher weight)
    const invert = (v) => 1 - Math.min(1, v / 5);

    const newSettings = { ...settings };

    // MAIN
    newSettings.accuracy = invert(avg.accuracy);
    newSettings.shootingSpeed = invert(avg.shootingSpeed);
    newSettings.intakeSpeed = invert(avg.intakeSpeed);
    newSettings.awareness = invert(avg.awareness * 5);
    newSettings.climb = invert(avg.climb * 5);
    newSettings.robotType = 1 - avg.robotType;

    // AUTON
    newSettings.autonShoot = 1 - avg.auton.shoot;
    newSettings.autonCollectMiddle = 1 - avg.auton.middle;
    newSettings.autonCollectDepot = 1 - avg.auton.depot;
    newSettings.autonClimb = 1 - avg.auton.climb;

    // FOCUS
    newSettings.focusScoring = 1 - avg.focus.scoring;
    newSettings.focusPassing = 1 - avg.focus.passing;
    newSettings.focusDefense = 1 - avg.focus.defense;

    // FAILURES (more failures = MORE penalty)
    newSettings.failureLostComm = avg.failures.comm;
    newSettings.failureLostPower = avg.failures.power;
    newSettings.failureBrokenIntake = avg.failures.intake;

    // 🔥 NORMALIZE GROUPS
    const normalize = (fields) => {
      const total = fields.reduce((sum, f) => sum + newSettings[f], 0);
      if (total === 0) return;
      fields.forEach(f => newSettings[f] /= total);
    };

    normalize(["accuracy","shootingSpeed","intakeSpeed","auton","climb","awareness","focus","robotType"]);
    normalize(["autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"]);
    normalize(["focusScoring","focusPassing","focusDefense"]);
    normalize(["failureLostComm","failureLostPower","failureBrokenIntake"]);

    setSettings(newSettings);
  };

  return (
    <div style={{ padding:"15px", color:"white" }}>
      <h2>Account Settings</h2>

      {/* CALIBRATION */}
      <div style={box}>
        <h3>Calibration</h3>
        <input
          placeholder="1234, 254, 1678"
          value={teamsInput}
          onChange={(e)=>setTeamsInput(e.target.value)}
        />
        <button onClick={calibrate} style={btn}>Calibrate</button>
      </div>

      {/* PRESETS */}
      <div style={box}>
        <h3>Presets</h3>
        <button onClick={()=>applyPreset("balanced")} style={btnSmall}>Balanced</button>
        <button onClick={()=>applyPreset("offense")} style={btnSmall}>Offense</button>
        <button onClick={()=>applyPreset("defense")} style={btnSmall}>Defense</button>

        <hr/>

        <input value={presetName} onChange={(e)=>setPresetName(e.target.value)} placeholder="Preset name"/>
        <button onClick={savePreset} style={btnSmall}>Save</button>

        {Object.keys(presets).map(p=>(
          <button key={p} onClick={()=>loadPreset(p)} style={btnSmall}>
            {p}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <div style={box}>
        <h3>Main</h3>
        {totalDisplay("Total", total(["accuracy","shootingSpeed","intakeSpeed","auton","climb","awareness","focus","robotType"]))}
        {slider("Accuracy","accuracy")}
        {slider("Shooting","shootingSpeed")}
        {slider("Intake","intakeSpeed")}
        {slider("Auton","auton")}
        {slider("Climb","climb")}
        {slider("Awareness","awareness")}
        {slider("Focus","focus")}
        {slider("Robot Type","robotType")}
        <button onClick={()=>normalizeGroup(["accuracy","shootingSpeed","intakeSpeed","auton","climb","awareness","focus","robotType"])} style={btnSmall}>
          Normalize
        </button>
      </div>

      {/* AUTON */}
      <div style={box}>
        <h3>Auton</h3>
        {totalDisplay("Total", total(["autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"]))}
        {slider("Shoot","autonShoot")}
        {slider("Middle","autonCollectMiddle")}
        {slider("Depot","autonCollectDepot")}
        {slider("Climb","autonClimb")}
        <button onClick={()=>normalizeGroup(["autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"])} style={btnSmall}>
          Normalize
        </button>
      </div>

      {/* FOCUS */}
      <div style={box}>
        <h3>Focus</h3>
        {totalDisplay("Total", total(["focusScoring","focusPassing","focusDefense"]))}
        {slider("Scoring","focusScoring")}
        {slider("Passing","focusPassing")}
        {slider("Defense","focusDefense")}
        <button onClick={()=>normalizeGroup(["focusScoring","focusPassing","focusDefense"])} style={btnSmall}>
          Normalize
        </button>
      </div>

      {/* FAILURES */}
      <div style={box}>
        <h3>Failures</h3>
        {totalDisplay("Total", total(["failureLostComm","failureLostPower","failureBrokenIntake"]))}
        {slider("Lost Comm","failureLostComm")}
        {slider("Lost Power","failureLostPower")}
        {slider("Broken Intake","failureBrokenIntake")}
        {slider("Penalty","failurePenalty")}
        <button onClick={()=>normalizeGroup(["failureLostComm","failureLostPower","failureBrokenIntake"])} style={btnSmall}>
          Normalize
        </button>
      </div>

      <div style={box}>
        <button onClick={exportSettings} style={btnSmall}>Export</button>
        <button onClick={importSettings} style={btnSmall}>Import</button>
      </div>

      <button onClick={logout} style={{...btn, background:"red"}}>
        Logout
      </button>
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

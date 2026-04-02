import React, { useState, useEffect } from "react";

export default function AccountSettings() {

  // 🔥 DEFAULT (BALANCED)
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
  const normalizeGroup = (fields, obj = settings) => {
    const total = fields.reduce((sum, f) => sum + obj[f], 0);
    if (total === 0) return obj;

    const updated = { ...obj };
    fields.forEach(f => {
      updated[f] = obj[f] / total;
    });

    return updated;
  };

  // 🔥 TOTAL DISPLAY
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

  const slider = (label, field, max = 1) => (
    <div style={{ marginBottom: "10px" }}>
      <p>{label}: {(settings[field] * 100).toFixed(0)}%</p>
      <input
        type="range"
        min="0"
        max={max}
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

  // 🔥 IMPORT / EXPORT (FIXED)
  const exportSettings = () => {
    navigator.clipboard.writeText(JSON.stringify(settings));
    alert("Copied!");
  };

  const importSettings = () => {
    const data = prompt("Paste JSON");
    if (data === null) return;
    if (data.trim() === "") return;
    try {
      setSettings(JSON.parse(data));
    } catch {
      alert("Invalid JSON");
    }
  };

  // 🔥 CALIBRATION (AVERAGE TEAM)
  const runCalibration = () => {
    const input = teamsInput.split(",").map(t => t.trim()).filter(Boolean);
    if (input.length === 0) return alert("Enter teams");

    const teams = input.map(t => t.startsWith("frc") ? t : `frc${t}`);

    const data = JSON.parse(localStorage.getItem("scoutingData") || "[]");
    const event = localStorage.getItem("selectedEvent");

    const filtered = data.filter(d => d.event === event && teams.includes(d.team));
    if (filtered.length === 0) return alert("No data for those teams");

    // 🔥 BUILD AVERAGE TEAM
    const avg = {
      accuracy: 0,
      shootingSpeed: 0,
      intakeSpeed: 0,
      awareness: 0,
      climb: 0,
      robotType: 0,
  
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

    // 🔥 CONVERT AVG TEAM → SCORING SPACE (same as dashboard)
    const norm = {
      accuracy: (avg.accuracy - 1) / 4,
      shootingSpeed: (avg.shootingSpeed - 1) / 4,
      intakeSpeed: (avg.intakeSpeed - 1) / 4,

      awareness: avg.awareness,
      climb: avg.climb,
      robotType: avg.robotType,

      // 🔥 PURE AVERAGES (NO settings reference)
      auton:
        (avg.auton.shoot +
         avg.auton.middle +
         avg.auton.depot +
         avg.auton.climb) / 4,

      focus:
        (avg.focus.scoring +
         avg.focus.passing +
         avg.focus.defense) / 3,

      failures:
        (avg.failures.comm +
         avg.failures.power +
         avg.failures.intake) / 3
    };

    let updated = {};

    // 🔥 boost what the average team is GOOD at
    // MAIN (direct mapping from avg → weights)
    updated.accuracy = norm.accuracy + 0.01;
    updated.shootingSpeed = norm.shootingSpeed + 0.01;
    updated.intakeSpeed = norm.intakeSpeed + 0.01;
    updated.awareness = norm.awareness + 0.01;
    updated.climb = norm.climb + 0.01;
    updated.auton = norm.auton + 0.01;
    updated.focus = norm.focus + 0.01;
    updated.robotType = norm.robotType + 0.01;

    // AUTON
    updated.autonShoot = avg.auton.shoot + 0.01;
    updated.autonCollectMiddle = avg.auton.middle + 0.01;
    updated.autonCollectDepot = avg.auton.depot + 0.01;
    updated.autonClimb = avg.auton.climb + 0.01;

    // FOCUS
    updated.focusScoring = avg.focus.scoring + 0.01;
    updated.focusPassing = avg.focus.passing + 0.01;
    updated.focusDefense = avg.focus.defense + 0.01;

    // FAILURES
    // 🔥 INVERT FAILURES (rare = important, common = less important)
    updated.failureLostComm = (1 - avg.failures.comm) + 0.01;
    updated.failureLostPower = (1 - avg.failures.power) + 0.01;
    updated.failureBrokenIntake = (1 - avg.failures.intake) + 0.01;

    // 🔥 RE-NORMALIZE GROUPS (keep structure clean)
    const normalize = (fields) => {
      const total = fields.reduce((sum, f) => sum + updated[f], 0);
      if (total === 0) return;
      fields.forEach(f => updated[f] /= total);
    };

    // normalize ALL groups so sliders visibly change

    // MAIN
    normalize([
      "accuracy","shootingSpeed","intakeSpeed",
      "auton","climb","awareness","focus","robotType"
    ]);

    // AUTON
    normalize([
      "autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"
    ]);

    // FOCUS
    normalize([
      "focusScoring","focusPassing","focusDefense"
    ]);

    // FAILURES
    normalize([
      "failureLostComm","failureLostPower","failureBrokenIntake"
    ]);
    
    setSettings(updated);
  };


  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
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
        <button onClick={runCalibration} style={btn}>Calibrate</button>
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
        {totalDisplay(total(["accuracy","shootingSpeed","intakeSpeed","auton","climb","awareness","focus","robotType"]))}

        {slider("Accuracy","accuracy")}
        {slider("Shooting","shootingSpeed")}
        {slider("Intake","intakeSpeed")}
        {slider("Auton","auton")}
        {slider("Climb","climb")}
        {slider("Awareness","awareness")}
        {slider("Focus","focus")}
        {slider("Robot Type","robotType")}

        <button onClick={()=>setSettings(normalizeGroup(["accuracy","shootingSpeed","intakeSpeed","auton","climb","awareness","focus","robotType"]))} style={btnSmall}>
          Normalize
        </button>
      </div>

      {/* AUTON */}
      <div style={box}>
        <h3>Auton</h3>
        {totalDisplay(total(["autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"]))}

        {slider("Shoot","autonShoot")}
        {slider("Middle","autonCollectMiddle")}
        {slider("Depot","autonCollectDepot")}
        {slider("Climb","autonClimb")}

        <button onClick={()=>setSettings(normalizeGroup(["autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"]))} style={btnSmall}>
          Normalize
        </button>
      </div>

      {/* FOCUS */}
      <div style={box}>
        <h3>Focus</h3>
        {totalDisplay(total(["focusScoring","focusPassing","focusDefense"]))}

        {slider("Scoring","focusScoring")}
        {slider("Passing","focusPassing")}
        {slider("Defense","focusDefense")}

        <button onClick={()=>setSettings(normalizeGroup(["focusScoring","focusPassing","focusDefense"]))} style={btnSmall}>
          Normalize
        </button>
      </div>

      {/* FAILURES */}
      <div style={box}>
        <h3>Failures</h3>
        {totalDisplay(total(["failureLostComm","failureLostPower","failureBrokenIntake"]))}

        {slider("Lost Comm","failureLostComm")}
        {slider("Lost Power","failureLostPower")}
        {slider("Broken Intake","failureBrokenIntake")}
        {slider("Penalty","failurePenalty")}

        <button onClick={()=>setSettings(normalizeGroup(["failureLostComm","failureLostPower","failureBrokenIntake"]))} style={btnSmall}>
          Normalize
        </button>
      </div>

      {/* IMPORT EXPORT */}
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

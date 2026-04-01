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
  const calibrate = () => {

    const raw = JSON.parse(localStorage.getItem("scoutingData") || "[]");

    const teams = teamsInput
      .split(",")
      .map(t => "frc" + t.trim());

    const filtered = raw.filter(d => teams.includes(d.team));

    if (!filtered.length) return alert("No data");

    const updated = { ...settings };

    // MAIN
    const count = {
      accuracy: 0, shootingSpeed: 0, intakeSpeed: 0,
      auton: 0, climb: 0, awareness: 0,
      focus: 0, robotType: 0, failures: 0
    };

    const sub = {
      autonShoot:0,autonCollectMiddle:0,autonCollectDepot:0,autonClimb:0,
      focusScoring:0,focusPassing:0,focusDefense:0,
      failureLostComm:0,failureLostPower:0,failureBrokenIntake:0
    };

    filtered.forEach(e => {
      count.accuracy += Number(e.accuracy || 0);
      count.shootingSpeed += Number(e.shootingSpeed || 0);
      count.intakeSpeed += Number(e.intakeSpeed || 0);

      if (e.auton?.length) count.auton++;
      if (e.climb?.length) count.climb++;
      if (e.awareness === "Yes") count.awareness++;
      if (e.focus?.length) count.focus++;
      if (e.robotType?.includes("Custom")) count.robotType++;
      if (e.failures?.length) count.failures++;

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

    const totalMain = Object.values(count).reduce((a,b)=>a+b,0);

    Object.keys(count).forEach(k=>{
      if(k==="failures"){
        updated.failurePenalty = count[k]/totalMain;
      } else {
        updated[k] = count[k]/totalMain;
      }
    });

    const normalizeSub = (keys) => {
      const t = keys.reduce((s,k)=>s+sub[k],0);
      if (!t) return;
      keys.forEach(k => updated[k] = sub[k]/t);
    };

    normalizeSub(["autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"]);
    normalizeSub(["focusScoring","focusPassing","focusDefense"]);
    normalizeSub(["failureLostComm","failureLostPower","failureBrokenIntake"]);

    setSettings(updated);
    alert("Calibration complete");
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const slider = (label, field) => (
    <div style={{ marginBottom: "10px" }}>
      <p>{label}: {(settings[field] * 100).toFixed(0)}%</p>
      <input type="range" min="0" max="1" step="0.01"
        value={settings[field]}
        onChange={(e)=>handleChange(field,e.target.value)}
        style={{ width:"100%" }}
      />
    </div>
  );

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

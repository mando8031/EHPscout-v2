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

  const presetMap = {
    balanced: defaultSettings,

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

      focusScoring: 0.71,
      focusPassing: 0.14,
      focusDefense: 0.14,

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

  const [settings, setSettings] = useState(defaultSettings);
  const [presets, setPresets] = useState({});
  const [presetName, setPresetName] = useState("");
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [teamInput, setTeamInput] = useState("");

  // LOAD
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scoringSettings"));
    const savedPresets = JSON.parse(localStorage.getItem("scoringPresets")) || {};

    if (saved) setSettings({ ...defaultSettings, ...saved });
    setPresets(savedPresets);
  }, []);

  // AUTOSAVE
  useEffect(() => {
    localStorage.setItem("scoringSettings", JSON.stringify(settings));
  }, [settings]);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: Number(value) }));
  };

  const normalizeGroup = (fields) => {
    let total = fields.reduce((s, f) => s + settings[f], 0) || 1;
    const updated = { ...settings };
    fields.forEach(f => updated[f] = settings[f] / total);
    setSettings(updated);
  };

  // 🔥 FULL CALIBRATION
  const calibrate = () => {
    const event = localStorage.getItem("selectedEvent");
    const data = JSON.parse(localStorage.getItem("scoutingData") || "[]")
      .filter(d => d.event === event);

    if (!data.length) return alert("No data");

    const grouped = {};
    data.forEach(e => {
      if (!grouped[e.team]) grouped[e.team] = [];
      grouped[e.team].push(e);
    });

    const teams = Object.keys(grouped).map(team => ({
      team,
      entries: grouped[team]
    }));

    const top = teams.filter(t => selectedTeams.includes(t.team));
    const others = teams.filter(t => !selectedTeams.includes(t.team));

    if (!top.length) return alert("Pick teams");

    const avg = (arr, fn) =>
      arr.reduce((s, e) => s + fn(e), 0) / arr.length;

    const diff = (fn) => {
      const t = avg(top.flatMap(t => t.entries), fn);
      const o = avg(others.flatMap(t => t.entries), fn);
      return Math.max(0.01, t - o);
    };

    let s = { ...settings };

    // MAIN
    s.accuracy = diff(e => Number(e.accuracy || 0));
    s.shootingSpeed = diff(e => Number(e.shootingSpeed || 0));
    s.intakeSpeed = diff(e => Number(e.intakeSpeed || 0));

    s.awareness = diff(e =>
      e.awareness === "Yes" ? 1 :
      e.awareness === "Kind of Lost" ? 0.5 : 0
    );

    s.climb = diff(e =>
      e.climb?.includes("L3") ? 1 :
      e.climb?.includes("L2") ? 0.7 :
      e.climb?.includes("L1") ? 0.4 : 0
    );

    s.robotType = diff(e =>
      e.robotType?.includes("Custom") ? 1 :
      e.robotType?.includes("Kitbot") ? 0 : 0.5
    );

    // AUTON
    const autonMap = {
      autonShoot: "Shoot",
      autonCollectMiddle: "Collect Middle",
      autonCollectDepot: "Collect Depot",
      autonClimb: "Climb"
    };

    Object.entries(autonMap).forEach(([k, v]) => {
      s[k] = diff(e => e.auton?.includes(v) ? 1 : 0);
    });

    // FOCUS
    const focusMap = {
      focusScoring: "Scoring",
      focusPassing: "Passing / Moving Balls",
      focusDefense: "Defense"
    };

    Object.entries(focusMap).forEach(([k, v]) => {
      s[k] = diff(e => e.focus?.includes(v) ? 1 : 0);
    });

    // FAILURES
    const failMap = {
      failureLostComm: "Lost Communication",
      failureLostPower: "Lost Power",
      failureBrokenIntake: "Broken Intake"
    };

    Object.entries(failMap).forEach(([k, v]) => {
      const d = diff(e => e.failures?.includes(v) ? 1 : 0);
      s[k] = 1 / d;
    });

    setSettings(s);

    setTimeout(() => {
      normalizeGroup([
        "accuracy","shootingSpeed","intakeSpeed",
        "auton","climb","awareness","focus","robotType"
      ]);
      normalizeGroup([
        "autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"
      ]);
      normalizeGroup([
        "focusScoring","focusPassing","focusDefense"
      ]);
      normalizeGroup([
        "failureLostComm","failureLostPower","failureBrokenIntake"
      ]);
    }, 50);

    alert("Calibration complete");
  };

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
    alert("Copied");
  };

  const importSettings = () => {
    const data = prompt("Paste JSON");
    try { setSettings(JSON.parse(data)); }
    catch { alert("Invalid"); }
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const total = (fields) =>
    fields.reduce((s, f) => s + settings[f], 0);

  const totalDisplay = (value) => (
    <p style={{
      color: Math.abs(value - 1) > 0.01 ? "red" : "lime"
    }}>
      Total: {(value * 100).toFixed(0)}%
    </p>
  );

  const slider = (label, field, percent = true) => (
    <div>
      <p>{label}: {percent
        ? (settings[field]*100).toFixed(0)+"%"
        : settings[field].toFixed(2)}</p>
      <input
        type="range"
        min="0"
        max={percent ? "1" : "2"}
        step="0.05"
        value={settings[field]}
        onChange={(e)=>handleChange(field,e.target.value)}
        style={{width:"100%"}}
      />
    </div>
  );

  return (
    <div style={{padding:"15px",color:"white"}}>

      <h2>Account Settings</h2>

      {/* CALIBRATION */}
      <div style={box}>
        <h3>Calibration</h3>

        <input value={teamInput}
          onChange={(e)=>setTeamInput(e.target.value)}
          placeholder="frc####" />

        <button onClick={()=>{
          if(teamInput){
            setSelectedTeams([...selectedTeams, teamInput]);
            setTeamInput("");
          }
        }}>Add Team</button>

        <div>{selectedTeams.map(t=><span key={t}>{t} </span>)}</div>

        <button onClick={calibrate}>Run Calibration</button>
      </div>

      {/* PRESETS */}
      <div style={box}>
        <h3>Presets</h3>
        <button onClick={()=>setSettings(presetMap.balanced)}>Balanced</button>
        <button onClick={()=>setSettings(presetMap.offense)}>Offense</button>
        <button onClick={()=>setSettings(presetMap.defense)}>Defense</button>

        <input value={presetName}
          onChange={(e)=>setPresetName(e.target.value)}
          placeholder="Save preset" />
        <button onClick={savePreset}>Save</button>

        {Object.keys(presets).map(p=>(
          <button key={p} onClick={()=>loadPreset(p)}>{p}</button>
        ))}
      </div>

      {/* MAIN */}
      <div style={box}>
        <h3>Main</h3>
        {totalDisplay(total([
          "accuracy","shootingSpeed","intakeSpeed",
          "auton","climb","awareness","focus","robotType"
        ]))}

        {slider("Accuracy","accuracy")}
        {slider("Shooting Speed","shootingSpeed")}
        {slider("Intake Speed","intakeSpeed")}
        {slider("Auton","auton")}
        {slider("Climb","climb")}
        {slider("Awareness","awareness")}
        {slider("Focus","focus")}
        {slider("Robot Type","robotType")}

        <button onClick={()=>normalizeGroup([
          "accuracy","shootingSpeed","intakeSpeed",
          "auton","climb","awareness","focus","robotType"
        ])}>Normalize</button>
      </div>

      {/* AUTON */}
      <div style={box}>
        <h3>Auton</h3>
        {totalDisplay(total([
          "autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"
        ]))}

        {slider("Shoot","autonShoot",false)}
        {slider("Middle","autonCollectMiddle",false)}
        {slider("Depot","autonCollectDepot",false)}
        {slider("Climb","autonClimb",false)}

        <button onClick={()=>normalizeGroup([
          "autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"
        ])}>Normalize</button>
      </div>

      {/* FOCUS */}
      <div style={box}>
        <h3>Focus</h3>
        {totalDisplay(total([
          "focusScoring","focusPassing","focusDefense"
        ]))}

        {slider("Scoring","focusScoring",false)}
        {slider("Passing","focusPassing",false)}
        {slider("Defense","focusDefense",false)}

        <button onClick={()=>normalizeGroup([
          "focusScoring","focusPassing","focusDefense"
        ])}>Normalize</button>
      </div>

      {/* FAILURES */}
      <div style={box}>
        <h3>Failures</h3>
        {totalDisplay(total([
          "failureLostComm","failureLostPower","failureBrokenIntake"
        ]))}

        {slider("Lost Comm","failureLostComm",false)}
        {slider("Lost Power","failureLostPower",false)}
        {slider("Broken Intake","failureBrokenIntake",false)}
        {slider("Penalty Strength","failurePenalty")}

        <button onClick={()=>normalizeGroup([
          "failureLostComm","failureLostPower","failureBrokenIntake"
        ])}>Normalize</button>
      </div>

      {/* IMPORT EXPORT */}
      <div style={box}>
        <button onClick={exportSettings}>Export</button>
        <button onClick={importSettings}>Import</button>
      </div>

      <button onClick={logout} style={{background:"red"}}>
        Logout
      </button>

    </div>
  );
}

const box = {
  background:"#1e1e1e",
  padding:"15px",
  marginBottom:"15px",
  borderRadius:"10px"
};

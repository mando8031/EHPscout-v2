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

  // 🔥 LOCK TO 100%
  const normalizeMain = () => {
    const total =
      settings.accuracy +
      settings.shootingSpeed +
      settings.intakeSpeed +
      settings.auton +
      settings.climb +
      settings.awareness +
      settings.focus +
      settings.robotType;

    if (total === 0) return;

    const normalized = {
      ...settings,
      accuracy: settings.accuracy / total,
      shootingSpeed: settings.shootingSpeed / total,
      intakeSpeed: settings.intakeSpeed / total,
      auton: settings.auton / total,
      climb: settings.climb / total,
      awareness: settings.awareness / total,
      focus: settings.focus / total,
      robotType: settings.robotType / total
    };

    setSettings(normalized);
  };

  // 🔥 PRESETS
  const applyPreset = (type) => {
    const presetMap = {
      balanced: {
        accuracy: 0.2,
        shootingSpeed: 0.15,
        intakeSpeed: 0.15,
        auton: 0.15,
        climb: 0.15,
        awareness: 0.1,
        focus: 0.07,
        robotType: 0.03
      },
      offense: {
        accuracy: 0.3,
        shootingSpeed: 0.25,
        intakeSpeed: 0.15,
        auton: 0.15,
        climb: 0.05,
        awareness: 0.05,
        focus: 0.03,
        robotType: 0.02
      },
      defense: {
        accuracy: 0.1,
        shootingSpeed: 0.1,
        intakeSpeed: 0.2,
        auton: 0.1,
        climb: 0.2,
        awareness: 0.2,
        focus: 0.1,
        robotType: 0.1
      }
    };

    setSettings(prev => ({ ...prev, ...presetMap[type] }));
  };

  // 🔥 SAVE CUSTOM PRESET
  const savePreset = () => {
    if (!presetName) return alert("Enter a preset name");

    const updated = {
      ...presets,
      [presetName]: settings
    };

    setPresets(updated);
    localStorage.setItem("scoringPresets", JSON.stringify(updated));
    setPresetName("");
  };

  const loadPreset = (name) => {
    setSettings(presets[name]);
  };

  // 🔥 EXPORT / IMPORT
  const exportSettings = () => {
    const data = JSON.stringify(settings);
    navigator.clipboard.writeText(data);
    alert("Copied to clipboard!");
  };

  const importSettings = () => {
    const data = prompt("Paste settings JSON:");
    if (!data) return;

    try {
      const parsed = JSON.parse(data);
      setSettings(parsed);
    } catch {
      alert("Invalid JSON");
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

  const mainTotal =
    settings.accuracy +
    settings.shootingSpeed +
    settings.intakeSpeed +
    settings.auton +
    settings.climb +
    settings.awareness +
    settings.focus +
    settings.robotType;

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
          <div key={name}>
            <button onClick={() => loadPreset(name)} style={btnSmall}>
              Load {name}
            </button>
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div style={box}>
        <h3>Main Weights</h3>
        <p style={{
          color: Math.abs(mainTotal - 1) > 0.01 ? "red" : "green"
        }}>
          Total: {(mainTotal * 100).toFixed(0)}%
        </p>

        {slider("Accuracy", "accuracy")}
        {slider("Shooting Speed", "shootingSpeed")}
        {slider("Intake Speed", "intakeSpeed")}
        {slider("Auton", "auton")}
        {slider("Climb", "climb")}
        {slider("Awareness", "awareness")}
        {slider("Focus", "focus")}
        {slider("Robot Type", "robotType")}

        <button onClick={normalizeMain} style={btnSmall}>
          Lock to 100%
        </button>
      </div>

      {/* EXPORT */}
      <div style={box}>
        <h3>Import / Export</h3>
        <button onClick={exportSettings} style={btnSmall}>Export</button>
        <button onClick={importSettings} style={btnSmall}>Import</button>
      </div>

      <button onClick={saveSettings} style={btn}>Save</button>

      <button onClick={logout} style={{ ...btn, background: "#c62828" }}>
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

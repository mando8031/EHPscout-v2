import React, { useState, useEffect } from "react";
import { PageHeader, Card } from "./EventSelect";

export default function AccountSettings() {
  const defaultSettings = {
    accuracy: 0.1818, shootingSpeed: 0.1818, intakeSpeed: 0.1818,
    auton: 0.1, climb: 0.05, awareness: 0.1, focus: 0.1, robotType: 0.1, failurePenalty: 0.1,
    autonShoot: 0.25, autonCollectMiddle: 0.25, autonCollectDepot: 0.25, autonClimb: 0.25,
    focusScoring: 0.3333, focusPassing: 0.3333, focusDefense: 0.3333,
    failureLostComm: 0.3333, failureLostPower: 0.3333, failureBrokenIntake: 0.3333
  };

  const [settings,    setSettings]    = useState(defaultSettings);
  const [presetName,  setPresetName]  = useState("");
  const [presets,     setPresets]     = useState({});
  const [teamsInput,  setTeamsInput]  = useState("");
  const [activeTab,   setActiveTab]   = useState("presets");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scoringSettings"));
    const savedPresets = JSON.parse(localStorage.getItem("scoringPresets")) || {};
    if (saved) setSettings({ ...defaultSettings, ...saved });
    setPresets(savedPresets);
  }, []);

  useEffect(() => {
    localStorage.setItem("scoringSettings", JSON.stringify(settings));
  }, [settings]);

  const handleChange = (field, value) => setSettings(p => ({ ...p, [field]: Number(value) }));

  const normalizeGroup = (fields, obj = settings) => {
    const t = fields.reduce((s, f) => s + obj[f], 0);
    if (t === 0) return obj;
    const u = { ...obj };
    fields.forEach(f => { u[f] = obj[f] / t; });
    return u;
  };

  const total = (fields) => fields.reduce((s, f) => s + settings[f], 0);

  const TotalBadge = ({ fields }) => {
    const v = total(fields);
    const ok = Math.abs(v - 1) <= 0.01;
    return (
      <span style={{
        fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6,
        background: ok ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
        color: ok ? "#22c55e" : "#ef4444"
      }}>
        {(v * 100).toFixed(0)}%
      </span>
    );
  };

  const Slider = ({ label, field }) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
        <span style={{ fontSize: 18, fontWeight: 700, color: "var(--blue)", lineHeight: 1 }}>
          {(settings[field] * 100).toFixed(0)}%
        </span>
      </div>
      <input type="range" min="0" max="1" step="0.01" value={settings[field]}
        onChange={e => handleChange(field, e.target.value)} />
    </div>
  );

  const NormBtn = ({ fields }) => (
    <button
      onClick={() => setSettings(normalizeGroup(fields))}
      style={{
        marginTop: 8, padding: "9px 16px", fontSize: 12, fontWeight: 500,
        background: "var(--bg-elevated)", border: "1px solid var(--border)",
        color: "var(--text-secondary)", borderRadius: 8
      }}
    >
      Normalize to 100%
    </button>
  );

  const applyPreset = (type) => {
    const map = {
      balanced: { accuracy:0.1818,shootingSpeed:0.1818,intakeSpeed:0.1818,auton:0.1,climb:0.05,awareness:0.1,focus:0.1,robotType:0.1,failurePenalty:0.1,autonShoot:0.25,autonCollectMiddle:0.25,autonCollectDepot:0.25,autonClimb:0.25,focusScoring:0.3333,focusPassing:0.3333,focusDefense:0.3333,failureLostComm:0.3333,failureLostPower:0.3333,failureBrokenIntake:0.3333 },
      offense:  { accuracy:0.15,shootingSpeed:0.2,intakeSpeed:0.2,auton:0.1,climb:0.05,awareness:0.1,focus:0.1,robotType:0.1,failurePenalty:0.1,autonShoot:0.4,autonCollectMiddle:0.2,autonCollectDepot:0.2,autonClimb:0.2,focusScoring:0.7143,focusPassing:0.1429,focusDefense:0.1429,failureLostComm:0.5,failureLostPower:0.25,failureBrokenIntake:0.25 },
      defense:  { accuracy:0.1,shootingSpeed:0.1,intakeSpeed:0.1,auton:0.05,climb:0.2,awareness:0.2,focus:0.2,robotType:0.05,failurePenalty:0.2,autonShoot:0.15,autonCollectMiddle:0.15,autonCollectDepot:0.15,autonClimb:0.55,focusScoring:0.1,focusPassing:0.2,focusDefense:0.7,failureLostComm:0.5,failureLostPower:0.4,failureBrokenIntake:0.1 }
    };
    setSettings(map[type]);
  };

  const savePreset = () => {
    if (!presetName) return;
    const u = { ...presets, [presetName]: settings };
    setPresets(u);
    localStorage.setItem("scoringPresets", JSON.stringify(u));
    setPresetName("");
  };

  const exportSettings = () => { navigator.clipboard.writeText(JSON.stringify(settings)); alert("Copied!"); };
  const importSettings = () => {
    const d = prompt("Paste JSON settings");
    if (!d) return;
    try { setSettings(JSON.parse(d)); } catch { alert("Invalid JSON"); }
  };

  const runCalibration = () => {
    const input = teamsInput.split(",").map(t => t.trim()).filter(Boolean);
    if (!input.length) return alert("Enter teams");
    const teams = input.map(t => t.startsWith("frc") ? t : `frc${t}`);
    const data  = JSON.parse(localStorage.getItem("scoutingData") || "[]");
    const event = localStorage.getItem("selectedEvent");
    const filtered = data.filter(d => d.event === event && teams.includes(d.team));
    if (!filtered.length) return alert("No data for those teams");

    const avg = { accuracy:0,shootingSpeed:0,intakeSpeed:0,awareness:0,climb:0,robotType:0, auton:{shoot:0,middle:0,depot:0,climb:0}, focus:{scoring:0,passing:0,defense:0}, failures:{comm:0,power:0,intake:0} };
    filtered.forEach(e => {
      avg.accuracy      += Number(e.accuracy || 0);
      avg.shootingSpeed += Number(e.shootingSpeed || 0);
      avg.intakeSpeed   += Number(e.intakeSpeed || 0);
      if (e.awareness === "Yes")          avg.awareness += 1;
      else if (e.awareness === "Kind of Lost") avg.awareness += 0.5;
      if (e.climb?.includes("L3"))       avg.climb += 1;
      else if (e.climb?.includes("L2")) avg.climb += 0.7;
      else if (e.climb?.includes("L1")) avg.climb += 0.4;
      if (e.robotType?.includes("Custom")) avg.robotType += 1;
      if (e.auton?.includes("Shoot"))          avg.auton.shoot  += 1;
      if (e.auton?.includes("Collect Middle")) avg.auton.middle += 1;
      if (e.auton?.includes("Collect Depot"))  avg.auton.depot  += 1;
      if (e.auton?.includes("Climb"))          avg.auton.climb  += 1;
      if (e.focus?.includes("Scoring"))              avg.focus.scoring += 1;
      if (e.focus?.includes("Passing / Moving Balls")) avg.focus.passing += 1;
      if (e.focus?.includes("Defense"))              avg.focus.defense += 1;
      if (e.failures?.includes("Lost Communication")) avg.failures.comm   += 1;
      if (e.failures?.includes("Lost Power"))         avg.failures.power  += 1;
      if (e.failures?.includes("Broken Intake"))      avg.failures.intake += 1;
    });
    const n = filtered.length;
    const s = v => v / n;
    avg.accuracy = s(avg.accuracy); avg.shootingSpeed = s(avg.shootingSpeed); avg.intakeSpeed = s(avg.intakeSpeed);
    avg.awareness = s(avg.awareness); avg.climb = s(avg.climb); avg.robotType = s(avg.robotType);
    Object.keys(avg.auton).forEach(k    => avg.auton[k]    = s(avg.auton[k]));
    Object.keys(avg.focus).forEach(k    => avg.focus[k]    = s(avg.focus[k]));
    Object.keys(avg.failures).forEach(k => avg.failures[k] = s(avg.failures[k]));
    let u = {
      accuracy: (avg.accuracy - 1)/4 + 0.01, shootingSpeed: (avg.shootingSpeed - 1)/4 + 0.01, intakeSpeed: (avg.intakeSpeed - 1)/4 + 0.01,
      awareness: avg.awareness + 0.01, climb: avg.climb + 0.01, auton: (avg.auton.shoot + avg.auton.middle + avg.auton.depot + avg.auton.climb)/4 + 0.01,
      focus: (avg.focus.scoring + avg.focus.passing + avg.focus.defense)/3 + 0.01, robotType: avg.robotType + 0.01,
      autonShoot: avg.auton.shoot + 0.01, autonCollectMiddle: avg.auton.middle + 0.01, autonCollectDepot: avg.auton.depot + 0.01, autonClimb: avg.auton.climb + 0.01,
      focusScoring: avg.focus.scoring + 0.01, focusPassing: avg.focus.passing + 0.01, focusDefense: avg.focus.defense + 0.01,
      failureLostComm: (1 - avg.failures.comm) + 0.01, failureLostPower: (1 - avg.failures.power) + 0.01, failureBrokenIntake: (1 - avg.failures.intake) + 0.01,
      failurePenalty: settings.failurePenalty
    };
    const norm = (fields) => { const t = fields.reduce((s, f) => s + u[f], 0); if (t > 0) fields.forEach(f => u[f] /= t); };
    norm(["accuracy","shootingSpeed","intakeSpeed","auton","climb","awareness","focus","robotType"]);
    norm(["autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"]);
    norm(["focusScoring","focusPassing","focusDefense"]);
    norm(["failureLostComm","failureLostPower","failureBrokenIntake"]);
    setSettings(u);
  };

  const logout = () => { localStorage.removeItem("user"); window.location.href = "/"; };

  const TABS = [
    { id: "presets", label: "Presets" },
    { id: "main",    label: "Main" },
    { id: "auton",   label: "Auton" },
    { id: "focus",   label: "Focus" },
    { id: "fails",   label: "Fails" }
  ];

  const chipBtn = (label, active, onClick) => (
    <button key={label} onClick={onClick} style={{
      padding: "9px 14px", margin: 3, borderRadius: 9, fontSize: 13, fontWeight: active ? 600 : 400,
      background: active ? "var(--blue)" : "var(--bg-elevated)",
      border: `1px solid ${active ? "var(--blue)" : "var(--border)"}`,
      color: active ? "white" : "var(--text-secondary)"
    }}>
      {label}
    </button>
  );

  return (
    <div style={{ padding: "0 14px 16px", maxWidth: 600, margin: "0 auto" }}>
      <PageHeader title="Settings" subtitle="Scoring weights & account"
        iconBg="var(--bg-elevated)"
        icon={
          <svg width="20" height="20" fill="none" stroke="var(--text-secondary)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
      />

      {/* Auto-Calibrate */}
      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <svg width="16" height="16" fill="none" stroke="var(--blue)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 style={{ fontSize: 14 }}>Auto-Calibrate</h3>
        </div>
        <p style={{ fontSize: 13, marginBottom: 10 }}>Enter team numbers to auto-tune weights from their data.</p>
        <input placeholder="1234, 254, 1678" value={teamsInput} onChange={e => setTeamsInput(e.target.value)} style={{ marginBottom: 10 }} />
        <button onClick={runCalibration} style={{ width: "100%", padding: 12, fontWeight: 600 }}>Calibrate</button>
      </Card>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto", paddingBottom: 2 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flexShrink: 0, padding: "9px 16px", borderRadius: 9, fontSize: 13, fontWeight: activeTab === t.id ? 600 : 400,
            background: activeTab === t.id ? "var(--blue)" : "var(--bg-card)",
            border: `1px solid ${activeTab === t.id ? "var(--blue)" : "var(--border)"}`,
            color: activeTab === t.id ? "white" : "var(--text-secondary)"
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "presets" && (
        <Card>
          <h3 style={{ fontSize: 14, marginBottom: 12 }}>Quick Presets</h3>
          <div style={{ display: "flex", flexWrap: "wrap", margin: -3, marginBottom: 16 }}>
            {["balanced","offense","defense"].map(p => chipBtn(p.charAt(0).toUpperCase() + p.slice(1), false, () => applyPreset(p)))}
          </div>
          <div style={{ height: 1, background: "var(--border)", margin: "16px 0" }} />
          <h3 style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10, fontWeight: 500 }}>Custom Presets</h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input value={presetName} onChange={e => setPresetName(e.target.value)} placeholder="Preset name" style={{ flex: 1 }} />
            <button onClick={savePreset} style={{ padding: "0 16px", flexShrink: 0 }}>Save</button>
          </div>
          {Object.keys(presets).length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", margin: -3 }}>
              {Object.keys(presets).map(p => chipBtn(p, false, () => setSettings(presets[p])))}
            </div>
          )}
          <div style={{ height: 1, background: "var(--border)", margin: "16px 0" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={exportSettings} style={{ flex: 1, background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-secondary)", borderRadius: 9, padding: "10px 0", fontSize: 13 }}>Export</button>
            <button onClick={importSettings} style={{ flex: 1, background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-secondary)", borderRadius: 9, padding: "10px 0", fontSize: 13 }}>Import</button>
          </div>
        </Card>
      )}

      {activeTab === "main" && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 14 }}>Main Weights</h3>
            <TotalBadge fields={["accuracy","shootingSpeed","intakeSpeed","auton","climb","awareness","focus","robotType"]} />
          </div>
          {["accuracy","shootingSpeed","intakeSpeed","auton","climb","awareness","focus","robotType"].map(f =>
            <Slider key={f} label={f.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())} field={f} />
          )}
          <NormBtn fields={["accuracy","shootingSpeed","intakeSpeed","auton","climb","awareness","focus","robotType"]} />
        </Card>
      )}

      {activeTab === "auton" && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 14 }}>Auton Weights</h3>
            <TotalBadge fields={["autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"]} />
          </div>
          <Slider label="Shoot"          field="autonShoot" />
          <Slider label="Collect Middle" field="autonCollectMiddle" />
          <Slider label="Collect Depot"  field="autonCollectDepot" />
          <Slider label="Climb"          field="autonClimb" />
          <NormBtn fields={["autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"]} />
        </Card>
      )}

      {activeTab === "focus" && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 14 }}>Focus Weights</h3>
            <TotalBadge fields={["focusScoring","focusPassing","focusDefense"]} />
          </div>
          <Slider label="Scoring" field="focusScoring" />
          <Slider label="Passing" field="focusPassing" />
          <Slider label="Defense" field="focusDefense" />
          <NormBtn fields={["focusScoring","focusPassing","focusDefense"]} />
        </Card>
      )}

      {activeTab === "fails" && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 14 }}>Failure Penalties</h3>
            <TotalBadge fields={["failureLostComm","failureLostPower","failureBrokenIntake"]} />
          </div>
          <Slider label="Lost Communication" field="failureLostComm" />
          <Slider label="Lost Power"         field="failureLostPower" />
          <Slider label="Broken Intake"      field="failureBrokenIntake" />
          <Slider label="Overall Penalty"    field="failurePenalty" />
          <NormBtn fields={["failureLostComm","failureLostPower","failureBrokenIntake"]} />
        </Card>
      )}

      {/* Logout */}
      <button
        onClick={logout}
        style={{
          width: "100%", padding: 14, marginTop: 14,
          background: "transparent", border: "1px solid var(--red-border)",
          color: "var(--red)", borderRadius: 12, fontWeight: 600, fontSize: 14
        }}
      >
        Log Out
      </button>
    </div>
  );
}

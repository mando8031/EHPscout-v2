import React, { useEffect, useState } from "react";
import { getMatches } from "../services/tbaService";

export default function ScoutForm() {

  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [formKey, setFormKey] = useState(0);
  const [form, setForm] = useState({
    robotType: [],
    focus: [],
    focusOther: "",
    failures: [],
    failuresOther: "",
    accuracy: 3,
    shootingSpeed: 3,
    intakeSpeed: 3,
    auton: [],
    autonOther: "",
    climb: [],
    awareness: "",
    notes: ""
  });

  const eventKey = localStorage.getItem("selectedEvent");

useEffect(() => {
    async function loadMatches() {
      if (!eventKey) return;

      const data = await getMatches(eventKey);

      if (Array.isArray(data)) {
        const filtered = data
          .filter(m => m.comp_level === "qm")
          .sort((a, b) => a.match_number - b.match_number);

        setMatches(filtered);
      }
}

    loadMatches();
  }, [eventKey]);

  useEffect(() => {
    if (!selectedMatch) return;

    const match = matches.find(m => m.key === selectedMatch);
    if (!match) return;

    const allTeams = [
      ...match.alliances.red.team_keys,
      ...match.alliances.blue.team_keys
    ];

    setTeams(allTeams);
  }, [selectedMatch, matches]);

  const toggleMulti = (field, value) => {
    setForm(prev => {
      const exists = prev[field].includes(value);
      return {
        ...prev,
        [field]: exists
          ? prev[field].filter(v => v !== value)
          : [...prev[field], value]
      };
});
  };

  const handleSubmit = () => {

    const eventKey = localStorage.getItem("selectedEvent");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const entry = {
      id: `${Date.now()}`,
      event: eventKey,
      match: selectedMatch,
      team: selectedTeam,
      scout: user.username,
      ...form
    };

    const existing = JSON.parse(localStorage.getItem("scoutingData") || "[]");
    localStorage.setItem("scoutingData", JSON.stringify([...existing, entry]));

    // 🔥 FIND NEXT MATCH
    const currentIndex = matches.findIndex(m => m.key === selectedMatch);
    const nextMatch = matches[currentIndex + 1];

    // ✅ SET NEXT MATCH (or reset if none)
    if (nextMatch) {
      setSelectedMatch(nextMatch.key);
    } else {
      setSelectedMatch("");
    }

    // reset team (new match = new teams)
    setSelectedTeam("");

    // RESET FORM
    setForm({
      robotType: [],
      focus: [],
      focusOther: "",
      failures: [],
      failuresOther: "",
      accuracy: 3,
      shootingSpeed: 3,
      intakeSpeed: 3,
      auton: [],
      autonOther: "",
      climb: [],
      awareness: "",
      notes: ""
    });

    // 🔥 SCROLL TO TOP
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const sectionStyle = {
    marginBottom: "20px",
    padding: "15px",
    background: "#1e1e1e",
    borderRadius: "12px"
  };

  const buttonStyle = (active) => ({
    padding: "10px 12px",
    margin: "5px",
    borderRadius: "10px",
    border: "none",
    background: active ? "#4caf50" : "#333",
    color: "white",
    fontSize: "14px"
  });

return (
  <div key={formKey} style={{ padding: "10px", color: "white" }}>
      <h2>Scout Match</h2>

      {/* MATCH */}
      <div style={sectionStyle}>
        <h3>Match</h3>
        <select style={{ width: "100%", padding: "12px" }}
          onChange={(e) => setSelectedMatch(e.target.value)}>
          <option value="">Select Match</option>
          {matches.map(m => (
            <option key={m.key} value={m.key}>
              Match {m.match_number}
            </option>
          ))}
        </select>
      </div>

      {/* TEAM */}
      <div style={sectionStyle}>
        <h3>Team</h3>
        <select style={{ width: "100%", padding: "12px" }}
          onChange={(e) => setSelectedTeam(e.target.value)}>
          <option value="">Select Team</option>
          {teams.map(t => (
            <option key={t} value={t}>{t.replace("frc", "")}</option>
))}
        </select>
      </div>

      {/* AUTON */}
      <div style={sectionStyle}>
        <h3>Auton</h3>
        {["No Auton / Not Working", "Shoot", "Collect Middle", "Collect Depot", "Climb", "Other"].map(opt => (
          <button key={opt}
            style={buttonStyle(form.auton.includes(opt))}
            onClick={() => toggleMulti("auton", opt)}>
            {opt}
          </button>
        ))}
        {form.auton.includes("Other") && (
          <input placeholder="Other..." onChange={(e)=>setForm({...form, autonOther:e.target.value})}/>
        )}
      </div>

      {/* ROBOT TYPE */}
      <div style={sectionStyle}>
        <h3>Robot Type</h3>
        {["Kitbot", "Custom", "Not Sure"].map(opt => (
          <button key={opt}
            style={buttonStyle(form.robotType.includes(opt))}
            onClick={() => toggleMulti("robotType", opt)}>
            {opt}
          </button>
        ))}
      </div>

      {/* FOCUS */}
      <div style={sectionStyle}>
        <h3>Main Focus</h3>
        {["Scoring", "Passing / Moving Balls", "Defense", "Other"].map(opt => (
          <button key={opt}
            style={buttonStyle(form.focus.includes(opt))}
            onClick={() => toggleMulti("focus", opt)}>
            {opt}
          </button>
        ))}
        {form.focus.includes("Other") && (
          <input placeholder="Other..." onChange={(e)=>setForm({...form, focusOther:e.target.value})}/>
        )}
      </div>

      {/* SLIDERS */}
      <div style={sectionStyle}>
        <h3>Accuracy: {form.accuracy}</h3>
        <input type="range" min="1" max="5"
          value={form.accuracy}
          onChange={(e)=>setForm({...form, accuracy:e.target.value})}/>
      </div>

      <div style={sectionStyle}>
        <h3>Shooting Speed: {form.shootingSpeed}</h3>
        <input type="range" min="1" max="5"
          value={form.shootingSpeed}
          onChange={(e)=>setForm({...form, shootingSpeed:e.target.value})}/>
      </div>

      <div style={sectionStyle}>
        <h3>Intake Speed: {form.intakeSpeed}</h3>
        <input type="range" min="1" max="5"
          value={form.intakeSpeed}
          onChange={(e)=>setForm({...form, intakeSpeed:e.target.value})}/>
      </div>

      {/* CLIMB */}
      <div style={sectionStyle}>
        <h3>Climb</h3>
        {["No", "L1", "L2", "L3", "Tried and Failed"].map(opt => (
          <button key={opt}
            style={buttonStyle(form.climb.includes(opt))}
            onClick={() => toggleMulti("climb", opt)}>
            {opt}
          </button>
        ))}
      </div>

      {/* FAILURES */}
      <div style={sectionStyle}>
        <h3>Failures</h3>
        {["Lost Communication", "Lost Power", "Broken Intake", "Other"].map(opt => (
          <button key={opt}
            style={buttonStyle(form.failures.includes(opt))}
            onClick={() => toggleMulti("failures", opt)}>
            {opt}
          </button>
        ))}
        {form.failures.includes("Other") && (
          <input placeholder="Other..." onChange={(e)=>setForm({...form, failuresOther:e.target.value})}/>
        )}
      </div>

      {/* AWARENESS */}
      <div style={sectionStyle}>
        <h3>Did they look like they knew what they were doing?</h3>
        {["Yes", "No", "Kind of Lost"].map(opt => (
          <button key={opt}
            style={buttonStyle(form.awareness === opt)}
            onClick={() => setForm({...form, awareness: opt})}>
            {opt}
          </button>
        ))}
      </div>

      {/* NOTES */}
      <div style={sectionStyle}>
        <h3>Additional Info</h3>
        <textarea
          style={{ width: "100%", height: "100px" }}
          onChange={(e)=>setForm({...form, notes:e.target.value})}
        />
      </div>

      {/* SAVE */}
      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "20px",
          background: "#2d8cf0",
          border: "none",
          borderRadius: "12px",
          fontSize: "18px"
        }}
      >
        Save
      </button>
</div>
);
}

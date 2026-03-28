import React, { useEffect, useState } from "react";
import { getEvents } from "../services/tbaService";

export default function EventSelect() {

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedEvent, setSelectedEvent] = useState(
    localStorage.getItem("selectedEvent")
  );
  const [selectedEventName, setSelectedEventName] = useState(
    localStorage.getItem("selectedEventName")
  );

  useEffect(() => {
    async function loadEvents() {
      const data = await getEvents(new Date().getFullYear());
      if (Array.isArray(data)) {
        setEvents(data);
      }
    }
    loadEvents();
  }, []);

  // 🔥 DISTRICT MAP
  const districtMap = {
    fim: "Michigan District",
    fin: "Indiana District",
    fit: "Texas District",
    fma: "Mid-Atlantic District",
    fne: "New England District",
    fnc: "North Carolina District",
    pnw: "Pacific Northwest District",
    ont: "Ontario District",
    isr: "Israel District"
  };

  // 🔥 FIXED FUNCTION (SAFE)
  const getDistrictName = (event) => {
    if (event.district_key) {
      const key = event.district_key.replace(/^\d+/, "");
      return districtMap[key] || "Other District";
    }
    return "Regional Events";
  };

  // 🔍 FILTER
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🧠 GROUP
  const grouped = {};
  filteredEvents.forEach(event => {
    const district = getDistrictName(event);
    if (!grouped[district]) grouped[district] = [];
    grouped[district].push(event);
  });

  // 🧠 SORT
  const sortedDistricts = Object.keys(grouped).sort((a, b) => {
    if (a === "Michigan District") return -1;
    if (b === "Michigan District") return 1;

    if (a === "Regional Events") return 1;
    if (b === "Regional Events") return -1;

    return a.localeCompare(b);
  });

  // 📅 DATE
  const formatDate = (event) => {
    if (!event.start_date) return "";
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  // 🟢 STATUS
  const getStatus = (event) => {
    const now = new Date();
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);

    if (now < start) return "upcoming";
    if (now > end) return "past";
    return "active";
  };

  const getStatusColor = (status) => {
    if (status === "active") return "#00e676";
    if (status === "upcoming") return "#ffd600";
    return "#9e9e9e";
  };

  // 🟢 SELECT
  const handleSelect = (event) => {
    localStorage.setItem("selectedEvent", event.key);
    localStorage.setItem("selectedEventName", event.name);

    setSelectedEvent(event.key);
    setSelectedEventName(event.name);
  };

  return (
    <div style={{ padding: "15px", color: "#111" }}>
      <h1>Select Event</h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "10px",
          border: "none"
        }}
      />

      {/* SELECTED */}
      {selectedEventName && (
        <div style={{
          background: "#e0e0e0",
          padding: "10px",
          borderRadius: "10px",
          marginBottom: "15px"
        }}>
          <b>Selected Event:</b> {selectedEventName}
        </div>
      )}

      {filteredEvents.length === 0 && <p>No events found</p>}

      {/* GROUPS */}
      {sortedDistricts.map(district => (
        <div key={district} style={{ marginBottom: "25px" }}>

          <h2 style={{
            borderBottom: "2px solid #444",
            paddingBottom: "5px",
            color: "#111"
          }}>
            {district}
          </h2>

          {grouped[district].map(event => {
            const isSelected = selectedEvent === event.key;
            const status = getStatus(event);

            return (
              <button
                key={event.key}
                onClick={() => handleSelect(event)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "15px",
                  marginTop: "8px",
                  borderRadius: "10px",
                  border: "none",
                  textAlign: "left",
                  background: isSelected ? "#00c853" : "#1e1e1e",
                  color: isSelected ? "black" : "white"
                }}
              >
                <span style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: getStatusColor(status),
                  display: "inline-block",
                  marginRight: "8px"
                }} />

                <b>{event.name}</b>

                <div style={{ fontSize: "12px", opacity: 0.8 }}>
                  {formatDate(event)}
                </div>

              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

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

  // 🔍 FILTER EVENTS
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🧠 GROUP EVENTS BY DISTRICT
  const grouped = {};

  filteredEvents.forEach(event => {
    const district = event.district?.display_name || "Regional / Other";

    if (!grouped[district]) grouped[district] = [];
    grouped[district].push(event);
  });

  // 🧠 SORT DISTRICTS (Michigan first)
  const sortedDistricts = Object.keys(grouped).sort((a, b) => {
    if (a.toLowerCase().includes("michigan")) return -1;
    if (b.toLowerCase().includes("michigan")) return 1;
    return a.localeCompare(b);
  });

  // 🟢 SELECT EVENT
  const handleSelect = (event) => {
    localStorage.setItem("selectedEvent", event.key);
    localStorage.setItem("selectedEventName", event.name);

    setSelectedEvent(event.key);
    setSelectedEventName(event.name);
  };

  return (
    <div style={{ padding: "15px", color: "white" }}>
      <h1>Select Event</h1>

      {/* 🔍 SEARCH BAR */}
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

      {/* ✅ SELECTED EVENT DISPLAY */}
      {selectedEventName && (
        <div style={{
          background: "#1e1e1e",
          padding: "10px",
          borderRadius: "10px",
          marginBottom: "15px"
        }}>
          <b>Selected Event:</b> {selectedEventName}
        </div>
      )}

      {/* 📭 NO RESULTS */}
      {filteredEvents.length === 0 && (
        <p>No events found</p>
      )}

      {/* 📦 DISTRICT GROUPS */}
      {sortedDistricts.map(district => (
        <div key={district} style={{ marginBottom: "20px" }}>

          {/* 🧱 DISTRICT HEADER */}
          <h2 style={{
            borderBottom: "2px solid #444",
            paddingBottom: "5px"
          }}>
            {district}
          </h2>

          {grouped[district].map(event => {
            const isSelected = selectedEvent === event.key;

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

                  background: isSelected ? "#00c853" : "#1e1e1e",
                  color: isSelected ? "black" : "white",
                  fontWeight: isSelected ? "bold" : "normal"
                }}
              >
                {event.name}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

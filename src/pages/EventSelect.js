import React, { useEffect, useState } from "react";
import { getEvents } from "../services/tbaService";

export default function EventSelect() {

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(
    localStorage.getItem("selectedEvent")
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

  // 🧠 GROUP + SORT EVENTS
  const grouped = {};

  events.forEach(event => {
    const district = event.district?.display_name || "Other";

    if (!grouped[district]) grouped[district] = [];
    grouped[district].push(event);
  });

  // sort districts (Michigan first)
  const sortedDistricts = Object.keys(grouped).sort((a, b) => {
    if (a.toLowerCase().includes("michigan")) return -1;
    if (b.toLowerCase().includes("michigan")) return 1;
    return a.localeCompare(b);
  });

  // 🟢 SELECT EVENT
  const handleSelect = (eventKey) => {
    localStorage.setItem("selectedEvent", eventKey);
    setSelectedEvent(eventKey); // ✅ highlight without redirect
  };

  return (
    <div style={{ padding: "15px", color: "white" }}>
      <h1>Select Event</h1>

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
                onClick={() => handleSelect(event.key)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "15px",
                  marginTop: "8px",
                  borderRadius: "10px",
                  border: "none",

                  // 🎯 HIGHLIGHT SELECTED
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

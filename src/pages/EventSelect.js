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

  // 🔍 FILTER
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🧠 CLEAN DISTRICT NAME
  const getDistrictName = (event) => {
    if (event.district?.display_name) return event.district.display_name;
    if (event.district_key) return event.district_key.toUpperCase();
    return "Regional Events";
  };

  // 🧠 GROUP
  const grouped = {};

  filteredEvents.forEach(event => {
    const district = getDistrictName(event);

    if (!grouped[district]) grouped[district] = [];
    grouped[district].push(event);
  });

  // 🧠 SORT DISTRICTS (Michigan first)
  const sortedDistricts = Object.keys(grouped).sort((a, b) => {
    if (a.toLowerCase().includes("michigan")) return -1;
    if (b.toLowerCase().includes("michigan")) return 1;
    return a.localeCompare(b);
  });

  // 📅 FORMAT DATE
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
    if (status === "active") return "#00e676";   // green
    if (status === "upcoming") return "#ffd600"; // yellow
    return "#9e9e9e"; // grey
  };

  // 🟢 SELECT
  const handleSelect = (event) => {
    localStorage.setItem("selectedEvent", event.key);
    localStorage.setItem("selectedEventName", event.name);

    setSelectedEvent(event.key);
    setSelectedEventName(event.name);
  };

  return (
    <div style={{ padding: "15px", color: "white" }}>
      <h1>Select Event</h1>

      {/* 🔍 SEARCH */}
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

      {/* 📌 SELECTED */}
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

      {filteredEvents.length === 0 && <p>No events found</p>}

      {/* 📦 GROUPED */}
      {sortedDistricts.map(district => (
        <div key={district} style={{ marginBottom: "25px" }}>

          {/* 🧱 HEADER */}
          <h2 style={{
            borderBottom: "2px solid #444",
            paddingBottom: "5px"
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

                {/* 🟢 STATUS DOT */}
                <div style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: getStatusColor(status),
                  display: "inline-block",
                  marginRight: "8px"
                }} />

                <b>{event.name}</b>

                {/* 📅 DATE */}
                <div style={{
                  fontSize: "12px",
                  opacity: 0.8,
                  marginTop: "5px"
                }}>
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

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../services/tbaService";

export default function EventSelect() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      const data = await getEvents(new Date().getFullYear());
      if (Array.isArray(data)) {
        setEvents(data);
      }
    }
    loadEvents();
  }, []);

  const handleSelect = (eventKey) => {
    // ✅ CRITICAL FIX
    localStorage.setItem("selectedEvent", eventKey);

    navigate("/scout");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Select Event</h1>

      {events.map(event => (
        <button
          key={event.key}
          onClick={() => handleSelect(event.key)}
          style={{
            display: "block",
            width: "100%",
            padding: "15px",
            marginBottom: "10px"
          }}
        >
          {event.name}
        </button>
      ))}
    </div>
  );
}

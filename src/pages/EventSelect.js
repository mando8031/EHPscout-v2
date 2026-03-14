import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../services/tbaService";

const EventSelect = () => {

  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    async function load() {
      try {
        const data = await getEvents(new Date().getFullYear());

        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error("TBA returned non-array:", data);
          setEvents([]);
        }

      } catch (err) {
        console.error("Failed to load events:", err);
        setEvents([]);
      }
    }

    load();

  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Select Event</h1>

      {events.length === 0 && (
        <p>No events loaded (check TBA API key)</p>
      )}

      {events.map(event => (
        <div
          key={event.key}
          style={{
            padding: "10px",
            margin: "5px",
            background: "#333",
            cursor: "pointer"
          }}
          onClick={() => navigate(`/matches/${event.key}`)}
        >
          {event.name}
        </div>
      ))}
    </div>
  );

};

export default EventSelect;

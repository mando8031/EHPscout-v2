import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../services/tbaService";

const EventSelect = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const data = await getEvents(new Date().getFullYear());

      if (Array.isArray(data)) {
        // sort by start date
        const sorted = data.sort(
          (a, b) => new Date(a.start_date) - new Date(b.start_date)
        );

        setEvents(sorted);
      }
    }

    load();
  }, []);

  const today = new Date();

  function getStatus(event) {
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);

    if (today < start) return "upcoming";
    if (today > end) return "finished";
    return "active";
  }

  const filteredEvents = events
    .filter((event) =>
      event.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((event) => {
      if (filter === "all") return true;
      return getStatus(event) === filter;
    });

  return (
    <div style={{ padding: "30px", maxWidth: "900px" }}>
      <h1>Event Select</h1>

      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          marginBottom: "15px",
        }}
      />

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("upcoming")}>Upcoming</button>
        <button onClick={() => setFilter("finished")}>Finished</button>
      </div>

      {filteredEvents.map((event) => {
        const status = getStatus(event);

        return (
          <div
            key={event.key}
            style={{
              padding: "12px",
              marginBottom: "8px",
              background: "#2c2c2c",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/matches/${event.key}`)}
          >
            <div style={{ fontWeight: "bold" }}>{event.name}</div>

            <div>
              {event.start_date} → {event.end_date}
            </div>

            <div>Status: {status}</div>
          </div>
        );
      })}
    </div>
  );
};

export default EventSelect;

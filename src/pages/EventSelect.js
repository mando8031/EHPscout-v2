import React, { useEffect, useState } from "react";
import { getEvents } from "../services/tbaService";

export default function EventSelect() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState(
    localStorage.getItem("selectedEvent")
  );
  const [selectedEventName, setSelectedEventName] = useState(
    localStorage.getItem("selectedEventName")
  );

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      const data = await getEvents(new Date().getFullYear());
      if (Array.isArray(data)) {
        setEvents(data);
      }
      setLoading(false);
    }
    loadEvents();
  }, []);

  const getStatus = (event) => {
    const now = new Date();
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);
    if (now < start) return "upcoming";
    if (now > end) return "past";
    return "active";
  };

  const getStatusStyle = (status) => {
    if (status === "active") return { bg: "#22c55e", text: "Live" };
    if (status === "upcoming") return { bg: "#3b82f6", text: "Upcoming" };
    return { bg: "#6b6b78", text: "Past" };
  };

  const getDistrictName = (event) => {
    if (!event.key) return "Regional Events";
    const key = event.key.toLowerCase();
    if (key.includes("mi")) return "Michigan District";
    if (key.includes("on")) return "Ontario District";
    if (key.includes("in")) return "Indiana District";
    if (key.includes("tx")) return "Texas District";
    if (key.includes("ne")) return "New England District";
    if (key.includes("nc")) return "North Carolina District";
    if (key.includes("pnw")) return "Pacific Northwest District";
    return "Regional Events";
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(search.toLowerCase());
    const matchesActive = showActiveOnly ? getStatus(event) === "active" : true;
    return matchesSearch && matchesActive;
  });

  const grouped = {};
  filteredEvents.forEach(event => {
    const district = getDistrictName(event);
    if (!grouped[district]) grouped[district] = [];
    grouped[district].push(event);
  });

  const sortedDistricts = Object.keys(grouped).sort((a, b) => {
    if (a === "Michigan District") return -1;
    if (b === "Michigan District") return 1;
    if (a === "Regional Events") return 1;
    if (b === "Regional Events") return -1;
    return a.localeCompare(b);
  });

  const formatDate = (event) => {
    if (!event.start_date) return "";
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);
    const options = { month: "short", day: "numeric" };
    return `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`;
  };

  const handleSelect = (event) => {
    localStorage.setItem("selectedEvent", event.key);
    localStorage.setItem("selectedEventName", event.name);
    setSelectedEvent(event.key);
    setSelectedEventName(event.name);
    window.location.reload();
  };

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: "0 auto" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
        paddingTop: 8
      }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>Select Event</h1>
          <p style={{ margin: 0, fontSize: 13, color: "#6b6b78" }}>
            {new Date().getFullYear()} Season
          </p>
        </div>
      </div>

      {/* Current Selection */}
      {selectedEventName && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: 14,
          marginBottom: 16,
          borderRadius: 12,
          background: "rgba(59, 130, 246, 0.1)",
          border: "1px solid rgba(59, 130, 246, 0.3)"
        }}>
          <div style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#3b82f6",
            boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)"
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 500, marginBottom: 2 }}>
              Current Event
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f0f5" }}>
              {selectedEventName}
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="#6b6b78"
          viewBox="0 0 24 24"
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)"
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: 44 }}
        />
      </div>

      {/* Filter Toggle */}
      <button
        onClick={() => setShowActiveOnly(!showActiveOnly)}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 20,
          borderRadius: 10,
          border: showActiveOnly ? "none" : "1px solid #2a2a38",
          background: showActiveOnly ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" : "#12121a",
          color: showActiveOnly ? "white" : "#9898a8",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8
        }}
      >
        <div style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: showActiveOnly ? "white" : "#22c55e"
        }} />
        {showActiveOnly ? "Showing Live Events Only" : "Show Live Events Only"}
      </button>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: "center", padding: 40, color: "#6b6b78" }}>
          <div style={{
            width: 32,
            height: 32,
            border: "3px solid #2a2a38",
            borderTopColor: "#3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 12px"
          }} />
          Loading events...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* No Results */}
      {!loading && filteredEvents.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: 40,
          color: "#6b6b78"
        }}>
          <svg width="48" height="48" fill="none" stroke="#2a2a38" viewBox="0 0 24 24" style={{ margin: "0 auto 12px" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          No events found
        </div>
      )}

      {/* Event Groups */}
      {sortedDistricts.map(district => (
        <div key={district} style={{ marginBottom: 24 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12
          }}>
            <h2 style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#6b6b78",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: 0
            }}>
              {district}
            </h2>
            <div style={{
              flex: 1,
              height: 1,
              background: "#2a2a38"
            }} />
            <span style={{
              fontSize: 12,
              color: "#6b6b78"
            }}>
              {grouped[district].length}
            </span>
          </div>

          {grouped[district].map(event => {
            const isSelected = selectedEvent === event.key;
            const status = getStatus(event);
            const statusStyle = getStatusStyle(status);

            return (
              <button
                key={event.key}
                onClick={() => handleSelect(event)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: 14,
                  marginBottom: 8,
                  borderRadius: 12,
                  border: isSelected ? "2px solid #3b82f6" : "1px solid #2a2a38",
                  textAlign: "left",
                  background: isSelected ? "rgba(59, 130, 246, 0.1)" : "#12121a",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: isSelected ? "#3b82f6" : "#f0f0f5",
                      marginBottom: 4,
                      lineHeight: 1.3
                    }}>
                      {event.name}
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: "#6b6b78"
                    }}>
                      {formatDate(event)}
                    </div>
                  </div>

                  <div style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    background: `${statusStyle.bg}20`,
                    color: statusStyle.bg,
                    whiteSpace: "nowrap"
                  }}>
                    {statusStyle.text}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

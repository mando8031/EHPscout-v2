import React, { useEffect, useState } from "react";
import { getEvents } from "../services/tbaService";

// Shared page header used throughout the app
export function PageHeader({ icon, title, subtitle, iconBg }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingTop: 16 }}>
      <div style={{
        width: 42, height: 42, flexShrink: 0,
        borderRadius: 12,
        background: iconBg || "var(--blue)",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        {icon}
      </div>
      <div>
        <h1 style={{ fontSize: "1.125rem", margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{subtitle}</p>}
      </div>
    </div>
  );
}

// Reusable card container
export function Card({ children, style }) {
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: 14,
      padding: 16,
      ...style
    }}>
      {children}
    </div>
  );
}

// Section label
export function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      marginBottom: 10
    }}>
      {children}
    </div>
  );
}

export default function EventSelect() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // Read directly from localStorage for the current selection banner
  const storedEventKey  = localStorage.getItem("selectedEvent");
  const storedEventName = localStorage.getItem("selectedEventName");

  const [selectedEvent, setSelectedEvent] = useState(storedEventKey);
  const [selectedEventName, setSelectedEventName] = useState(storedEventName);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      const data = await getEvents(new Date().getFullYear());
      if (Array.isArray(data)) setEvents(data);
      setLoading(false);
    }
    loadEvents();
  }, []);

  const getStatus = (event) => {
    const now   = new Date();
    const start = new Date(event.start_date);
    const end   = new Date(event.end_date);
    if (now < start) return "upcoming";
    if (now > end)   return "past";
    return "active";
  };

  const statusMeta = { active: { color: "#22c55e", label: "Live" }, upcoming: { color: "#3b82f6", label: "Soon" }, past: { color: "#55556a", label: "Past" } };

  const getDistrict = (event) => {
    const key = (event.key || "").toLowerCase();
    if (key.includes("cmp")) return "Championship";
    if (key.includes("mi"))  return "Michigan District";
    if (key.includes("on"))  return "Ontario District";
    if (key.includes("in"))  return "Indiana District";
    if (key.includes("tx"))  return "Texas District";
    if (key.includes("ne"))  return "New England District";
    if (key.includes("nc"))  return "North Carolina District";
    if (key.includes("pnw")) return "Pacific Northwest";
    if (key.includes("fim")) return "Michigan District";
    return "Regional Events";
  };

  const formatDate = (event) => {
    if (!event.start_date) return "";
    const opts = { month: "short", day: "numeric" };
    const s = new Date(event.start_date).toLocaleDateString("en-US", opts);
    const e = new Date(event.end_date).toLocaleDateString("en-US", opts);
    return `${s} – ${e}`;
  };

  const handleSelect = (event) => {
    localStorage.setItem("selectedEvent",     event.key);
    localStorage.setItem("selectedEventName", event.name);
    setSelectedEvent(event.key);
    setSelectedEventName(event.name);
    window.location.reload();
  };

  const filtered = events.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchActive = showActiveOnly ? getStatus(e) === "active" : true;
    return matchSearch && matchActive;
  });

  const grouped = {};
  filtered.forEach(e => {
    const d = getDistrict(e);
    if (!grouped[d]) grouped[d] = [];
    grouped[d].push(e);
  });

  const sortedDistricts = Object.keys(grouped).sort((a, b) => {
    const order = { "Michigan District": 0, "Championship": 1 };
    const aO = order[a] ?? 50;
    const bO = order[b] ?? 50;
    if (a === "Regional Events") return 1;
    if (b === "Regional Events") return -1;
    return aO - bO || a.localeCompare(b);
  });

  return (
    <div style={{ padding: "0 16px 16px", maxWidth: 600, margin: "0 auto" }}>
      <PageHeader
        title="Select Event"
        subtitle={`${new Date().getFullYear()} FRC Season`}
        iconBg="var(--red)"
        icon={
          <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
      />

      {/* Current Event Banner */}
      {selectedEventName ? (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 14px",
          marginBottom: 16,
          borderRadius: 12,
          background: "var(--blue-dim)",
          border: "1px solid var(--blue-border)"
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
            background: "var(--blue)",
            boxShadow: "0 0 8px var(--blue)"
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--blue)", marginBottom: 2 }}>
              Current Event
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {selectedEventName}
            </div>
          </div>
          <svg width="16" height="16" fill="none" stroke="var(--blue)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ) : (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 14px",
          marginBottom: 16,
          borderRadius: 12,
          background: "rgba(239,68,68,0.08)",
          border: "1px solid var(--red-border)"
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: "var(--red)" }} />
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
            No event selected — choose one below
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 10 }}>
        <svg width="16" height="16" fill="none" stroke="var(--text-muted)" viewBox="0 0 24 24"
          style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 38 }}
        />
      </div>

      {/* Live toggle */}
      <button
        onClick={() => setShowActiveOnly(!showActiveOnly)}
        style={{
          width: "100%",
          padding: "11px 0",
          marginBottom: 20,
          background: showActiveOnly ? "rgba(34,197,94,0.15)" : "var(--bg-card)",
          border: `1px solid ${showActiveOnly ? "rgba(34,197,94,0.4)" : "var(--border)"}`,
          color: showActiveOnly ? "#22c55e" : "var(--text-secondary)",
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 500
        }}
      >
        <span style={{
          display: "inline-block", width: 7, height: 7, borderRadius: "50%",
          background: showActiveOnly ? "#22c55e" : "var(--text-muted)",
          marginRight: 8,
          verticalAlign: "middle"
        }} />
        {showActiveOnly ? "Live Events Only" : "All Events"}
      </button>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
          <div style={{
            width: 28, height: 28,
            border: "2.5px solid var(--border)",
            borderTopColor: "var(--blue)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 12px"
          }} />
          <span style={{ fontSize: 13 }}>Loading events...</span>
        </div>
      )}

      {/* No results */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <svg width="40" height="40" fill="none" stroke="var(--border)" viewBox="0 0 24 24" style={{ margin: "0 auto 12px", display: "block" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p style={{ fontSize: 14 }}>No events found</p>
        </div>
      )}

      {/* Event Groups */}
      {!loading && sortedDistricts.map(district => (
        <div key={district} style={{ marginBottom: 28 }}>
          {/* District header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
              {district}
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>{grouped[district].length}</span>
          </div>

          {/* Events */}
          {grouped[district].map(event => {
            const isCurrent = selectedEvent === event.key;
            const status    = getStatus(event);
            const meta      = statusMeta[status];

            return (
              <button
                key={event.key}
                onClick={() => handleSelect(event)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "13px 14px",
                  marginBottom: 8,
                  borderRadius: 12,
                  textAlign: "left",
                  background: isCurrent ? "var(--blue-dim)" : "var(--bg-card)",
                  border: `1px solid ${isCurrent ? "var(--blue-border)" : "var(--border)"}`,
                  color: "var(--text-primary)",
                  transition: "border-color 0.15s, background 0.15s"
                }}
              >
                {/* Status dot */}
                <div style={{
                  width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                  background: meta.color,
                  boxShadow: status === "active" ? `0 0 6px ${meta.color}` : "none"
                }} />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14, fontWeight: isCurrent ? 600 : 500,
                    color: isCurrent ? "var(--blue)" : "var(--text-primary)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    marginBottom: 3
                  }}>
                    {event.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {formatDate(event)}
                    {event.city && ` · ${event.city}`}
                  </div>
                </div>

                {/* Badge */}
                <span style={{
                  padding: "3px 8px",
                  borderRadius: 6,
                  fontSize: 11, fontWeight: 600,
                  background: `${meta.color}18`,
                  color: meta.color,
                  flexShrink: 0
                }}>
                  {meta.label}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

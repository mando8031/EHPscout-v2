import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

import ScoutLogin from "./pages/ScoutLogin";
import CreateTeam from "./pages/CreateTeam";
import EventSelect from "./pages/EventSelect";
import ScoutForm from "./pages/ScoutForm";
import Dashboard from "./pages/Dashboard";
import DataSync from "./pages/DataSync";
import NoEvent from "./pages/NoEvent";

import { getCurrentUser } from "./utils/localAuth";
import { getTeams } from "./utils/localTeams";

function App() {

  const user = getCurrentUser();
  const teams = getTeams();

  const [selectedEvent, setSelectedEvent] = useState(
    localStorage.getItem("selectedEvent")
  );

  // 🔥 LISTEN FOR CHANGES
  useEffect(() => {
    const interval = setInterval(() => {
      const current = localStorage.getItem("selectedEvent");
      setSelectedEvent(current);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>

      {/* NAVBAR */}
      <nav style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "10px",
        background: "#111",
        color: "white"
      }}>
        {user && (
          <>
            <Link style={{ color: "white" }} to="/event-select">Event</Link>
            <Link style={{ color: "white" }} to="/scout">Scout</Link>
            <Link style={{ color: "white" }} to="/dashboard">Dashboard</Link>
            <Link style={{ color: "white" }} to="/sync">Sync</Link>
          </>
        )}
      </nav>

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            user
              ? (selectedEvent
                  ? <Navigate to="/dashboard" />
                  : <Navigate to="/event-select" />)
              : <ScoutLogin />
          }
        />

        {/* EVENT SELECT */}
        <Route
          path="/event-select"
          element={
            user ? <EventSelect /> : <Navigate to="/" />
          }
        />

        {/* NO EVENT */}
        <Route
          path="/no-event"
          element={
            user ? <NoEvent /> : <Navigate to="/" />
          }
        />

        {/* SCOUT */}
        <Route
          path="/scout"
          element={
            user
              ? (selectedEvent ? <ScoutForm /> : <NoEvent />)
              : <Navigate to="/" />
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            user
              ? (selectedEvent ? <Dashboard /> : <NoEvent />)
              : <Navigate to="/" />
          }
        />

        {/* SYNC */}
        <Route
          path="/sync"
          element={
            user ? <DataSync /> : <Navigate to="/" />
          }
        />

        {/* TEAM (optional) */}
        <Route
          path="/create-team"
          element={
            user ? <CreateTeam /> : <Navigate to="/" />
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

    </Router>
  );
}

export default App;

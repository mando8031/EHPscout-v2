import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

import ScoutLogin from "./pages/ScoutLogin";
import CreateTeam from "./pages/CreateTeam";
import EventSelect from "./pages/EventSelect";
import ScoutForm from "./pages/ScoutForm";
import Dashboard from "./pages/Dashboard";
import DataSync from "./pages/DataSync";

import { getCurrentUser } from "./utils/localAuth";
import { getTeams } from "./utils/localTeams";

function App() {

  const user = getCurrentUser();
  const teams = getTeams();
  const selectedEvent = localStorage.getItem("selectedEvent");

  const userHasTeam =
    user && teams.some(t => t.members?.includes(user.username));

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
              ? userHasTeam
                ? (selectedEvent
                    ? <Navigate to="/dashboard" />
                    : <Navigate to="/event-select" />)
                : <Navigate to="/create-team" />
              : <ScoutLogin />
          }
        />

        {/* EVENT SELECT */}
        <Route
          path="/event-select"
          element={
            user
              ? <EventSelect />
              : <Navigate to="/" />
          }
        />

        {/* TEAM */}
        <Route
          path="/create-team"
          element={
            user ? <CreateTeam /> : <Navigate to="/" />
          }
        />

        {/* SCOUT */}
        <Route
          path="/scout"
          element={
            user && selectedEvent
              ? <ScoutForm />
              : <Navigate to="/event-select" />
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            user && selectedEvent
              ? <Dashboard />
              : <Navigate to="/event-select" />
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

        {/* DATASYNC */}
        <Route
          path="/sync"
          element={user ? <DataSync /> : <Navigate to="/" />}
        />
      </Routes>

    </Router>
  );
}

export default App;

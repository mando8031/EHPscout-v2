import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

import ScoutLogin from "./pages/ScoutLogin";
import CreateTeam from "./pages/CreateTeam";
import EventSelect from "./pages/EventSelect";
import ScoutForm from "./pages/ScoutForm";
import Dashboard from "./pages/Dashboard";

import { getCurrentUser } from "./utils/localAuth";
import { getTeams } from "./utils/localTeams";

function App() {

  const user = getCurrentUser();
  const teams = getTeams();

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
        <Link style={{ color: "white" }} to="/">Home</Link>

        {user && (
          <>
            <Link style={{ color: "white" }} to="/create-team">Team</Link>
            <Link style={{ color: "white" }} to="/event-select">Events</Link>
            <Link style={{ color: "white" }} to="/scout">Scout</Link>
            <Link style={{ color: "white" }} to="/dashboard">Dashboard</Link>
          </>
        )}
      </nav>

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <ScoutLogin />
          }
        />

        {/* LOGIN */}
        <Route path="/login" element={<ScoutLogin />} />

        {/* TEAM */}
        <Route
          path="/create-team"
          element={
            user ? <CreateTeam /> : <Navigate to="/login" />
          }
        />

        {/* EVENTS */}
        <Route
          path="/event-select"
          element={
            user ? <EventSelect /> : <Navigate to="/login" />
          }
        />

        {/* SCOUT */}
        <Route
          path="/scout"
          element={
            user ? <ScoutForm /> : <Navigate to="/login" />
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            user ? <Dashboard /> : <Navigate to="/login" />
          }
        />

        {/* FALLBACK (prevents white screen) */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

    </Router>
  );
}

export default App;

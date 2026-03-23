import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import ScoutLogin from "./pages/ScoutLogin";
import CreateTeam from "./pages/CreateTeam";
import JoinTeam from "./pages/JoinTeam";
import Dashboard from "./pages/Dashboard";
import EventSelect from "./pages/EventSelect";
import MatchList from "./pages/MatchList";
import ScoutForm from "./pages/ScoutForm";
import Picklist from "./pages/Picklist";

import { getCurrentUser } from "./utils/localAuth";
import { getTeams } from "./utils/localTeams";

function App() {

  const user = getCurrentUser();
  const teams = getTeams();

  const userHasTeam =
    user && teams.some(t => t.members.includes(user.username));

  return (
    <BrowserRouter>

      {/* Show navbar ONLY after team setup */}
      {user && userHasTeam && <Navbar />}

      <div style={{ padding: "20px" }}>

        <Routes>

          {/* LOGIN */}
          <Route
            path="/"
            element={
              !user ? <ScoutLogin /> : <Navigate to="/team-select" />
            }
          />

          {/* TEAM SELECT */}
          <Route
            path="/team-select"
            element={
              user && !userHasTeam ? (
                <div>
                  <h1>Select Option</h1>
                  <a href="/create-team">Create Team</a><br/>
                  <a href="/join-team">Join Team</a>
                </div>
              ) : <Navigate to="/dashboard" />
            }
          />

          {/* CREATE TEAM */}
          <Route
            path="/create-team"
            element={
              user ? <CreateTeam /> : <Navigate to="/" />
            }
          />

          {/* JOIN TEAM */}
          <Route
            path="/join-team"
            element={
              user ? <JoinTeam /> : <Navigate to="/" />
            }
          />

          {/* MAIN APP */}
          <Route
            path="/dashboard"
            element={
              userHasTeam ? <Dashboard /> : <Navigate to="/" />
            }
          />

          <Route
            path="/events"
            element={
              userHasTeam ? <EventSelect /> : <Navigate to="/" />
            }
          />

          <Route
            path="/matches/:eventKey"
            element={
              userHasTeam ? <MatchList /> : <Navigate to="/" />
            }
          />

          <Route
            path="/scout/:eventKey/:matchNumber"
            element={
              userHasTeam ? <ScoutForm /> : <Navigate to="/" />
            }
          />

          <Route
            path="/picklist"
            element={
              userHasTeam ? <Picklist /> : <Navigate to="/" />
            }
          />

        </Routes>

      </div>

    </BrowserRouter>
  );
}

export default App;

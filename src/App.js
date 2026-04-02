import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";

import ScoutLogin from "./pages/ScoutLogin";
import CreateTeam from "./pages/CreateTeam";
import EventSelect from "./pages/EventSelect";
import ScoutForm from "./pages/ScoutForm";
import Dashboard from "./pages/Dashboard";
import DataSync from "./pages/DataSync";
import NoEvent from "./pages/NoEvent";
import AccountSettings from "./pages/AccountSettings";

import { getCurrentUser } from "./utils/localAuth";
import { getTeams } from "./utils/localTeams";

const NAV_ITEMS = [
  {
    path: "/event-select",
    label: "Event",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    path: "/scout",
    label: "Scout",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  },
  {
    path: "/dashboard",
    label: "Stats",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    path: "/sync",
    label: "Sync",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )
  },
  {
    path: "/settings",
    label: "Settings",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
];

function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav style={{
      position: "fixed",
      bottom: 0, left: 0, right: 0,
      display: "flex",
      alignItems: "stretch",
      background: "#0f0f17",
      borderTop: "1px solid #22222f",
      paddingBottom: "env(safe-area-inset-bottom)",
      zIndex: 1000
    }}>
      {NAV_ITEMS.map(item => {
        const active = path === item.path ||
          (item.path === "/dashboard" && path === "/") ||
          (item.path === "/event-select" && path === "/no-event");
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              padding: "10px 4px",
              color: active ? "#3b82f6" : "#55556a",
              textDecoration: "none",
              position: "relative",
              transition: "color 0.15s ease"
            }}
          >
            {active && (
              <div style={{
                position: "absolute",
                top: 0, left: "20%", right: "20%",
                height: 2,
                borderRadius: "0 0 2px 2px",
                background: "#3b82f6"
              }} />
            )}
            {item.icon}
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, letterSpacing: "0.02em" }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function AppContent() {
  const user = getCurrentUser();
  const teams = getTeams();

  const [selectedEvent, setSelectedEvent] = useState(
    localStorage.getItem("selectedEvent")
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const current = localStorage.getItem("selectedEvent");
      setSelectedEvent(current);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {user && <BottomNav />}
      <div style={{ paddingBottom: user ? 72 : 0 }}>
        <Routes>
          <Route path="/" element={
            user
              ? (selectedEvent ? <Navigate to="/dashboard" /> : <Navigate to="/event-select" />)
              : <ScoutLogin />
          } />
          <Route path="/event-select" element={user ? <EventSelect /> : <Navigate to="/" />} />
          <Route path="/no-event"     element={user ? <NoEvent />      : <Navigate to="/" />} />
          <Route path="/scout"        element={user ? (selectedEvent ? <ScoutForm />   : <NoEvent />) : <Navigate to="/" />} />
          <Route path="/dashboard"    element={user ? (selectedEvent ? <Dashboard />   : <NoEvent />) : <Navigate to="/" />} />
          <Route path="/sync"         element={user ? <DataSync />       : <Navigate to="/" />} />
          <Route path="/settings"     element={user ? <AccountSettings /> : <Navigate to="/" />} />
          <Route path="/create-team"  element={user ? <CreateTeam />     : <Navigate to="/" />} />
          <Route path="*"             element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

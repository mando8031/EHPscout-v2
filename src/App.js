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

// Bottom Navigation Component
function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: "/event-select", label: "Event", icon: "calendar" },
    { path: "/scout", label: "Scout", icon: "clipboard" },
    { path: "/dashboard", label: "Stats", icon: "chart" },
    { path: "/sync", label: "Sync", icon: "sync" },
    { path: "/settings", label: "Settings", icon: "settings" }
  ];

  const getIcon = (icon) => {
    const iconStyle = { width: 22, height: 22 };
    
    switch (icon) {
      case "calendar":
        return (
          <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case "clipboard":
        return (
          <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      case "chart":
        return (
          <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case "sync":
        return (
          <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case "settings":
        return (
          <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      padding: "8px 4px",
      paddingBottom: "max(8px, env(safe-area-inset-bottom))",
      background: "linear-gradient(to top, #0a0a0f 0%, rgba(10, 10, 15, 0.98) 100%)",
      borderTop: "1px solid #2a2a38",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      zIndex: 1000
    }}>
      {navItems.map(item => {
        const isActive = currentPath === item.path || 
          (item.path === "/dashboard" && currentPath === "/") ||
          (item.path === "/event-select" && currentPath === "/no-event");
        
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "8px 12px",
              borderRadius: 12,
              color: isActive ? "#3b82f6" : "#6b6b78",
              background: isActive ? "rgba(59, 130, 246, 0.1)" : "transparent",
              transition: "all 0.2s ease",
              textDecoration: "none",
              minWidth: 60
            }}
          >
            {getIcon(item.icon)}
            <span style={{ 
              fontSize: 11, 
              fontWeight: isActive ? 600 : 500,
              letterSpacing: "-0.01em"
            }}>
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
      {/* Bottom Navigation - Only show when logged in */}
      {user && <BottomNav />}

      {/* Main Content with padding for bottom nav */}
      <div style={{ paddingBottom: user ? 90 : 0 }}>
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

          {/* SETTINGS */}
          <Route
            path="/settings"
            element={
              user ? <AccountSettings /> : <Navigate to="/" />
            }
          />

          {/* TEAM */}
          <Route
            path="/create-team"
            element={
              user ? <CreateTeam /> : <Navigate to="/" />
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

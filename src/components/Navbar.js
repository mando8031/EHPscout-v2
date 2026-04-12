import React, { useState, useEffect } from "react";
import { getCurrentUser, logoutUser } from "../utils/localAuth";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    borderRadius: 8,
    color: isActive(path) ? "#3b82f6" : "#9898a8",
    background: isActive(path) ? "rgba(59, 130, 246, 0.1)" : "transparent",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    transition: "all 0.2s ease"
  });

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 16px",
      background: "#0a0a0f",
      borderBottom: "1px solid #2a2a38"
    }}>
      <div style={{ display: "flex", gap: 8 }}>
        <Link to="/" style={linkStyle("/")}>Events</Link>
        <Link to="/dashboard" style={linkStyle("/dashboard")}>Dashboard</Link>
        <Link to="/picklist" style={linkStyle("/picklist")}>Picklist</Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {user ? (
          <>
            <span style={{
              fontSize: 13,
              color: "#9898a8",
              padding: "6px 12px",
              background: "#12121a",
              borderRadius: 6
            }}>
              {user.username}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 14px",
                background: "#ef4444",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={linkStyle("/login")}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

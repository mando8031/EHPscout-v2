import React, { useState, useEffect } from "react";
import { getCurrentUser, logoutUser } from "../utils/localAuth";
import { Link } from "react-router-dom";

const Navbar = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    window.location.reload();
  };

  return (
    <div
      style={{
        padding: "10px",
        background: "#222",
        color: "white",
        display: "flex",
        justifyContent: "space-between"
      }}
    >

      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/" style={{ color: "white" }}>Events</Link>
        <Link to="/dashboard" style={{ color: "white" }}>Dashboard</Link>
        <Link to="/picklist" style={{ color: "white" }}>Picklist</Link>
      </div>

      <div>
        {user ? (
          <>
            <span style={{ marginRight: "10px" }}>
              {user.username}
            </span>
            <button onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ color: "white" }}>
            Login
          </Link>
        )}
      </div>

    </div>
  );
};

export default Navbar;

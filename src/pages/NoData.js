import React from "react";
import { useNavigate } from "react-router-dom";

export default function NoData() {

  const navigate = useNavigate();

  return (
    <div style={{
      padding: "20px",
      textAlign: "center",
      color: "white"
    }}>
      <h1>No Data Yet</h1>

      <p style={{ marginBottom: "20px" }}>
        No teams have been scouted for this event yet.
      </p>

      <button
        onClick={() => navigate("/scout")}
        style={{
          padding: "15px",
          width: "100%",
          maxWidth: "300px"
        }}
      >
        Start Scouting
      </button>
    </div>
  );
}

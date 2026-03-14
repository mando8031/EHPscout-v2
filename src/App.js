console.log("APP LOADED");import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import EventSelect from "./pages/EventSelect";
import MatchList from "./pages/MatchList";
import ScoutForm from "./pages/ScoutForm";
import Dashboard from "./pages/Dashboard";
import Picklist from "./pages/Picklist";
import RobotSelect from "./pages/RobotSelect";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "20px", color: "white", background: "#111", minHeight: "100vh" }}>
        <Routes>

          <Route path="/" element={<EventSelect />} />

          <Route path="/robots" element={<RobotSelect />} />

          <Route path="/matches/:eventKey" element={<MatchList />} />

          <Route path="/scout/:eventKey/:matchNumber" element={<ScoutForm />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/picklist" element={<Picklist />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import EventSelect from "./pages/EventSelect";
import MatchList from "./pages/MatchList";
import ScoutForm from "./pages/ScoutForm";
import Dashboard from "./pages/Dashboard";
import Picklist from "./pages/Picklist";
import RobotSelect from "./pages/RobotSelect";
import ScoutLogin from "./pages/ScoutLogin";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<EventSelect />} />
          <Route path="/matches/:eventKey" element={<MatchList />} />
          <Route path="/scout/:eventKey/:matchNumber" element={<ScoutForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/picklist" element={<Picklist />} />
          <Route path="/robots" element={<RobotSelect />} />
          <Route path="/login" element={<ScoutLogin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

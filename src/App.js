import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import ScoutLogin from "./pages/ScoutLogin";
import TeamSetup from "./pages/TeamSetup";
import JoinTeam from "./pages/JoinTeam";

import Dashboard from "./pages/Dashboard";
import EventSelect from "./pages/EventSelect";
import MatchList from "./pages/MatchList";
import ScoutForm from "./pages/ScoutForm";

import RobotSelect from "./pages/RobotSelect";
import Picklist from "./pages/Picklist";
import AdminPage from "./pages/AdminPage";

function App() {

return (


<BrowserRouter>

  <div style={{ minHeight: "100vh", background: "#111", color: "white" }}>

    <Navbar />

    <div style={{ padding: "20px" }}>

      <Routes>

        <Route path="/login" element={<ScoutLogin />} />

        <Route path="/team" element={<TeamSetup />} />

        <Route path="/join-team" element={<JoinTeam />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/" element={<EventSelect />} />

        <Route path="/matches/:eventKey" element={<MatchList />} />

        <Route path="/scout/:eventKey/:matchNumber" element={<ScoutForm />} />

        <Route path="/robots" element={<RobotSelect />} />

        <Route path="/picklist" element={<Picklist />} />

        <Route path="/admin" element={<AdminPage />} />

      </Routes>

    </div>

  </div>

</BrowserRouter>


);

}

export default App;

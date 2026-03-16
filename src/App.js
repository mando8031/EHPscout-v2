import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";

import Navbar from "./components/Navbar";

import ScoutLogin from "./pages/ScoutLogin";
import EventSelect from "./pages/EventSelect";
import MatchList from "./pages/MatchList";
import ScoutForm from "./pages/ScoutForm";
import RobotSelect from "./pages/RobotSelect";
import Dashboard from "./pages/Dashboard";
import Picklist from "./pages/Picklist";

import CreateTeam from "./pages/CreateTeam";
import JoinTeam from "./pages/JoinTeam";

function App() {

const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {


const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  setUser(currentUser);
  setLoading(false);
});

return () => unsubscribe();

}, []);

if (loading) {
return <div>Loading...</div>;
}

return (


<BrowserRouter>

  <div style={{ minHeight: "100vh", background: "#111", color: "white" }}>

    <Navbar />

    <div style={{ padding: "20px" }}>

      <Routes>

        {/* Login */}
        <Route path="/login" element={<ScoutLogin />} />

        {/* Admin creates scouting team */}
        <Route
          path="/create-team"
          element={user ? <CreateTeam /> : <Navigate to="/login" />}
        />

        {/* Scouts join team using QR link */}
        <Route
          path="/join/:code"
          element={user ? <JoinTeam /> : <Navigate to="/login" />}
        />

        {/* Event selection */}
        <Route
          path="/"
          element={user ? <EventSelect /> : <Navigate to="/login" />}
        />

        {/* Match list */}
        <Route
          path="/matches/:eventKey"
          element={user ? <MatchList /> : <Navigate to="/login" />}
        />

        {/* Scout match */}
        <Route
          path="/scout/:eventKey/:matchNumber"
          element={user ? <ScoutForm /> : <Navigate to="/login" />}
        />

        {/* Robot analysis */}
        <Route
          path="/robots"
          element={user ? <RobotSelect /> : <Navigate to="/login" />}
        />

        {/* Rankings dashboard */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Alliance picklist */}
        <Route
          path="/picklist"
          element={user ? <Picklist /> : <Navigate to="/login" />}
        />

      </Routes>

    </div>

  </div>

</BrowserRouter>

);

}

export default App;

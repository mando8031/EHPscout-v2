import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "./firebase";

import Navbar from "./components/Navbar";

import ScoutLogin from "./pages/ScoutLogin";
import TeamSetup from "./pages/TeamSetup";
import CreateTeam from "./pages/CreateTeam";
import JoinTeam from "./pages/JoinTeam";

import Dashboard from "./pages/Dashboard";
import EventSelect from "./pages/EventSelect";
import MatchList from "./pages/MatchList";
import ScoutForm from "./pages/ScoutForm";

import RobotSelect from "./pages/RobotSelect";
import Picklist from "./pages/Picklist";
import AdminPage from "./pages/AdminPage";
import AccountSettings from "./pages/AccountSettings";

function App() {

const [user, setUser] = useState(null);
const [role, setRole] = useState(null);
const [teamId, setTeamId] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {


const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

  if (!currentUser) {
    setUser(null);
    setLoading(false);
    return;
  }

  setUser(currentUser);

  try {

    const userRef = doc(db, "users", currentUser.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {

      const data = snap.data();

      setRole(data.role || "scout");
      setTeamId(data.teamId || null);

    }

  } catch (err) {

    console.error("Error loading user:", err);

  }

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

    {user && teamId && <Navbar role={role} />}

    <div style={{ padding: "20px" }}>

      <Routes>

        <Route path="/login" element={<ScoutLogin />} />

        {/* TEAM SETUP */}
        <Route
          path="/team"
          element={
            !user
              ? <Navigate to="/login" />
              : teamId
              ? <Navigate to="/dashboard" />
              : <TeamSetup />
          }
        />

        <Route
          path="/create-team"
          element={user ? <CreateTeam /> : <Navigate to="/login" />}
        />

        <Route
          path="/join/:code"
          element={user ? <JoinTeam /> : <Navigate to="/login" />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            !user
              ? <Navigate to="/login" />
              : !teamId
              ? <Navigate to="/team" />
              : <Dashboard />
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            user && role === "admin"
              ? <AdminPage />
              : <Navigate to="/dashboard" />
          }
        />

        {/* SCOUTING */}
        <Route
          path="/"
          element={
            user && teamId
              ? <EventSelect />
              : <Navigate to="/team" />
          }
        />

        <Route
          path="/matches/:eventKey"
          element={
            user && teamId
              ? <MatchList />
              : <Navigate to="/team" />
          }
        />

        <Route
          path="/scout/:eventKey/:matchNumber"
          element={
            user && teamId
              ? <ScoutForm />
              : <Navigate to="/team" />
          }
        />

        {/* DATA */}
        <Route
          path="/robots"
          element={
            user && teamId
              ? <RobotSelect />
              : <Navigate to="/team" />
          }
        />

        <Route
          path="/picklist"
          element={
            user && teamId
              ? <Picklist />
              : <Navigate to="/team" />
          }
        />

        {/* ACCOUNT */}
        <Route
          path="/account"
          element={
            user
              ? <AccountSettings />
              : <Navigate to="/login" />
          }
        />

      </Routes>

    </div>

  </div>

</BrowserRouter>


);

}

export default App;

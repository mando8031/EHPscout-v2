import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "./firebase";

import Navbar from "./components/Navbar";

import ScoutLogin from "./pages/ScoutLogin";
import TeamSetup from "./pages/TeamSetup";
import JoinTeam from "./pages/JoinTeam";

import Dashboard from "./pages/Dashboard";
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

  const snap = await getDoc(doc(db, "users", currentUser.uid));

  if (snap.exists()) {

    const data = snap.data();

    setRole(data.role || "scout");
    setTeamId(data.teamId || null);

  }

  setLoading(false);

});

return () => unsubscribe();


}, []);

if (loading) return <div>Loading...</div>;

return (


<BrowserRouter>

  <div style={{ minHeight: "100vh", background: "#111", color: "white" }}>

    {user && teamId && <Navbar role={role} />}

    <div style={{ padding: "20px" }}>

      <Routes>

        <Route
          path="/"
          element={
            !user
              ? <Navigate to="/login" />
              : !teamId
              ? <Navigate to="/team" />
              : <Navigate to="/dashboard" />
          }
        />

        <Route path="/login" element={<ScoutLogin />} />

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

        <Route path="/join-team" element={<JoinTeam />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/matches"
          element={
            user && teamId
             ? <MatchList />
             : <Navigate to="/team" />
  }
/>

        <Route path="/scout/:matchNumber" element={<ScoutForm />} />

        <Route path="/robots" element={<RobotSelect />} />

        <Route path="/picklist" element={<Picklist />} />

        <Route path="/admin" element={<AdminPage />} />

        <Route path="/account" element={<AccountSettings />} />

      </Routes>

    </div>

  </div>

</BrowserRouter>


);

}

export default App;

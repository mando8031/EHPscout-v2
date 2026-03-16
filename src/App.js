import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "./firebase";

import Navbar from "./components/Navbar";

import ScoutLogin from "./pages/ScoutLogin";
import EventSelect from "./pages/EventSelect";
import MatchList from "./pages/MatchList";
import ScoutForm from "./pages/ScoutForm";
import RobotSelect from "./pages/RobotSelect";
import Dashboard from "./pages/Dashboard";
import Picklist from "./pages/Picklist";

import TeamSetup from "./pages/TeamSetup";
import CreateTeam from "./pages/CreateTeam";
import JoinTeam from "./pages/JoinTeam";
import AccountSettings from "./pages/AccountSettings";

import AdminPanel from "./pages/AdminPanel";
import ScoutHome from "./pages/ScoutHome";

function App() {

const [user, setUser] = useState(null);
const [role, setRole] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {


const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

  setUser(currentUser);

  if (currentUser) {

    const userRef = doc(db, "users", currentUser.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      setRole(snap.data().role);
    }

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

    <Navbar role={role} />

    <div style={{ padding: "20px" }}>

      <Routes>

        <Route path="/login" element={<ScoutLogin />} />

        <Route
          path="/team"
          element={user ? <TeamSetup /> : <Navigate to="/login" />}
        />

        <Route
          path="/create-team"
          element={user && role === "admin" ? <CreateTeam /> : <Navigate to="/" />}
        />

        <Route
          path="/join/:code"
          element={user ? <JoinTeam /> : <Navigate to="/login" />}
        />

        <Route
          path="/admin"
          element={user && role === "admin" ? <AdminPanel /> : <Navigate to="/" />}
        />

        <Route
          path="/scout-home"
          element={user ? <ScoutHome /> : <Navigate to="/login" />}
        />

        <Route
          path="/"
          element={user ? <EventSelect /> : <Navigate to="/login" />}
        />

        <Route
          path="/matches/:eventKey"
          element={user ? <MatchList /> : <Navigate to="/login" />}
        />

        <Route
          path="/scout/:eventKey/:matchNumber"
          element={user ? <ScoutForm /> : <Navigate to="/login" />}
        />

        <Route
          path="/robots"
          element={user ? <RobotSelect /> : <Navigate to="/login" />}
        />

        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/picklist"
          element={user ? <Picklist /> : <Navigate to="/login" />}
        />

        <Route
          path="/account"
          element={user ? <AccountSettings /> : <Navigate to="/login" />}
        />

      </Routes>

    </div>

  </div>

</BrowserRouter>


);

}

export default App;

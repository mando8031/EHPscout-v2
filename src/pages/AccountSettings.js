import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountSettings = () => {

const navigate = useNavigate();
const user = auth.currentUser;

const [role, setRole] = useState("");
const [teamName, setTeamName] = useState("");

useEffect(() => {


async function loadUserData() {

  if (!user) return;

  try {

    const userSnap = await getDoc(doc(db, "users", user.uid));

    if (!userSnap.exists()) return;

    const userData = userSnap.data();

    setRole(userData.role || "scout");

    if (userData.teamId) {

      const teamSnap = await getDoc(doc(db, "teams", userData.teamId));

      if (teamSnap.exists()) {
        setTeamName(teamSnap.data().name || "");
      }

    }

  } catch (err) {
    console.error("Load account data error:", err);
  }

}

loadUserData();


}, [user]);

async function handleSignOut() {
try {
await signOut(auth);
navigate("/login");
} catch (err) {
console.error("Sign out error:", err);
alert("Failed to sign out");
}
}

//  KEEP EXISTING DELETE LOGIC
async function handleDeleteAccount() {


if (!user) return;

const confirmDelete = window.confirm("Are you sure you want to delete your account?");

if (!confirmDelete) return;

try {

  // delete user doc
  await deleteDoc(doc(db, "users", user.uid));

  // delete auth account
  await deleteUser(user);

  navigate("/login");

} catch (err) {

  console.error("Delete account error:", err);
  alert("Failed to delete account");

}


}

return (


<div style={{ maxWidth: "500px", margin: "auto" }}>

  <h1>Account Settings</h1>

  <div style={{
    border: "1px solid #444",
    padding: "20px",
    marginBottom: "20px"
  }}>

    <h2>User Info</h2>

    <p>Email: {user?.email || "N/A"}</p>
    <p>User ID: {user?.uid}</p>
    <p>Role: {role}</p>
    <p>Team: {teamName || "No team"}</p>

  </div>

  {/* SIGN OUT */}
  <button
    onClick={handleSignOut}
    style={{
      width: "100%",
      padding: "12px",
      marginBottom: "10px"
    }}
  >
    Sign Out
  </button>

  {/* DELETE ACCOUNT (UNCHANGED BEHAVIOR) */}
  <button
    onClick={handleDeleteAccount}
    style={{
      width: "100%",
      padding: "12px"
    }}
  >
    Delete Account
  </button>

</div>


);

};

export default AccountSettings;

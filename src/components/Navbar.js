import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = ({ role }) => {

const navigate = useNavigate();

async function logout() {
await signOut(auth);
navigate("/login");
}

return (


<div
  style={{
    background: "#222",
    padding: "15px",
    display: "flex",
    gap: "20px",
    alignItems: "center"
  }}
>

  <Link to="/" style={{color:"white"}}>Event</Link>

  <Link to="/dashboard" style={{color:"white"}}>Dashboard</Link>

  <Link to="/robots" style={{color:"white"}}>Robots</Link>

  <Link to="/picklist" style={{color:"white"}}>Picklist</Link>

  {role === "admin" && (
    <Link to="/admin" style={{color:"orange"}}>
      Admin
    </Link>
  )}

  <Link to="/team" style={{color:"white"}}>Team</Link>

  <Link to="/account" style={{color:"white"}}>Account</Link>

  <button
    onClick={logout}
    style={{
      marginLeft:"auto",
      background:"#e74c3c",
      color:"white",
      border:"none",
      padding:"8px 14px",
      borderRadius:"5px",
      cursor:"pointer"
    }}
  >
    Logout
  </button>

</div>


);

};

export default Navbar;

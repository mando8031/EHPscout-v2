import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ role }) => {

return (


<div style={{
  display: "flex",
  gap: "15px",
  padding: "15px",
  borderBottom: "1px solid #333"
}}>

  <Link to="/dashboard">Dashboard</Link>

  <Link to="/matches">Matches</Link>

  <Link to="/robots">Robots</Link>

  <Link to="/picklist">Picklist</Link>

  {role === "admin" && (
    <Link to="/admin">Admin</Link>
  )}

  <Link to="/account">Account</Link>

</div>


);

};

export default Navbar;

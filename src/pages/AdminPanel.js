import React from "react";
import { Link } from "react-router-dom";

const AdminPanel = () => {

return (


<div style={{maxWidth:"700px", margin:"auto"}}>

  <h1>Admin Control Panel</h1>

  <p>Manage your scouting team and event settings.</p>

  <div style={{display:"flex", flexDirection:"column", gap:"15px"}}>

    <Link to="/create-team">
      <button style={{width:"100%", padding:"12px"}}>Create Team</button>
    </Link>

    <Link to="/dashboard">
      <button style={{width:"100%", padding:"12px"}}>View Rankings Dashboard</button>
    </Link>

    <Link to="/picklist">
      <button style={{width:"100%", padding:"12px"}}>Alliance Picklist</button>
    </Link>

    <Link to="/robots">
      <button style={{width:"100%", padding:"12px"}}>Robot Analysis</button>
    </Link>

  </div>

</div>


);

};

export default AdminPanel;

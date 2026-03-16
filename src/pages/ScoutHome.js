import React from "react";
import { Link } from "react-router-dom";

const ScoutHome = () => {

return (


<div style={{maxWidth:"700px", margin:"auto"}}>

  <h1>Scout Dashboard</h1>

  <p>Select an action below.</p>

  <div style={{display:"flex", flexDirection:"column", gap:"15px"}}>

    <Link to="/">
      <button style={{width:"100%", padding:"12px"}}>Select Event</button>
    </Link>

    <Link to="/robots">
      <button style={{width:"100%", padding:"12px"}}>Robot Stats</button>
    </Link>

    <Link to="/dashboard">
      <button style={{width:"100%", padding:"12px"}}>Team Rankings</button>
    </Link>

  </div>

</div>


);

};

export default ScoutHome;

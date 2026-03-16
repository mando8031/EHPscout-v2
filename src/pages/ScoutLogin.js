import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ScoutLogin = ({ onLogin }) => {

const [name, setName] = useState("");
const navigate = useNavigate();

function handleSubmit(e) {


e.preventDefault();

if (!name) {
  alert("Enter scout name");
  return;
}

onLogin(name);

navigate("/");


}

return (


<div style={{
  maxWidth: "400px",
  margin: "auto",
  padding: "40px"
}}>

  <h1 style={{ fontSize: "30px", marginBottom: "20px" }}>
    Scout Login
  </h1>

  <form onSubmit={handleSubmit}>

    <input
      type="text"
      placeholder="Scout Name"
      value={name}
      onChange={(e)=>setName(e.target.value)}
      style={{
        width: "100%",
        padding: "15px",
        fontSize: "18px",
        marginBottom: "20px"
      }}
    />

    <button
      type="submit"
      style={{
        width: "100%",
        padding: "15px",
        fontSize: "18px",
        background: "#3498db",
        color: "white",
        border: "none",
        borderRadius: "10px"
      }}
    >

      Start Scouting

    </button>

  </form>

</div>


);

};

export default ScoutLogin;

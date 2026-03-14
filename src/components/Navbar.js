import { Link } from "react-router-dom";

function Navbar() {

  const style = {
    background: "#1f2937",
    padding: "12px",
    display: "flex",
    gap: "20px"
  };

  return (
    <div style={style}>
      <Link to="/" style={{color:"white"}}>Events</Link>
      <Link to="/dashboard" style={{color:"white"}}>Stats</Link>
      <Link to="/picklist" style={{color:"white"}}>Picklist</Link>
    </div>
  );
}

export default Navbar;

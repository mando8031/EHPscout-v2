import { Link } from "react-router-dom";

function Navbar() {

  const style = {
    background: "linear-gradient(90deg, #2563eb, #06b6d4)",
    padding: "14px",
    display: "flex",
    gap: "24px",
    fontWeight: "bold",
    fontSize: "18px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.4)"
  };

  const linkStyle = {
    color: "white"
  };

  return (
    <div style={style}>
      <Link to="/" style={linkStyle}>Events</Link>
      <Link to="/dashboard" style={linkStyle}>Stats</Link>
      <Link to="/picklist" style={linkStyle}>Picklist</Link>
    </div>
  );
}

export default Navbar;

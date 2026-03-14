function MatchCard({ match, onClick }) {

  const style = {
    background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
    padding: "18px",
    borderRadius: "10px",
    cursor: "pointer",
    color: "white",
    fontWeight: "bold",
    fontSize: "18px",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.5)",
    transition: "transform 0.15s"
  };

  return (
    <div style={style} onClick={onClick}>
      Match {match.match_number}
    </div>
  );
}

export default MatchCard;

function TeamCard({ team, score }) {

  const style = {
    background: "linear-gradient(135deg,#f97316,#ea580c)",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "10px",
    color: "white",
    fontWeight: "bold",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.4)"
  };

  return (
    <div style={style}>
      Team {team} — {score}
    </div>
  );
}

export default TeamCard;

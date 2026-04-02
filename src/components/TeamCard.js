function TeamCard({ team, score }) {
  const scorePercent = typeof score === 'number' ? (score * 100).toFixed(0) : score;

  const getScoreColor = (val) => {
    const num = parseFloat(val);
    if (num >= 70) return "#22c55e";
    if (num >= 50) return "#3b82f6";
    if (num >= 30) return "#eab308";
    return "#ef4444";
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderRadius: 12,
      marginBottom: 10,
      background: "#12121a",
      border: "1px solid #2a2a38",
      transition: "all 0.2s ease"
    }}>
      <div style={{
        fontSize: 16,
        fontWeight: 600,
        color: "#f0f0f5"
      }}>
        Team {team}
      </div>
      <div style={{
        fontSize: 18,
        fontWeight: 700,
        color: getScoreColor(scorePercent)
      }}>
        {scorePercent}%
      </div>
    </div>
  );
}

export default TeamCard;

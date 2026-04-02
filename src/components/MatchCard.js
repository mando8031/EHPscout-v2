function MatchCard({ match, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 18,
        borderRadius: 12,
        marginBottom: 10,
        background: "#12121a",
        border: "1px solid #2a2a38",
        cursor: "pointer",
        transition: "all 0.2s ease"
      }}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "linear-gradient(135deg, #ef4444 0%, #3b82f6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 14,
          color: "white"
        }}>
          {match.match_number}
        </div>
        <div>
          <div style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#f0f0f5"
          }}>
            Qualification {match.match_number}
          </div>
          <div style={{
            fontSize: 12,
            color: "#6b6b78"
          }}>
            Tap to view details
          </div>
        </div>
      </div>
      <svg width="20" height="20" fill="none" stroke="#6b6b78" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}

export default MatchCard;

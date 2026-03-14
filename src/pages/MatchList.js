import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getMatches } from "../services/tbaService";
import MatchCard from "../components/MatchCard";

const MatchList = () => {
  const { eventKey } = useParams();
  const [matches, setMatches] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!eventKey) return;

    getMatches(eventKey).then(setMatches);
  }, [eventKey]);

  const openMatch = (match) => {
    navigate(`/scout/${eventKey}/${match.match_number}`);
  };

  return (
    <div>
      <h1 className="text-3xl mb-6">Matches</h1>

      <div className="grid gap-4">
        {matches.map((match) => (
          <MatchCard
            key={match.key}
            match={match}
            onClick={() => openMatch(match)}
          />
        ))}
      </div>
    </div>
  );
};

export default MatchList;

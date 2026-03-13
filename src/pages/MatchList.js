import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMatches } from "../services/tbaService";

function MatchList() {

  const { eventKey } = useParams();
  const [matches, setMatches] = useState([]);

  const navigate = useNavigate();

  useEffect(()=>{

    getMatches(eventKey).then(setMatches);

  },[eventKey]);

  return (

    <div>

      <h1>Matches</h1>

      {matches.map((match)=>(
        <div
          key={match.key}
          onClick={()=>navigate("/robots",{state:match})}
        >
          Match {match.match_number}
        </div>
      ))}

    </div>
  );
}

export default MatchList;

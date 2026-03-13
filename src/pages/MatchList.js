import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

import { getMatches } from "../services/tbaService"
import MatchCard from "../components/MatchCard"

function MatchList(){

  const {eventKey}=useParams()

  const [matches,setMatches]=useState([])

  const navigate=useNavigate()

  useEffect(()=>{

    getMatches(eventKey).then(setMatches)

  },[eventKey])

  return(

    <div>

      <h1 className="text-3xl mb-6">
        Match Schedule
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {matches.map(match=>(
          <MatchCard
            key={match.key}
            match={match}
            onClick={()=>navigate("/robots",{state:match})}
          />
        ))}

      </div>

    </div>

  )

}

export default MatchList

function MatchCard({match,onClick}){

  return(

    <div
    className="bg-gray-800 p-4 rounded cursor-pointer hover:bg-gray-700"
    onClick={onClick}>

      Match {match.match_number}

    </div>

  )

}

export default MatchCard

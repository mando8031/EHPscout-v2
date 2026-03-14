const location = useLocation();
const state = location.state;

if(!state){
  return <div>No match selected</div>;
}

import { useLocation,useNavigate } from "react-router-dom"

function RobotSelect(){

  const {state}=useLocation()
  const navigate=useNavigate()

  const red=state.alliances.red.team_keys
  const blue=state.alliances.blue.team_keys

  const select=(team)=>{

    navigate("/scout",{
      state:{
        team:team.replace("frc",""),
        match:state.match_number
      }
    })

  }

  return(

    <div>

      <h1 className="text-3xl mb-4">Select Robot</h1>

      <h2 className="text-red-500">Red Alliance</h2>

      {red.map(team=>{

        const num=team.replace("frc","")

        return(

          <div
          key={team}
          className="bg-red-700 p-3 rounded mb-2 cursor-pointer"
          onClick={()=>select(team)}>

            Team {num}

          </div>

        )

      })}

      <h2 className="text-blue-500 mt-6">Blue Alliance</h2>

      {blue.map(team=>{

        const num=team.replace("frc","")

        return(

          <div
          key={team}
          className="bg-blue-700 p-3 rounded mb-2 cursor-pointer"
          onClick={()=>select(team)}>

            Team {num}

          </div>

        )

      })}

    </div>

  )

}

export default RobotSelect

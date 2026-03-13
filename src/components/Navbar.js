import { Link } from "react-router-dom"

function Navbar(){

  return(

    <div className="bg-gray-800 p-4 flex gap-6">

      <Link to="/">Events</Link>

      <Link to="/dashboard">Stats</Link>

      <Link to="/picklist">Picklist</Link>

    </div>

  )

}

export default Navbar

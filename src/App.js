import { BrowserRouter, Routes, Route } from "react-router-dom";

import EventSelect from "./pages/EventSelect";
import MatchList from "./pages/MatchList";
import RobotSelect from "./pages/RobotSelect";
import ScoutForm from "./pages/ScoutForm";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<EventSelect />} />
        <Route path="/matches/:eventKey" element={<MatchList />} />
        <Route path="/robots" element={<RobotSelect />} />
        <Route path="/scout" element={<ScoutForm />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;

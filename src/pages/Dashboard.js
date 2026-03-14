import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase";
import StatChart from "../components/StatChart";
import { calculateTeamStats } from "../utils/statsCalculator";

const Dashboard = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const load = async () => {
      const snapshot = await getDocs(collection(db, "scouting"));

      const data = snapshot.docs.map((doc) => doc.data());

      const teamStats = calculateTeamStats(data);

      setStats(teamStats);
    };

    load();
  }, []);

  return (
    <div>
      <h1 className="text-3xl mb-6">Team Stats</h1>

      <StatChart data={stats} />
    </div>
  );
};

export default Dashboard;

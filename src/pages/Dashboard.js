import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import StatChart from "../components/StatChart";
import { calculateTeamStats } from "../utils/statsCalculator";

const Dashboard = () => {

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function load() {

      try {

        const snapshot = await getDocs(collection(db, "scouting"));

        const data = snapshot.docs.map(doc => doc.data());

        const calculated = calculateTeamStats(data);

        setStats(calculated);

      } catch (err) {

        console.error("Dashboard load error:", err);

      }

      setLoading(false);

    }

    load();

  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl mb-6">Team Statistics</h1>
        <p>Loading scouting data...</p>
      </div>
    );
  }

  return (
    <div>

      <h1 className="text-3xl mb-6">
        Team Statistics Dashboard
      </h1>

      <StatChart data={stats} />

    </div>
  );
};

export default Dashboard;

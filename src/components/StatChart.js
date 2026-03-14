import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function StatChart({ data }) {

  return (

    <BarChart
      width={700}
      height={400}
      data={data}
      style={{ background: "#020617", padding: "20px", borderRadius: "10px" }}
    >

      <CartesianGrid stroke="#334155" />

      <XAxis dataKey="team" stroke="#e2e8f0" />

      <YAxis stroke="#e2e8f0" />

      <Tooltip />

      <Bar dataKey="overall" fill="#22c55e" />

    </BarChart>

  );

}

export default StatChart;

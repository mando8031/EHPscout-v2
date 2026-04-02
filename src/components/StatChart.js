import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

function StatChart({ data }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "#1a1a24",
          border: "1px solid #2a2a38",
          borderRadius: 8,
          padding: "10px 14px"
        }}>
          <p style={{ margin: 0, fontWeight: 600, color: "#f0f0f5" }}>Team {label}</p>
          <p style={{ margin: "4px 0 0", color: "#3b82f6" }}>
            Score: {payload[0].value.toFixed(0)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      background: "#12121a",
      padding: 20,
      borderRadius: 14,
      border: "1px solid #2a2a38"
    }}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="#2a2a38" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="team"
            stroke="#6b6b78"
            tick={{ fill: "#9898a8", fontSize: 12 }}
            axisLine={{ stroke: "#2a2a38" }}
            tickLine={false}
          />
          <YAxis
            stroke="#6b6b78"
            tick={{ fill: "#9898a8", fontSize: 12 }}
            axisLine={{ stroke: "#2a2a38" }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59, 130, 246, 0.1)" }} />
          <Bar
            dataKey="overall"
            fill="url(#colorGradient)"
            radius={[6, 6, 0, 0]}
            maxBarSize={50}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatChart;

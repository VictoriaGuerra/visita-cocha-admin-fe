// src/components/Dashboard/StatsChart.jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function StatsChart({ data }) {
  const chartData = data || [
    { name: "Usuarios", value: 0 },
    { name: "Módulos", value: 0 },
    { name: "Eventos", value: 0 },
  ]

  return (
    <div
      style={{
        width: "100%",
        height: 300, 
        minWidth: 300,
        marginTop: "20px",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

type Props = { series: { date: string; activeUsers: number }[] };

export default function ActivityChart({ series }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Actividad de los usuarios a lo largo del tiempo</h4>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={series} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="activeUsers" stroke="#60a5fa" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

type Props = { retention: { day: number; percent: number }[] };

export default function RetentionChart({ retention }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Retención de usuarios</h4>
      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer>
          <LineChart data={retention} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis unit="%" />
            <Tooltip formatter={(v: any) => `${v}%`} />
            <Line type="monotone" dataKey="percent" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

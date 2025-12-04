import React from 'react';

type Props = { activeNow: { last30min: number; perMinute: number[] } };

export default function ActiveUsersCard({ activeNow }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Usuarios activos durante los últimos 30 minutos</h4>
      <div className="text-3xl font-bold text-gray-900 dark:text-white">{activeNow.last30min}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">Usuarios activos por minuto</div>
      <div className="flex items-end gap-1 mt-3" style={{ height: 60 }}>
        {activeNow.perMinute.map((v, i) => (
          <div key={i} className="bg-blue-500" style={{ width: 8, height: 8 + v * 18, borderRadius: 3 }} />
        ))}
      </div>
    </div>
  );
}

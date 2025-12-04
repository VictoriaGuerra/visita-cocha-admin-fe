import React from 'react';

type Props = { events: { name: string; count: number }[] };

export default function EventsCard({ events }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Número de eventos</h4>
      <div className="space-y-2">
        {events.map((e) => (
          <div key={e.name} className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-200">{e.name}</div>
            <div className="text-sm font-medium">{e.count.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

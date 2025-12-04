import React from 'react';

type Props = { countries: { country: string; visits: number }[] };

export default function UsersByCountryList({ countries }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Usuarios activos por País</h4>
      <div className="grid gap-2">
        {countries.map((c) => (
          <div key={c.country} className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-200">{c.country}</div>
            <div className="text-sm font-medium">{c.visits}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

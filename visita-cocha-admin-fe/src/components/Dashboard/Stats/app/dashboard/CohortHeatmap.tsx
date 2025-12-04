import React from 'react';

type Props = { cohort: { weekStart: string; values: number[] }[] };

function colorFor(v: number) {
  const percent = Math.min(100, v);
  const alpha = 0.2 + (percent / 200);
  return `rgba(30,64,175,${alpha})`;
}

export default function CohortHeatmap({ cohort }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Actividad de los usuarios por cohorte</h4>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-2">Semana</th>
              {cohort[0]?.values.map((_, i) => (
                <th key={i} className="text-left py-2">Semana {i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohort.map((row) => (
              <tr key={row.weekStart}>
                <td className="py-2 pr-3">{row.weekStart}</td>
                {row.values.map((v, i) => (
                  <td key={i} className="py-2">
                    <div style={{ background: colorFor(v), padding: '6px 8px', borderRadius: 6, color: '#fff', display: 'inline-block' }}>{v}%</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

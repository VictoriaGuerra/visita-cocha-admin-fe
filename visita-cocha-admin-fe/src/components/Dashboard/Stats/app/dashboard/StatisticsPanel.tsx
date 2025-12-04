import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import StatsCard from "./StatsCard";
import ActivityChart from "./ActivityChart";
import ActiveUsersCard from "./ActiveUsersCard";
import RetentionChart from "./RetentionChart";
import CohortHeatmap from "./CohortHeatmap";
import EventsCard from "./EventsCard";
import UsersByCountryList from "./UsersByCountryList";
import { fetchDashboardData, fetchFromApi } from "../services/analyticsService";

const COLORS = ["#60a5fa", "#34d399", "#f59e0b", "#f97316", "#ef4444"];

export default function StatisticsPanel() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const useReal = import.meta.env.VITE_USE_REAL_ANALYTICS === "true";
    const fetcher = useReal ? fetchFromApi : fetchDashboardData;

    fetcher()
      .then((d) => {
        if (mounted) {
          setData(d);
          setLoading(false);
          setError(null);
        }
      })
      .catch((err) => {
        console.error("StatisticsPanel fetch error:", err);
        if (mounted) {
          setError(err?.message || String(err));
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const analyticsUrl = import.meta.env.VITE_ANALYTICS_URL || "/api/analytics/dashboard";

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-gray-600 dark:text-gray-300">Cargando estadísticas…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-400 bg-red-50 dark:bg-red-900/30 p-4">
          <div className="text-red-700 dark:text-red-300 font-semibold">Error cargando estadísticas</div>
          <div className="mt-2 text-sm text-gray-700 dark:text-gray-200">{error}</div>
          <div className="mt-2 text-xs text-gray-500">URL: <code>{analyticsUrl}</code></div>
          <div className="mt-3">
            <button
              className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
              onClick={() => {
                setLoading(true);
                setError(null);
                // trigger effect by toggling a state: simple approach, call fetch directly
                const useReal = import.meta.env.VITE_USE_REAL_ANALYTICS === "true";
                const fetcher = useReal ? fetchFromApi : fetchDashboardData;
                fetcher()
                  .then((d) => {
                    setData(d);
                    setLoading(false);
                  })
                  .catch((err) => {
                    console.error("Retry fetch error:", err);
                    setError(err?.message || String(err));
                    setLoading(false);
                  });
              }}
            >
              Reintentar
            </button>
            <a className="ml-3 text-sm text-blue-600" href={analyticsUrl} target="_blank" rel="noreferrer">Abrir endpoint</a>
          </div>
        </div>
      </div>
    );
  }

  const totalVisitors = data?.visitsByCountry?.reduce((s: number, r: any) => s + r.visits, 0) ?? 0;

  return (
    <div className="p-6">
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--ion-color-dark)' }}>Panel de estadísticas</h2>
            <p className="text-sm" style={{ color: 'var(--ion-color-medium)' }}>Visión general de visitas y comportamiento</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm" style={{ color: 'var(--ion-color-medium)' }}>Últimos 30 días</div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatsCard
            title="Visitas totales"
            value={totalVisitors}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 6v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
              </svg>
            }
          />

          <StatsCard
            title="País top"
            value={data.visitsByCountry[0]?.country || '—'}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
              </svg>
            }
          >
            <div className="text-sm font-medium text-gray-600 dark:text-gray-200">{data.visitsByCountry[0]?.visits || 0} visitas</div>
          </StatsCard>

          <StatsCard
            title="Departamento top"
            value={data.visitsByDepartment[0]?.department || '—'}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.2" />
                <path d="M6 20c0-3 4-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
              </svg>
            }
          >
            <div className="text-sm font-medium text-gray-600 dark:text-gray-200">{data.visitsByDepartment[0]?.views || 0} vistas</div>
          </StatsCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <ActivityChart series={data.timeSeries || []} />
          </div>

          <div>
            <ActiveUsersCard activeNow={data.activeNow || { last30min: 0, perMinute: [] }} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Visitas por país</h3>
              <div className="rounded-lg bg-white/50 p-3">
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={data.visitsByCountry} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="country" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="visits" fill="#60a5fa" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-4">
              <div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Distribución por departamento</h3>
                  <div style={{ width: '100%', height: 220 }} className="mb-4">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={data.visitsByDepartment} dataKey="views" nameKey="department" cx="50%" cy="50%" outerRadius={80} label>
                          {data.visitsByDepartment.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {data.visitsByDepartment.map((dpt: any) => (
                      <div key={dpt.department} className="flex items-center justify-between py-2 border-b last:border-b-0 border-gray-100">
                        <div>{dpt.department}</div>
                        <div className="font-medium">{dpt.views}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <EventsCard events={data.events || []} />
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Páginas más visitadas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {data.topPages.map((page: any) => (
                  <div key={page.path} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-transparent">
                    <div className="text-sm text-gray-700 dark:text-gray-200">{page.path}</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{page.views}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <RetentionChart retention={data.retention || []} />
              <CohortHeatmap cohort={data.cohort || []} />
            </div>
          </div>

          <div>
            <UsersByCountryList countries={data.visitsByCountry || []} />
          </div>
        </div>
      </div>
    </div>
  );
}

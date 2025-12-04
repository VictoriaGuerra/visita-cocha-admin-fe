// Mock analytics service. Replace with real backend calls to GA4 Data API or BigQuery
// when you're ready to surface production data.

export type CountryVisit = { country: string; visits: number };
export type DepartmentVisit = { department: string; views: number };
export type TopPage = { path: string; views: number };

export type TimePoint = { date: string; activeUsers: number };
export type ActiveNow = { last30min: number; perMinute: number[] };
export type RetentionPoint = { day: number; percent: number };
export type CohortRow = { weekStart: string; values: number[] };
export type EventStat = { name: string; count: number };

export async function fetchDashboardData() {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 200));

  const visitsByCountry: CountryVisit[] = [
    { country: "Peru", visits: 5120 },
    { country: "Chile", visits: 2810 },
    { country: "Colombia", visits: 1700 },
    { country: "Argentina", visits: 980 },
    { country: "USA", visits: 540 },
  ];

  const visitsByDepartment: DepartmentVisit[] = [
    { department: "Soporte", views: 2500 },
    { department: "Ventas", views: 1900 },
    { department: "Marketing", views: 900 },
    { department: "Operaciones", views: 770 },
  ];

  const topPages: TopPage[] = [
    { path: "/home", views: 3400 },
    { path: "/products", views: 2400 },
    { path: "/dashboard", views: 1800 },
    { path: "/profile", views: 920 },
  ];

  // Time series for the last 30 days (mock)
  const timeSeries: TimePoint[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime());
    d.setDate(now.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    const activeUsers = Math.floor(1000 + Math.random() * 2000 + (30 - i) * 20);
    timeSeries.push({ date, activeUsers });
  }

  const activeNow: ActiveNow = { last30min: 2, perMinute: [0, 1, 0, 0, 0, 1] };

  const retention: RetentionPoint[] = [
    { day: 0, percent: 100 },
    { day: 5, percent: 12 },
    { day: 12, percent: 5 },
    { day: 19, percent: 3 },
    { day: 26, percent: 2 },
    { day: 33, percent: 2 },
  ];

  const cohort: CohortRow[] = [];
  for (let w = 0; w < 6; w++) {
    const values: number[] = [];
    for (let c = 0; c < 6; c++) values.push(Math.max(0, Math.round((Math.random() * (30 - c * 4)) + (c === 0 ? 100 : 0))));
    cohort.push({ weekStart: `week-${w}`, values });
  }

  const events: EventStat[] = [
    { name: 'page_view', count: 4000 },
    { name: 'session_start', count: 3100 },
    { name: 'first_visit', count: 1400 },
    { name: 'user_engagement', count: 1200 },
  ];

  return { visitsByCountry, visitsByDepartment, topPages, timeSeries, activeNow, retention, cohort, events } as const;
}

// Example: fetch production data from your own backend
// Your backend should call the Google Analytics Data API (GA4) or BigQuery
// with a server-side service account and expose a safe endpoint like
// GET /api/analytics/dashboard
export async function fetchFromApi() {
  const base = import.meta.env.VITE_ANALYTICS_URL || "/api/analytics/dashboard";
  const res = await fetch(base);
  if (!res.ok) throw new Error("Failed to fetch analytics data");
  return res.json();
}

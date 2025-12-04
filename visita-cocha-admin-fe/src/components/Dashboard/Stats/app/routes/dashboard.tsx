import type { Route } from "./+types/home";
import StatisticsPanel from "../dashboard/StatisticsPanel";
import Sidebar from "../dashboard/Sidebar";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Panel de estadísticas" }];
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-[1200px] mx-auto">
            <header className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Panel de estadísticas</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Visión general de Analytics. Configura GA4 para ver datos reales.</p>
            </header>

            <section className="rounded-2xl p-4">
              <StatisticsPanel />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

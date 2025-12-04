import { Link } from "react-router";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 min-h-screen p-6">
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
          style={{ background: 'linear-gradient(90deg, var(--ion-color-tertiary), var(--ion-color-secondary))' }}
        >
          Co
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">Visita Cocha</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Admin</div>
        </div>
      </div>

      <nav className="space-y-2">
        <Link
          to="/dashboard"
          className="block px-3 py-2 rounded-lg font-medium"
          style={{ backgroundColor: 'var(--ion-color-primary)', color: 'var(--ion-color-primary-contrast)' }}
        >
          Dashboard
        </Link>
        <a className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 dark:text-gray-300" href="#">Atractivos Turísticos</a>
        <a className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 dark:text-gray-300" href="#">Restaurantes</a>
        <a className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 dark:text-gray-300" href="#">Comercios</a>
        <a className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 dark:text-gray-300" href="#">Hoteles</a>
      </nav>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
        <div className="text-xs text-gray-500">Configuración</div>
        <a className="mt-2 block text-sm text-gray-700 hover:underline dark:text-gray-300" href="#">Usuarios / Permisos</a>
      </div>
    </aside>
  );
}

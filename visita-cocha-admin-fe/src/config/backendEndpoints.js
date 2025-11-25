// Mapea los ids de módulo del frontend a las rutas reales del backend
// Ajusta aquí si tus endpoints cambian o si agregas más módulos
export const BACKEND_ENDPOINTS = {
  attractions: '/atractivos',
  restaurants: '/restaurantes',
  events: '/eventos',
  hotels: '/hoteles',
  foods: '/comidas',
  itineraries: '/itinerarios',
  points: '/puntos',
  announcements: '/anuncios'
}

// Capacidades por módulo (puedes ajustar según lo que tu backend soporte hoy)
export const BACKEND_CAPABILITIES = {
  attractions: { create: true, update: true, delete: true },
  restaurants: { create: true, update: true, delete: true },
  events: { create: true, update: true, delete: true },
  hotels: { create: true, update: true, delete: true },
  foods: { create: true, update: true, delete: true },
  itineraries: { create: true, update: true, delete: true },
  points: { create: true, update: true, delete: true },
  announcements: { create: true, update: true, delete: true },
}

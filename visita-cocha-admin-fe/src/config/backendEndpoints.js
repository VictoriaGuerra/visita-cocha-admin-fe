// Mapea los ids de módulo del frontend a las rutas reales del backend
// Ajusta aquí si tus endpoints cambian o si agregas más módulos
export const BACKEND_ENDPOINTS = {
  // Módulos principales de contenido
  attractions: '/atractivos',
  restaurants: '/restaurantes',
  events: '/eventos',
  hotels: '/hotels',
  foods: '/foods',
  announcements: '/announcements',
  pois: '/pois',
  routes: '/routes',
  
  // Categorías
  'attraction-categories': '/attraction-categories',
  'restaurant-categories': '/restaurant-categories',
  'main-categories': '/main-categories',
  
  // Otros módulos
  reviews: '/reviews',
  users: '/user',
}

// Capacidades por módulo (puedes ajustar según lo que tu backend soporte hoy)
export const BACKEND_CAPABILITIES = {
  // Módulos de contenido
  attractions: { create: true, update: true, delete: true },
  restaurants: { create: true, update: true, delete: true },
  events: { create: true, update: true, delete: true },
  hotels: { create: true, update: true, delete: true },
  foods: { create: true, update: true, delete: true },
  announcements: { create: true, update: true, delete: true },
  pois: { create: true, update: true, delete: true },
  routes: { create: true, update: true, delete: true },
  
  // Categorías
  'attraction-categories': { create: true, update: true, delete: true },
  'restaurant-categories': { create: true, update: true, delete: true },
  'main-categories': { create: true, update: true, delete: true },
  
  // Otros módulos
  reviews: { create: true, update: true, delete: true },
  users: { create: true, update: true, delete: true },
}

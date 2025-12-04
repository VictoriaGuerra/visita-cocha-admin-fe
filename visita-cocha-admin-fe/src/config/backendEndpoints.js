export const BACKEND_ENDPOINTS = {
  attractions: '/attractions',
  restaurants: '/restaurants',
  events: '/events',
  hotels: '/hotels',
  foods: '/foods',
  announcements: '/announcements',
  pois: '/pois',
  points: '/pois',  // Alias para puntos de interés
  routes: '/rutas',
  itineraries: '/itineraries',
  'transport-routes': '/transport-routes',
  'attraction-categories': '/attraction-categories',
  'restaurant-categories': '/restaurant-categories',
  'main-categories': '/main-categories',
  reviews: '/reviews',
  users: '/user',
}

export const BACKEND_CAPABILITIES = {
  attractions: { create: true, update: true, delete: true },
  restaurants: { create: true, update: true, delete: true },
  events: { create: true, update: true, delete: true },
  hotels: { create: true, update: true, delete: true },
  foods: { create: true, update: true, delete: true },
  announcements: { create: true, update: true, delete: true },
  pois: { create: true, update: true, delete: true },
  points: { create: true, update: true, delete: true },  // Alias para puntos de interés
  routes: { create: true, update: true, delete: true },
  itineraries: { create: true, update: true, delete: true },
  'transport-routes': { create: true, update: true, delete: true },
  'attraction-categories': { create: true, update: true, delete: true },
  'restaurant-categories': { create: true, update: true, delete: true },
  'main-categories': { create: true, update: true, delete: true },
  reviews: { create: true, update: true, delete: true },
  users: { create: true, update: true, delete: true },
}

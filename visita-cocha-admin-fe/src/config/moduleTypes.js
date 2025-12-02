// Definición de tipos de módulos y sus campos REALES de la base de datos
export const MODULE_TYPES = {
  TOURIST_ATTRACTIONS: {
    id: 'attractions',
    name: 'Atracciones Turísticas',
    icon: 'fa-landmark',
    fields: [
      { name: 'name', type: 'text', required: true, label: 'Nombre' },
      { name: 'description', type: 'textarea', required: true, label: 'Descripción' },
      { name: 'coverUrl', type: 'url', label: 'URL de imagen de portada', required: true },
      { name: 'available', type: 'checkbox', label: 'Disponible', defaultValue: true },
      { name: 'isFeatured', type: 'checkbox', label: 'Destacado', defaultValue: false },
      { name: 'accessibility', type: 'textarea', label: 'Accesibilidad' },
      { name: 'categories', type: 'array', label: 'Categorías' },
      { name: 'contact.phone', type: 'text', label: 'Teléfono' },
      { name: 'contact.mail', type: 'email', label: 'Correo electrónico' },
      { name: 'contact.link', type: 'url', label: 'Sitio web' },
      { name: 'faq', type: 'array', label: 'Preguntas frecuentes (FAQ)' },
      { name: 'foods', type: 'array', label: 'Comidas relacionadas' },
      { name: 'location.address', type: 'text', label: 'Dirección' },
      { name: 'location.coords.lat', type: 'text', label: 'Latitud' },
      { name: 'location.coords.lng', type: 'text', label: 'Longitud' },
      { name: 'mainCategories', type: 'array', label: 'Categorías principales' },
      { name: 'order', type: 'number', label: 'Orden de visualización' },
      { name: 'rating', type: 'number', label: 'Calificación (1-5)', min: 1, max: 5 },
      { name: 'historyId', type: 'text', label: 'ID de Historia' }
    ]
  },
  
  FOODS: {
    id: 'foods',
    name: 'Comidas',
    icon: 'fa-utensils',
    fields: [
      { name: 'name', type: 'text', required: true, label: 'Nombre' },
      { name: 'description', type: 'textarea', required: true, label: 'Descripción' },
      { name: 'coverUrl', type: 'url', label: 'URL de imagen de portada', required: true },
      { name: 'available', type: 'checkbox', label: 'Disponible', defaultValue: true },
      { name: 'ingredients', type: 'array', label: 'Ingredientes' },
      { name: 'order', type: 'number', label: 'Orden de visualización' },
      { name: 'rating', type: 'number', label: 'Calificación (1-5)', min: 1, max: 5 }
    ]
  },

  ITINERARIES: {
    id: 'itineraries',
    name: 'Itinerarios',
    icon: 'fa-route',
    fields: [
      { name: 'title', type: 'text', required: true, label: 'Título' },
      { name: 'description', type: 'textarea', required: true, label: 'Descripción' },
      { name: 'coverUrl', type: 'url', label: 'URL de imagen de portada', required: true },
      { name: 'active', type: 'checkbox', label: 'Activo', defaultValue: true },
      { name: 'available', type: 'checkbox', label: 'Disponible', defaultValue: true },
      { name: 'cssClass', type: 'text', label: 'Clase CSS' },
      { name: 'duration', type: 'text', label: 'Duración' },
      { name: 'eventList', type: 'array', label: 'Lista de eventos' },
      { name: 'link', type: 'url', label: 'Enlace' },
      { name: 'order', type: 'number', label: 'Orden de visualización' },
      { name: 'slug', type: 'text', label: 'Slug' }
    ]
  },

  ROUTES: {
    id: 'routes',
    name: 'Rutas Turísticas',
    icon: 'fa-map-marked-alt',
    fields: [
      { name: 'nombre', type: 'text', required: true, label: 'Nombre' },
      { name: 'descripcion', type: 'textarea', required: true, label: 'Descripción' },
      { name: 'coverUrl', type: 'url', label: 'URL de imagen de portada' },
      { name: 'disponible', type: 'checkbox', label: 'Disponible', defaultValue: true },
      { name: 'destacado', type: 'checkbox', label: 'Destacado', defaultValue: false },
      { name: 'orden', type: 'number', label: 'Orden de visualización' },
      { name: 'hoteles', type: 'array', label: 'Hoteles (IDs)' },
      { name: 'restaurantes', type: 'array', label: 'Restaurantes (IDs)' },
      { name: 'pois', type: 'array', label: 'POIs (IDs)' },
      { name: 'duracionEstimada', type: 'text', label: 'Duración estimada' },
      { name: 'distanciaKm', type: 'number', label: 'Distancia (km)' },
      { name: 'dificultad', type: 'text', label: 'Dificultad' },
      { name: 'etiquetas', type: 'array', label: 'Etiquetas' }
    ]
  },

  MAIN_CATEGORIES: {
    id: 'mainCategories',
    name: 'Categorías Principales',
    icon: 'fa-tags',
    fields: [
      { name: 'name', type: 'text', required: true, label: 'Nombre' },
      { name: 'available', type: 'checkbox', label: 'Disponible', defaultValue: true },
      { name: 'icon', type: 'text', label: 'Icono' },
      { name: 'isFeatured', type: 'checkbox', label: 'Destacado', defaultValue: false },
      { name: 'order', type: 'number', label: 'Orden de visualización' },
      { name: 'photoUrl', type: 'url', label: 'URL de foto' }
    ]
  },

  RESTAURANTS: {
    id: 'restaurants',
    name: 'Restaurantes',
    icon: 'fa-utensils',
    fields: [
      { name: 'name', type: 'text', required: true, label: 'Nombre' },
      { name: 'description', type: 'textarea', required: true, label: 'Descripción' },
      { name: 'coverUrl', type: 'url', label: 'URL de imagen de portada', required: true },
      { name: 'available', type: 'checkbox', label: 'Disponible', defaultValue: true },
      { name: 'accessibility', type: 'textarea', label: 'Accesibilidad' },
      { name: 'categories', type: 'array', label: 'Categorías' },
      { name: 'contact.phone', type: 'text', label: 'Teléfono' },
      { name: 'contact.mail', type: 'email', label: 'Correo electrónico' },
      { name: 'contact.link', type: 'url', label: 'Sitio web' },
      { name: 'customDeliveryUrl', type: 'url', label: 'URL personalizada de delivery' },
      { name: 'deliveryUrls', type: 'array', label: 'URLs de delivery' },
      { name: 'faq', type: 'array', label: 'Preguntas frecuentes (FAQ)' },
      { name: 'foods', type: 'array', label: 'Comidas' },
      { name: 'isFeatured', type: 'checkbox', label: 'Destacado', defaultValue: false },
      { name: 'location.address', type: 'text', label: 'Dirección' },
      { name: 'location.coords.lat', type: 'text', label: 'Latitud' },
      { name: 'location.coords.lng', type: 'text', label: 'Longitud' },
      { name: 'mainCategories', type: 'array', label: 'Categorías principales' },
      { name: 'order', type: 'number', label: 'Orden de visualización' },
      { name: 'rating', type: 'number', label: 'Calificación (1-5)', min: 1, max: 5 }
    ]
  },

  EVENTS: {
    id: 'events',
    name: 'Eventos',
    icon: 'fa-calendar-days',
    fields: [
      { name: 'name', type: 'text', required: true, label: 'Nombre del evento' },
      { name: 'description', type: 'textarea', required: true, label: 'Descripción' },
      { name: 'coverUrl', type: 'url', required: true, label: 'URL de imagen de portada' },
      { name: 'available', type: 'checkbox', label: 'Disponible', defaultValue: true },
      { name: 'active', type: 'checkbox', label: 'Activo', defaultValue: true },
      { name: 'isFeatured', type: 'checkbox', label: 'Destacado', defaultValue: false },
      { name: 'categories', type: 'array', label: 'Categorías' },
      { name: 'mainCategories', type: 'array', label: 'Categorías principales' },
      { name: 'tags', type: 'array', label: 'Etiquetas' },
      { name: 'startDate', type: 'date', required: true, label: 'Fecha inicio' },
      { name: 'endDate', type: 'date', label: 'Fecha fin' },
      { name: 'startTime', type: 'time', label: 'Hora inicio' },
      { name: 'endTime', type: 'time', label: 'Hora fin' },
      { name: 'venueName', type: 'text', label: 'Lugar/Recinto' },
      { name: 'location.address', type: 'text', label: 'Dirección' },
      { name: 'location.coords.lat', type: 'text', label: 'Latitud' },
      { name: 'location.coords.lng', type: 'text', label: 'Longitud' },
      { name: 'organizer', type: 'text', label: 'Organizador' },
      { name: 'contact.phone', type: 'text', label: 'Teléfono' },
      { name: 'contact.mail', type: 'email', label: 'Correo' },
      { name: 'contact.link', type: 'url', label: 'Sitio web' },
      { name: 'ticketUrl', type: 'url', label: 'URL de tickets' },
      { name: 'isFree', type: 'checkbox', label: 'Entrada gratuita', defaultValue: false },
      { name: 'price', type: 'number', label: 'Precio' },
      { name: 'currency', type: 'text', label: 'Moneda' },
      { name: 'capacity', type: 'number', label: 'Capacidad' },
      { name: 'galleryUrls', type: 'array', label: 'Galería de imágenes (URLs)' },
      { name: 'faq', type: 'array', label: 'Preguntas frecuentes (FAQ)' },
      { name: 'order', type: 'number', label: 'Orden de visualización' }
    ]
  },

  HOTELS: {
    id: 'hotels',
    name: 'Hoteles',
    icon: 'fa-hotel',
    fields: [
      { name: 'name', type: 'text', required: true, label: 'Nombre' },
      { name: 'description', type: 'textarea', required: true, label: 'Descripción' },
      { name: 'coverUrl', type: 'url', required: true, label: 'URL imagen portada' },
      { name: 'available', type: 'checkbox', label: 'Disponible', defaultValue: true },
      { name: 'isFeatured', type: 'checkbox', label: 'Destacado', defaultValue: false },
      { name: 'stars', type: 'number', label: 'Estrellas (1-5)', min: 1, max: 5 },
      { name: 'rating', type: 'number', label: 'Calificación (1-5)', min: 0, max: 5 },
      { name: 'categories', type: 'array', label: 'Categorías' },
      { name: 'mainCategories', type: 'array', label: 'Categorías principales' },
      { name: 'amenities', type: 'array', label: 'Amenities/Servicios' },
      { name: 'roomTypes', type: 'array', label: 'Tipos de habitación' },
      { name: 'priceRangeMin', type: 'number', label: 'Precio mínimo' },
      { name: 'priceRangeMax', type: 'number', label: 'Precio máximo' },
      { name: 'currency', type: 'text', label: 'Moneda' },
      { name: 'checkInTime', type: 'time', label: 'Check-in' },
      { name: 'checkOutTime', type: 'time', label: 'Check-out' },
      { name: 'location.address', type: 'text', label: 'Dirección' },
      { name: 'location.coords.lat', type: 'text', label: 'Latitud' },
      { name: 'location.coords.lng', type: 'text', label: 'Longitud' },
      { name: 'contact.phone', type: 'text', label: 'Teléfono' },
      { name: 'contact.mail', type: 'email', label: 'Correo' },
      { name: 'contact.link', type: 'url', label: 'Sitio web' },
      { name: 'galleryUrls', type: 'array', label: 'Galería (URLs)' },
      { name: 'faq', type: 'array', label: 'FAQ' },
      { name: 'order', type: 'number', label: 'Orden' }
    ]
  },

  POINTS: {
    id: 'points',
    name: 'Puntos de Interés',
    icon: 'fa-location-dot',
    fields: [
      { name: 'name', type: 'text', required: true, label: 'Nombre' },
      { name: 'description', type: 'textarea', required: true, label: 'Descripción' },
      { name: 'coverUrl', type: 'url', required: true, label: 'URL imagen portada' },
      { name: 'available', type: 'checkbox', label: 'Disponible', defaultValue: true },
      { name: 'isFeatured', type: 'checkbox', label: 'Destacado', defaultValue: false },
      { name: 'categories', type: 'array', label: 'Categorías' },
      { name: 'mainCategories', type: 'array', label: 'Categorías principales' },
      { name: 'location.address', type: 'text', label: 'Dirección' },
      { name: 'location.coords.lat', type: 'text', label: 'Latitud' },
      { name: 'location.coords.lng', type: 'text', label: 'Longitud' },
      { name: 'contact.phone', type: 'text', label: 'Teléfono' },
      { name: 'contact.mail', type: 'email', label: 'Correo' },
      { name: 'contact.link', type: 'url', label: 'Sitio web' },
      { name: 'order', type: 'number', label: 'Orden' }
    ]
  },

  ANNOUNCEMENTS: {
    id: 'announcements',
    name: 'Anuncios',
    icon: 'fa-bullhorn',
    fields: [
      { name: 'title', type: 'text', required: true, label: 'Título' },
      { name: 'description', type: 'textarea', required: true, label: 'Descripción' },
      { name: 'coverUrl', type: 'url', label: 'Imagen (URL)' },
      { name: 'startDate', type: 'date', label: 'Inicio' },
      { name: 'endDate', type: 'date', label: 'Fin' },
      { name: 'active', type: 'checkbox', label: 'Activo', defaultValue: true },
      { name: 'isFeatured', type: 'checkbox', label: 'Destacado', defaultValue: false },
      { name: 'order', type: 'number', label: 'Orden' }
    ]
  }
};

// Campos comunes que se pueden reutilizar
export const COMMON_FIELDS = {
  contact: [
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'website', type: 'url' },
    { name: 'socialMedia', type: 'social' }
  ],
  schedule: [
    { name: 'monday', type: 'timeRange' },
    { name: 'tuesday', type: 'timeRange' },
    { name: 'wednesday', type: 'timeRange' },
    { name: 'thursday', type: 'timeRange' },
    { name: 'friday', type: 'timeRange' },
    { name: 'saturday', type: 'timeRange' },
    { name: 'sunday', type: 'timeRange' }
  ],
  location: [
    { name: 'address', type: 'text', required: true },
    { name: 'coordinates', type: 'map', required: true },
    { name: 'city', type: 'select', required: true },
    { name: 'zone', type: 'text' }
  ]
};

export const LANGUAGES = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'qu', name: 'Quechua' }
];
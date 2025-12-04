import axios from 'axios';

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
const envBase = env.VITE_API_BASE_URL;
const isDev = !!env.DEV;
const computedBase = (envBase !== undefined && envBase !== '') ? envBase : (isDev ? '' : 'http://localhost:3000');

const api = axios.create({
  baseURL: computedBase,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Token expired or invalid');
    }
    return Promise.reject(error);
  }
);

export const atractivosApi = {
  getAll: () => api.get('/attractions'),
  getById: (id) => api.get(`/attractions/${id}`),
  getByCategoria: (categoria) => api.get(`/attractions?categoria=${encodeURIComponent(categoria)}`),
  create: (data) => api.post('/attractions', data),
  update: (id, data) => api.patch(`/attractions/${id}`, data),
  delete: (id) => api.delete(`/attractions/${id}`),
};

export const restaurantesApi = {
  getAll: () => api.get('/restaurants'),
  
  /**
   * Obtener un restaurante por ID
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  getById: (id) => api.get(`/restaurants/${id}`),
  
  /**
   * Filtrar restaurantes por categoría
   * @param {string} categoria
   * @returns {Promise<Array>}
   */
  getByCategoria: (categoria) => api.get(`/restaurants?categoria=${encodeURIComponent(categoria)}`),
  
  /**
   * Crear un nuevo restaurante
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  create: (data) => api.post('/restaurants', data),
  
  /**
   * Actualizar un restaurante existente
   * @param {string|number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update: (id, data) => api.patch(`/restaurants/${id}`, data),
  
  /**
   * Eliminar un restaurante
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  delete: (id) => api.delete(`/restaurants/${id}`),
};

// ============================================
// 🎉 EVENTOS
// ============================================
export const eventosApi = {
  /**
   * Obtener todos los eventos
   * @returns {Promise<Array>}
   */
  getAll: () => api.get('/events'),
  
  /**
   * Obtener un evento por ID
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  getById: (id) => api.get(`/events/${id}`),
  
  /**
   * Obtener eventos próximos
   * @returns {Promise<Array>}
   */
  getProximos: () => api.get('/events?proximos=true'),
  
  /**
   * Filtrar eventos por categoría
   * @param {string} categoria
   * @returns {Promise<Array>}
   */
  getByCategoria: (categoria) => api.get(`/events?categoria=${encodeURIComponent(categoria)}`),
  
  /**
   * Crear un nuevo evento
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  create: (data) => api.post('/events', data),
  
  /**
   * Actualizar un evento existente
   * @param {string|number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update: (id, data) => api.patch(`/events/${id}`, data),
  
  /**
   * Eliminar un evento
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  delete: (id) => api.delete(`/events/${id}`),
};

// ============================================
// 🏨 HOTELES
// ============================================
export const hotelesApi = {
  /**
   * Obtener todos los hoteles
   * @returns {Promise<Array>}
   */
  getAll: () => api.get('/hotels'),
  
  /**
   * Obtener un hotel por ID
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  getById: (id) => api.get(`/hotels/${id}`),
  
  /**
   * Filtrar hoteles por categoría
   * @param {string} categoria
   * @returns {Promise<Array>}
   */
  getByCategoria: (categoria) => api.get(`/hotels?categoria=${encodeURIComponent(categoria)}`),
  
  /**
   * Crear un nuevo hotel
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  create: (data) => api.post('/hotels', data),
  
  /**
   * Actualizar un hotel existente
   * @param {string|number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update: (id, data) => api.patch(`/hotels/${id}`, data),
  
  /**
   * Eliminar un hotel
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  delete: (id) => api.delete(`/hotels/${id}`),
};

// ============================================
// 🍴 COMIDAS/PLATOS TÍPICOS (foods)
// ============================================
export const comidasApi = {
  /**
   * Obtener todas las comidas
   * @returns {Promise<Array>}
   */
  getAll: () => api.get('/foods'),
  
  /**
   * Obtener una comida por ID
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  getById: (id) => api.get(`/foods/${id}`),
  
  /**
   * Crear una nueva comida
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  create: (data) => api.post('/foods', data),
  
  /**
   * Actualizar una comida existente
   * @param {string|number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update: (id, data) => api.patch(`/foods/${id}`, data),
  
  /**
   * Eliminar una comida
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  delete: (id) => api.delete(`/foods/${id}`),
};

// ============================================
// 📢 ANUNCIOS (announcements)
// ============================================
export const anunciosApi = {
  /**
   * Obtener todos los anuncios
   * @returns {Promise<Array>}
   */
  getAll: () => api.get('/announcements'),
  
  /**
   * Obtener un anuncio por ID
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  getById: (id) => api.get(`/announcements/${id}`),
  
  /**
   * Crear un nuevo anuncio
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  create: (data) => api.post('/announcements', data),
  
  /**
   * Actualizar un anuncio existente
   * @param {string|number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update: (id, data) => api.patch(`/announcements/${id}`, data),
  
  /**
   * Eliminar un anuncio
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  delete: (id) => api.delete(`/announcements/${id}`),
};

// ============================================
// 📍 PUNTOS DE INTERÉS (pois - Points of Interest)
// ============================================
export const puntosApi = {
  /**
   * Obtener todos los puntos de interés
   * @returns {Promise<Array>}
   */
  getAll: () => api.get('/pois'),
  
  /**
   * Obtener un punto por ID
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  getById: (id) => api.get(`/pois/${id}`),
  
  /**
   * Crear un nuevo punto
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  create: (data) => api.post('/pois', data),
  
  /**
   * Actualizar un punto existente
   * @param {string|number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update: (id, data) => api.patch(`/pois/${id}`, data),
  
  /**
   * Eliminar un punto
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  delete: (id) => api.delete(`/pois/${id}`),
};

// ============================================
// 🗺️ RUTAS/ITINERARIOS (routes)
// ============================================
export const rutasApi = {
  /**
   * Obtener todas las rutas
   * @returns {Promise<Array>}
   */
  getAll: () => api.get('/routes'),
  
  /**
   * Obtener una ruta por ID
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  getById: (id) => api.get(`/routes/${id}`),
  
  /**
   * Crear una nueva ruta
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  create: (data) => api.post('/routes', data),
  
  /**
   * Actualizar una ruta existente
   * @param {string|number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update: (id, data) => api.patch(`/routes/${id}`, data),
  
  /**
   * Eliminar una ruta
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  delete: (id) => api.delete(`/routes/${id}`),
};

// ============================================
// 🏷️ CATEGORÍAS DE ATRACTIVOS (attraction-categories)
// ============================================
export const attractionCategoriesApi = {
  /**
   * Obtener todas las categorías de atractivos
   * @returns {Promise<Array>}
   */
  getAll: () => api.get('/attraction-categories'),
  
  /**
   * Obtener una categoría por ID
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  getById: (id) => api.get(`/attraction-categories/${id}`),
  
  /**
   * Crear una nueva categoría
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  create: (data) => api.post('/attraction-categories', data),
  
  /**
   * Actualizar una categoría existente
   * @param {string|number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update: (id, data) => api.patch(`/attraction-categories/${id}`, data),
  
  /**
   * Eliminar una categoría
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  delete: (id) => api.delete(`/attraction-categories/${id}`),
};

// ============================================
// 🍽️ CATEGORÍAS DE RESTAURANTES (restaurant-categories)
// ============================================
export const restaurantCategoriesApi = {
  /**
   * Obtener todas las categorías de restaurantes
   * @returns {Promise<Array>}
   */
  getAll: () => api.get('/restaurant-categories'),
  
  /**
   * Obtener una categoría por ID
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  getById: (id) => api.get(`/restaurant-categories/${id}`),
  
  /**
   * Crear una nueva categoría
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  create: (data) => api.post('/restaurant-categories', data),
  
  /**
   * Actualizar una categoría existente
   * @param {string|number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update: (id, data) => api.patch(`/restaurant-categories/${id}`, data),
  
  /**
   * Eliminar una categoría
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  delete: (id) => api.delete(`/restaurant-categories/${id}`),
};

// ============================================
// 📂 CATEGORÍAS PRINCIPALES (main-categories)
// ============================================
export const mainCategoriesApi = {
  /**
   * Obtener todas las categorías principales
   * @returns {Promise<Array>}
   */
  getAll: () => api.get('/main-categories'),
  
  /**
   * Obtener una categoría por ID
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  getById: (id) => api.get(`/main-categories/${id}`),
  
  /**
   * Crear una nueva categoría
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  create: (data) => api.post('/main-categories', data),
  
  /**
   * Actualizar una categoría existente
   * @param {string|number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update: (id, data) => api.patch(`/main-categories/${id}`, data),
  
  /**
   * Eliminar una categoría
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  delete: (id) => api.delete(`/main-categories/${id}`),
};

// ============================================
// ⭐ RESEÑAS/REVIEWS (reviews)
// ============================================
export const reviewsApi = {
  /**
   * Obtener todas las reseñas
   * @returns {Promise<Array>}
   */
  getAll: () => api.get('/reviews'),
  
  /**
   * Obtener una reseña por ID
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  getById: (id) => api.get(`/reviews/${id}`),
  
  /**
   * Obtener reseñas por recurso (atractivo, restaurante, etc.)
   * @param {string} resourceType - 'attraction', 'restaurant', 'hotel', etc.
   * @param {string|number} resourceId
   * @returns {Promise<Array>}
   */
  getByResource: (resourceType, resourceId) => 
    api.get(`/reviews?resourceType=${resourceType}&resourceId=${resourceId}`),
  
  /**
   * Crear una nueva reseña
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  create: (data) => api.post('/reviews', data),
  
  /**
   * Actualizar una reseña existente
   * @param {string|number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update: (id, data) => api.patch(`/reviews/${id}`, data),
  
  /**
   * Eliminar una reseña
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  delete: (id) => api.delete(`/reviews/${id}`),
};

// ============================================
// 👤 USUARIOS (user)
// ============================================
export const usersApi = {
  /**
   * Obtener todos los usuarios
   * @returns {Promise<Array>}
   */
  getAll: () => api.get('/user'),
  
  /**
   * Obtener un usuario por ID
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  getById: (id) => api.get(`/user/${id}`),
  
  /**
   * Crear un nuevo usuario
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  create: (data) => api.post('/user', data),
  
  /**
   * Actualizar un usuario existente
   * @param {string|number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update: (id, data) => api.patch(`/user/${id}`, data),
  
  /**
   * Eliminar un usuario
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  delete: (id) => api.delete(`/user/${id}`),
};

// ============================================
// 🔧 UTILIDADES
// ============================================

/**
 * Helper para obtener API por tipo de módulo
 * @param {string} moduleType - 'attractions', 'restaurants', 'events', etc.
 * @returns {Object} API correspondiente
 */
export const getApiByModuleType = (moduleType) => {
  const apiMap = {
    // Módulos principales de contenido
    attractions: atractivosApi,
    restaurants: restaurantesApi,
    events: eventosApi,
    hotels: hotelesApi,
    foods: comidasApi,
    announcements: anunciosApi,
    pois: puntosApi,
    routes: rutasApi,
    
    // Categorías
    'attraction-categories': attractionCategoriesApi,
    'restaurant-categories': restaurantCategoriesApi,
    'main-categories': mainCategoriesApi,
    
    // Otros módulos
    reviews: reviewsApi,
    users: usersApi,
  };
  return apiMap[moduleType] || null;
};

/**
 * Helper genérico para llamadas con manejo de errores
 * @param {Function} apiCall - Función que realiza la llamada API
 * @param {string} errorMessage - Mensaje de error personalizado
 * @returns {Promise<Object>}
 */
export const handleApiCall = async (apiCall, errorMessage = 'Error en la operación') => {
  try {
    const response = await apiCall();
    return { success: true, data: response.data };
  } catch (error) {
    console.error(errorMessage, error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || errorMessage
    };
  }
};

// Exportar instancia de axios por si se necesita para llamadas personalizadas
export default api;

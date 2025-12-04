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
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) console.warn('Token expired');
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
  getById: (id) => api.get(`/restaurants/${id}`),
  getByCategoria: (categoria) => api.get(`/restaurants?categoria=${encodeURIComponent(categoria)}`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.patch(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`),
};

export const eventosApi = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  getProximos: () => api.get('/events?proximos=true'),
  getByCategoria: (categoria) => api.get(`/events?categoria=${encodeURIComponent(categoria)}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.patch(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

export const hotelesApi = {
  getAll: () => api.get('/hotels'),
  getById: (id) => api.get(`/hotels/${id}`),
  getByCategoria: (categoria) => api.get(`/hotels?categoria=${encodeURIComponent(categoria)}`),
  create: (data) => api.post('/hotels', data),
  update: (id, data) => api.patch(`/hotels/${id}`, data),
  delete: (id) => api.delete(`/hotels/${id}`),
};

export const comidasApi = {
  getAll: () => api.get('/foods'),
  getById: (id) => api.get(`/foods/${id}`),
  create: (data) => api.post('/foods', data),
  update: (id, data) => api.patch(`/foods/${id}`, data),
  delete: (id) => api.delete(`/foods/${id}`),
};

export const anunciosApi = {
  getAll: () => api.get('/announcements'),
  getById: (id) => api.get(`/announcements/${id}`),
  create: (data) => api.post('/announcements', data),
  update: (id, data) => api.patch(`/announcements/${id}`, data),
  delete: (id) => api.delete(`/announcements/${id}`),
};

export const puntosApi = {
  getAll: () => api.get('/pois'),
  getById: (id) => api.get(`/pois/${id}`),
  create: (data) => api.post('/pois', data),
  update: (id, data) => api.patch(`/pois/${id}`, data),
  delete: (id) => api.delete(`/pois/${id}`),
};

export const rutasApi = {
  getAll: () => api.get('/routes'),
  getById: (id) => api.get(`/routes/${id}`),
  create: (data) => api.post('/routes', data),
  update: (id, data) => api.patch(`/routes/${id}`, data),
  delete: (id) => api.delete(`/routes/${id}`),
};

export const attractionCategoriesApi = {
  getAll: () => api.get('/attraction-categories'),
  getById: (id) => api.get(`/attraction-categories/${id}`),
  create: (data) => api.post('/attraction-categories', data),
  update: (id, data) => api.patch(`/attraction-categories/${id}`, data),
  delete: (id) => api.delete(`/attraction-categories/${id}`),
};

export const restaurantCategoriesApi = {
  getAll: () => api.get('/restaurant-categories'),
  getById: (id) => api.get(`/restaurant-categories/${id}`),
  create: (data) => api.post('/restaurant-categories', data),
  update: (id, data) => api.patch(`/restaurant-categories/${id}`, data),
  delete: (id) => api.delete(`/restaurant-categories/${id}`),
};

export const mainCategoriesApi = {
  getAll: () => api.get('/main-categories'),
  getById: (id) => api.get(`/main-categories/${id}`),
  create: (data) => api.post('/main-categories', data),
  update: (id, data) => api.patch(`/main-categories/${id}`, data),
  delete: (id) => api.delete(`/main-categories/${id}`),
};

export const reviewsApi = {
  getAll: () => api.get('/reviews'),
  getById: (id) => api.get(`/reviews/${id}`),
  getByPlace: (placeId) => api.get(`/reviews?placeId=${encodeURIComponent(placeId)}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.patch(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  approve: (id) => api.patch(`/reviews/${id}/approve`),
  reject: (id) => api.patch(`/reviews/${id}/reject`),
};

export const usersApi = {
  getAll: () => api.get('/user'),
  getById: (id) => api.get(`/user/${id}`),
  create: (data) => api.post('/user', data),
  update: (id, data) => api.patch(`/user/${id}`, data),
  delete: (id) => api.delete(`/user/${id}`),
};

export function getApiByModuleType(moduleType) {
  const apiMap = {
    attractions: atractivosApi,
    restaurants: restaurantesApi,
    events: eventosApi,
    hotels: hotelesApi,
    foods: comidasApi,
    announcements: anunciosApi,
    pois: puntosApi,
    routes: rutasApi,
    'attraction-categories': attractionCategoriesApi,
    'restaurant-categories': restaurantCategoriesApi,
    'main-categories': mainCategoriesApi,
    reviews: reviewsApi,
    users: usersApi,
  };
  return apiMap[moduleType] || null;
}

export function handleApiCall(apiCall, errorMessage = 'API Error') {
  return apiCall()
    .then(response => ({ success: true, data: response.data }))
    .catch(error => {
      console.error(errorMessage, error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || errorMessage 
      };
    });
}

export default api;

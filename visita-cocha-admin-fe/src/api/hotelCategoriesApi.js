import api from './visitaCochaApi';

/**
 * API para gestión de categorías de hoteles
 * Endpoints: /hotel-categories
 */
export const hotelCategoriesApi = {
  /**
   * Obtener todas las categorías de hoteles
   * @param {Object} params - Parámetros de consulta (ej: available=true)
   * @returns {Promise<Array>}
   */
  getAll: async (params = {}) => {
    const response = await api.get('/hotel-categories', { params });
    return response.data;
  },

  /**
   * Obtener una categoría por ID
   * @param {string} id - ID de la categoría
   * @returns {Promise<Object>}
   */
  getById: async (id) => {
    const response = await api.get(`/hotel-categories/${id}`);
    return response.data;
  },

  /**
   * Crear una nueva categoría de hotel
   * @param {Object} data - Datos de la categoría (name, description, icon, etc.)
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    const response = await api.post('/hotel-categories', data);
    return response.data;
  },

  /**
   * Actualizar una categoría existente
   * @param {string} id - ID de la categoría
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>}
   */
  update: async (id, data) => {
    const response = await api.patch(`/hotel-categories/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar una categoría
   * @param {string} id - ID de la categoría
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    await api.delete(`/hotel-categories/${id}`);
  },

  /**
   * Poblar con las 8 categorías iniciales de hoteles
   * @returns {Promise<Object>}
   */
  seed: async () => {
    const response = await api.get('/hotel-categories/seed');
    return response.data;
  },

  /**
   * Obtener solo categorías disponibles
   * @returns {Promise<Array>}
   */
  getAvailable: async () => {
    return await hotelCategoriesApi.getAll({ available: true });
  }
};

export default hotelCategoriesApi;

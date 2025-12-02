// Simple API de categorías por tipo usando localStorage
// Tipos: 'attractions' | 'restaurants' | 'main'

const makeKey = (type) => ({
  attractions: 'vc_cats_attractions_v1',
  restaurants: 'vc_cats_restaurants_v1',
  pois: 'vc_cats_pois_v1',
  main: 'vc_cats_main_v1'
}[type] || `vc_cats_${type}_v1`);

const read = (type) => {
  const raw = localStorage.getItem(makeKey(type));
  try { return raw ? JSON.parse(raw) : []; } catch { return []; }
};

const write = (type, arr) => {
  localStorage.setItem(makeKey(type), JSON.stringify(arr));
};

const generateId = () => `cat_${Date.now()}_${Math.floor(Math.random()*1000)}`;

export const categoriesApi = {
  getAll: async (type) => read(type),
  getById: async (type, id) => read(type).find(x => x.id === id) || null,
  create: async (type, data) => {
    const arr = read(type);
    const item = { id: data.id || generateId(), available: true, order: 0, ...data };
    arr.push(item);
    write(type, arr);
    return item;
  },
  update: async (type, id, patch) => {
    const arr = read(type);
    const idx = arr.findIndex(x => x.id === id);
    if (idx === -1) throw new Error('Not found');
    arr[idx] = { ...arr[idx], ...patch };
    write(type, arr);
    return arr[idx];
  },
  delete: async (type, id) => {
    let arr = read(type);
    arr = arr.filter(x => x.id !== id);
    write(type, arr);
    return true;
  }
};

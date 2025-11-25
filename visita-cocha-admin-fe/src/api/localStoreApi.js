// Simple localStorage-backed API for module items so UI works without backend
const makeKey = (moduleId) => `vc_data_${moduleId}_v1`;

const read = (moduleId) => {
  const raw = localStorage.getItem(makeKey(moduleId));
  try{
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return []; }
}

const write = (moduleId, arr) => {
  localStorage.setItem(makeKey(moduleId), JSON.stringify(arr));
}

const generateId = () => `id_${Date.now()}_${Math.floor(Math.random()*1000)}`;

export const localStoreApi = {
  getAll: async (moduleId) => {
    return read(moduleId);
  },
  getById: async (moduleId, id) => {
    const arr = read(moduleId);
    return arr.find(x=>x.id===id) || null;
  },
  create: async (moduleId, data) => {
    const arr = read(moduleId);
    const now = new Date().toISOString();
    const item = { id: generateId(), createdAt: now, updatedAt: now, ...data };
    arr.unshift(item);
    write(moduleId, arr);
    return item;
  },
  update: async (moduleId, id, patch) => {
    const arr = read(moduleId);
    const idx = arr.findIndex(x=>x.id===id);
    if (idx === -1) throw new Error('Not found');
    arr[idx] = { ...arr[idx], ...patch, updatedAt: new Date().toISOString() };
    write(moduleId, arr);
    return arr[idx];
  },
  delete: async (moduleId, id) => {
    let arr = read(moduleId);
    arr = arr.filter(x=>x.id!==id);
    write(moduleId, arr);
    return true;
  },
  clearModule: async(moduleId) => { write(moduleId, []); }
}

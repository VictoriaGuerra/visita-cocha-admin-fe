import axios from 'axios'

// Prefer a relative base URL in development so Vite's proxy can forward requests
const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {}
const envBase = env.VITE_API_BASE_URL
const isDev = !!env.DEV
// If VITE_API_BASE_URL is provided and non-empty, use it. Otherwise, in dev use '' (relative) to leverage Vite proxy.
const computedBase = (envBase !== undefined && envBase !== '') ? envBase : (isDev ? '' : 'http://localhost:4000')

const api = axios.create({
  baseURL: computedBase,
  headers: { 'Content-Type': 'application/json' }
})

// Log de ayuda para depuración: muestra qué baseURL y si está habilitado backend
try {
  // `import.meta.env` puede no estar disponible en algunos entornos; acceder dentro de try
  const useBackend = env.VITE_USE_BACKEND
  console.info('[api] baseURL:', api.defaults.baseURL, 'VITE_USE_BACKEND=', useBackend, 'DEV=', isDev)
} catch (e) {
  /* ignore in non-browser environments */
}

// Interceptor para agregar token de autorización si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// API para atractivos turísticos
export const fetchTouristAttractions = async () => {
  // Probar varias rutas comunes para distintos backends: español, inglés y con prefijo /api
  const candidates = ['/atractivos', '/attractions', '/api/atractivos', '/api/attractions']
  for (const path of candidates) {
    try {
      const resp = await api.get(path)
      if (resp && resp.data) return resp.data
    } catch (err) {
      // Si es 404/405 u otro error, seguimos probando. Log para depuración.
      // No romper aquí; probaremos la siguiente ruta candidata.
      // console.debug(`[api] fetchTouristAttractions failed for ${path}:`, err?.response?.status || err.message)
    }
  }
  // Si ninguno respondió correctamente, lanzar para que el UI muestre el error
  throw new Error('No se pudo obtener la lista de atractivos desde el backend (probadas: ' + candidates.join(', ') + ')')
}

export const fetchTouristAttractionById = async (id) => {
  const { data } = await api.get(`/atractivos/${id}`) // 👈 cambiado
  return data
}

export const createTouristAttraction = async (attraction) => {
  const { data } = await api.post('/atractivos', attraction) // 👈 cambiado
  return data
}

export const updateTouristAttraction = async (id, attraction) => {
  const { data } = await api.put(`/atractivos/${id}`, attraction) // 👈 cambiado
  return data
}

export const deleteTouristAttraction = async (id) => {
  const { data } = await api.delete(`/atractivos/${id}`) // 👈 cambiado
  return data
}

export default api

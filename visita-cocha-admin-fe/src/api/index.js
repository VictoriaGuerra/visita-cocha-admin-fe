// API Adapter para Backend
import api from './api'
import { BACKEND_ENDPOINTS } from '../config/backendEndpoints'

export * from './visitaCochaApi'

const useBackend = import.meta.env.VITE_USE_BACKEND === 'true'
export const USE_BACKEND = useBackend

async function callApiMethod(method, path, payload) {
  const candidates = []
  if (path.startsWith('/api')) {
    candidates.push(path)
  } else {
    candidates.push(path)
    candidates.push('/api' + path)
  }

  let lastErr = null
  for (const p of candidates) {
    try {
      if (method === 'get' || method === 'delete') {
        const res = await api[method](p)
        return res.data
      } else {
        const res = await api[method](p, payload)
        return res.data
      }
    } catch (e) {
      lastErr = e
      const status = e?.response?.status
      // Si es 401/403, lanzar inmediatamente (problema de auth)
      if (status === 401 || status === 403) throw e
      // Si es 404, seguir probando otras rutas
      if (status === 404) continue
      // Para otros errores (500, etc), también lanzar inmediatamente
      if (status && status !== 404) throw e
    }
  }
  // Si llegamos aquí, ninguna ruta funcionó
  const msg = lastErr?.response?.status === 404 
    ? `Endpoint no encontrado. Probados: ${candidates.join(', ')}`
    : lastErr?.message || 'No response from backend'
  throw lastErr || new Error(msg)
}

/* AUTHENTICATION */
export async function authLogin(email, password) {
  if (!useBackend) throw new Error('Backend requerido')
  const data = await callApiMethod('post', '/auth/login', { email, password })
  if (data?.token) localStorage.setItem('access_token', data.token)
  return { token: data?.token, usuario: data?.usuario }
}

export async function getMe() {
  if (!useBackend) throw new Error('Backend requerido')
  const data = await callApiMethod('get', '/user/me')
  return data
}

/* CONTENT / MODULES */
function contentPath(moduleId) {
  return BACKEND_ENDPOINTS[moduleId] || null
}

export async function getContentList(moduleId) {
  const path = contentPath(moduleId)
  if (!useBackend) throw new Error('Backend requerido')
  if (!path) throw new Error(`No hay endpoint para: ${moduleId}`)
  const data = await callApiMethod('get', path)
  return Array.isArray(data) ? data : data?.items || []
}

export async function getContentById(moduleId, id) {
  const path = contentPath(moduleId)
  if (!useBackend) throw new Error('Backend requerido')
  if (!path) throw new Error(`No hay endpoint para: ${moduleId}`)
  const data = await callApiMethod('get', `${path}/${encodeURIComponent(id)}`)
  return data
}

export async function createContent(moduleId, payload) {
  const path = contentPath(moduleId)
  if (!useBackend) throw new Error('Backend requerido')
  if (!path) throw new Error(`No hay endpoint para: ${moduleId}`)
  const data = await callApiMethod('post', path, payload)
  return data
}

export async function updateContent(moduleId, id, payload) {
  const path = contentPath(moduleId)
  if (!useBackend) throw new Error('Backend requerido')
  if (!path) throw new Error(`No hay endpoint para: ${moduleId}`)
  
  // Foods, Hotels, Announcements, Points/POIs y Routes usan PUT, otros módulos usan PATCH
  // Transport-routes usa PATCH pero puede ser FormData
  const usePut = ['foods', 'hotels', 'announcements', 'points', 'pois', 'routes'].includes(moduleId);
  const method = usePut ? 'put' : 'patch';
  
  const data = await callApiMethod(method, `${path}/${encodeURIComponent(id)}`, payload)
  return data
}

export async function deleteContent(moduleId, id) {
  const path = contentPath(moduleId)
  if (!useBackend) throw new Error('Backend requerido')
  if (!path) throw new Error(`No hay endpoint para: ${moduleId}`)
  const data = await callApiMethod('delete', `${path}/${encodeURIComponent(id)}`)
  return data || { ok: true }
}

/* USERS */
export async function getUsers() {
  if (!useBackend) throw new Error('Backend requerido')
  const data = await callApiMethod('get', '/user')
  return Array.isArray(data) ? data : []
}

export async function getUserById(id) {
  if (!useBackend) throw new Error('Backend requerido')
  const data = await callApiMethod('get', `/user/${id}`)
  return data
}

export async function createUser(payload) {
  if (!useBackend) throw new Error('Backend requerido')
  const data = await callApiMethod('post', '/user', payload)
  return data
}

export async function updateUser(id, patch) {
  if (!useBackend) throw new Error('Backend requerido')
  const data = await callApiMethod('put', `/user/${id}`, patch)
  return data
}

export async function deleteUser(id) {
  if (!useBackend) throw new Error('Backend requerido')
  const data = await callApiMethod('delete', `/user/${id}`)
  return data
}

// Export hotel categories API
export { hotelCategoriesApi } from './hotelCategoriesApi'

/* PASSWORD RESET - NO implementado en backend actual */

export async function requestPasswordReset(email) {
  // Llama al endpoint del backend para solicitar reseteo
  const res = await api.post('/user/request-password-reset', { email });
  return res.data;
}


export async function verifyResetCode(email, code) {
  // Llama al endpoint del backend para verificar el token
  const res = await api.get(`/user/verify-reset-token?email=${encodeURIComponent(email)}&token=${encodeURIComponent(code)}`);
  return res.data;
}


export async function resetPassword(email, token, newPassword) {
  // Llama al endpoint del backend para cambiar la contraseña
  const res = await api.post('/user/reset-password', { email, token, newPassword });
  return res.data;
}

export async function completeInitialPasswordSetup(email, newPassword) {
  if (!useBackend) throw new Error('Backend requerido')
  // Enviar email y newPassword porque el endpoint no usa autenticación JWT
  const data = await callApiMethod('post', '/auth/password/initial', { email, newPassword })
  // El backend devuelve token nuevo, actualizarlo
  if (data?.token) localStorage.setItem('access_token', data.token)
  return data
}

/* MODULES */
export async function getModules() {
  if (!useBackend) throw new Error('Backend requerido')
  const data = await callApiMethod('get', '/modules')
  return Array.isArray(data) ? data : []
}

export async function createModule(payload) {
  if (!useBackend) throw new Error('Backend requerido')
  const data = await callApiMethod('post', '/modules', payload)
  return data
}

export async function updateModule(id, patch) {
  if (!useBackend) throw new Error('Backend requerido')
  const data = await callApiMethod('put', `/modules/${id}`, patch)
  return data
}

export async function deleteModule(id) {
  if (!useBackend) throw new Error('Backend requerido')
  const data = await callApiMethod('delete', `/modules/${id}`)
  return data || { ok: true }
}
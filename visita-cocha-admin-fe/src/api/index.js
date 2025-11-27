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
      if (status === 401 || status === 403) throw e
    }
  }
  throw lastErr || new Error('No response from backend')
}

/* AUTHENTICATION */
export async function authLogin(email, password) {
  if (!useBackend) throw new Error('Backend requerido')
  const data = await callApiMethod('post', '/login', { email, password })
  if (data?.token) localStorage.setItem('access_token', data.token)
  return { token: data?.token, usuario: data?.usuario }
}

export async function getMe() {
  if (!useBackend) throw new Error('Backend requerido')
  const data = await callApiMethod('get', '/auth/me')
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
  const data = await callApiMethod('put', `${path}/${encodeURIComponent(id)}`, payload)
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
  return data || { ok: true }
}

/* PASSWORD RESET - NO implementado en backend actual */
export async function requestPasswordReset(email, options) {
  throw new Error('Password reset no implementado en el backend')
}

export async function verifyResetCode(email, code) {
  throw new Error('Password reset no implementado en el backend')
}

export async function resetPassword(email, code, newPassword) {
  throw new Error('Password reset no implementado en el backend')
}

export async function completeInitialPasswordSetup(email, newPassword) {
  throw new Error('Password reset no implementado en el backend')
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
// index.js — Adaptador de API con fallback a mock
import api from './api'
import * as mockApi from './mockApi'
import { BACKEND_ENDPOINTS } from '../config/backendEndpoints'

// Variable para decidir si usar backend real
const useBackend = import.meta.env.VITE_USE_BACKEND === 'true'
export const USE_BACKEND = useBackend

// Helper para manejar errores y fallback al mock
async function safeBackend(fn, fallback) {
  if (!useBackend) return fallback()
  try {
    return await fn()
  } catch (e) {
    const msg = e?.message ? String(e.message) : ''
    const code = e?.code ? String(e.code) : ''
    const status = e?.response?.status

    // Fallback to mock when backend is unreachable (network) or when the
    // endpoint is missing / auth failed (404, 401, 403) to keep the UI usable
    if (
      code === 'ERR_NETWORK' ||
      msg.toLowerCase().includes('network error') ||
      msg.toLowerCase().includes('connection refused') ||
      status === 401 || status === 403 || status === 404
    ) {
      console.warn('[api adapter] Backend no disponible o endpoint no encontrado. Usando fallback mock.', msg || status)
      try {
        return await fallback()
      } catch (fe) {
        console.warn('[api adapter] Fallback mock también falló:', fe)
        throw e
      }
    }
    console.warn('[api adapter] Fallo backend:', msg || status)
    throw e
  }
}

// Helper para llamar rutas probando con y sin prefijo /api
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
      // Si es 401/403 queremos propagar inmediatamente (no intentar otra ruta)
      const status = e?.response?.status
      if (status === 401 || status === 403) throw e
      // si falla, probar siguiente candidato
    }
  }
  // Si llegamos aquí, lanzar el último error para que safeBackend decida el fallback
  throw lastErr || new Error('No response from backend')
}

/* =======================
   AUTHENTICATION
======================= */
export async function authLogin(email, password) {
  // Intentar backend primero; si responde 401/403, intentar fallback al mock
  try {
    const result = await safeBackend(
      async () => {
        const data = await callApiMethod('post', '/login', { email, password })
        if (data?.token) localStorage.setItem('access_token', data.token)
        return { token: data?.token }
      },
      () => mockApi.authLogin(email, password)
    )
    return result
  } catch (e) {
    const status = e?.response?.status
    if (status === 401 || status === 403) {
      // Backend rechazó credenciales: permitir login contra mock para demo
      try {
        const mockRes = await mockApi.authLogin(email, password)
        if (mockRes?.token) localStorage.setItem('access_token', mockRes.token)
        return { token: mockRes?.token }
      } catch (me) {
        throw e
      }
    }
    throw e
  }
}

export async function getMe(hintEmail) {
  return safeBackend(
    async () => {
      const data = await callApiMethod('get', '/auth/me')
      return data
    },
    async () => {
      const users = await mockApi.getUsers()
      if (hintEmail) return users.find(u => u.email === hintEmail) || users[0] || null
      return users[0] || null
    }
  )
}

/* =======================
   CONTENT / MODULES
======================= */
function contentPath(moduleId) {
  return BACKEND_ENDPOINTS[moduleId] || null
}

export async function getContentList(moduleId) {
  const path = contentPath(moduleId)
  if (!useBackend) throw new Error('USE_BACKEND=false, habilita VITE_USE_BACKEND para usar API real')
  if (!path) throw new Error(`No hay endpoint mapeado para módulo: ${moduleId}`)
  const data = await callApiMethod('get', path)
  return Array.isArray(data) ? data : data?.items || []
}

export async function getContentById(moduleId, id) {
  const path = contentPath(moduleId)
  if (!useBackend) throw new Error('USE_BACKEND=false, habilita VITE_USE_BACKEND para usar API real')
  if (!path) throw new Error(`No hay endpoint mapeado para módulo: ${moduleId}`)
  const data = await callApiMethod('get', `${path}/${encodeURIComponent(id)}`)
  return data
}

export async function createContent(moduleId, payload) {
  const path = contentPath(moduleId)
  if (!useBackend) throw new Error('Solo disponible en modo backend')
  if (!path) throw new Error(`No hay endpoint para crear en módulo ${moduleId}`)
  const data = await callApiMethod('post', path, payload)
  return data
}

export async function updateContent(moduleId, id, payload) {
  const path = contentPath(moduleId)
  if (!useBackend) throw new Error('Solo disponible en modo backend')
  if (!path) throw new Error(`No hay endpoint para actualizar en módulo ${moduleId}`)
  const data = await callApiMethod('put', `${path}/${encodeURIComponent(id)}`, payload)
  return data
}

export async function deleteContent(moduleId, id) {
  const path = contentPath(moduleId)
  if (!useBackend) throw new Error('Solo disponible en modo backend')
  if (!path) throw new Error(`No hay endpoint para eliminar en módulo ${moduleId}`)
  const data = await callApiMethod('delete', `${path}/${encodeURIComponent(id)}`)
  return data || { ok: true }
}

/* =======================
   USERS
======================= */
export async function getUsers() {
  return safeBackend(
    async () => {
      const data = await callApiMethod('get', '/users')
      return Array.isArray(data) ? data : []
    },
    () => mockApi.getUsers()
  )
}

export async function createUser(payload) {
  return safeBackend(
    async () => {
      const data = await callApiMethod('post', '/users', payload)
      return data
    },
    () => mockApi.createUser(payload)
  )
}

export async function updateUser(id, patch) {
  return safeBackend(
    async () => {
      const data = await callApiMethod('put', `/users/${id}`, patch)
      return data
    },
    () => mockApi.updateUser(id, patch)
  )
}

export async function deleteUser(id) {
  return safeBackend(
    async () => {
      const data = await callApiMethod('delete', `/users/${id}`)
      return data || { ok: true }
    },
    () => mockApi.deleteUser(id)
  )
}

/* =======================
   PASSWORD RESET / FIRST LOGIN
======================= */
export async function requestPasswordReset(email, options) {
  return safeBackend(
    async () => {
      const data = await callApiMethod('post', '/auth/password/reset/request', { email, ...options })
      return data || { ok: true }
    },
    () => mockApi.requestPasswordReset(email, options)
  )
}

export async function verifyResetCode(email, code) {
  return safeBackend(
    async () => {
      const data = await callApiMethod('post', '/auth/password/reset/verify', { email, code })
      return data || { ok: true }
    },
    () => mockApi.verifyResetCode(email, code)
  )
}

export async function resetPassword(email, code, newPassword) {
  return safeBackend(
    async () => {
      const data = await callApiMethod('post', '/auth/password/reset/confirm', { email, code, newPassword })
      return data || { ok: true }
    },
    () => mockApi.resetPassword(email, code, newPassword)
  )
}

export async function completeInitialPasswordSetup(email, newPassword) {
  return safeBackend(
    async () => {
      const data = await callApiMethod('post', '/auth/password/initial', { email, newPassword })
      return data
    },
    () => mockApi.completeInitialPasswordSetup(email, newPassword)
  )
}

/* =======================
   MODULES
======================= */
export async function getModules() {
  return safeBackend(
    async () => {
      const data = await callApiMethod('get', '/modules')
      return Array.isArray(data) ? data : []
    },
    () => mockApi.getModules()
  )
}

export async function createModule(payload) {
  return safeBackend(
    async () => {
      const data = await callApiMethod('post', '/modules', payload)
      return data
    },
    () => mockApi.createModule(payload)
  )
}

export async function updateModule(id, patch) {
  return safeBackend(
    async () => {
      const data = await callApiMethod('put', `/modules/${id}`, patch)
      return data
    },
    () => mockApi.updateModule(id, patch)
  )
}

export async function deleteModule(id) {
  return safeBackend(
    async () => {
      const data = await callApiMethod('delete', `/modules/${id}`)
      return data || { ok: true }
    },
    () => mockApi.deleteModule(id)
  )
}

/* =======================
   SIMULATED EMAILS (solo mock)
======================= */
export function getSentEmails() {
  return mockApi.getSentEmails()
}

export function clearSentEmails() {
  return mockApi.clearSentEmails()
}
;
import axios from 'axios'

import { API_URL, AUTH_STORAGE_KEY } from '../config'

/** Instancia unica de axios para hablar con el backend. */
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

function leerToken() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? (JSON.parse(raw).token ?? null) : null
  } catch {
    return null
  }
}

// Adjunta el JWT a cada peticion si hay sesion.
apiClient.interceptors.request.use((config) => {
  const token = leerToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Si el backend responde 401/403, la sesion ya no sirve: se limpia y se manda a /acceso.
// (Hoy estos endpoints solo exigen estar autenticado, no un rol; cuando exista control
//  por rol habra que distinguir "no logueado" de "sin permiso".)
apiClient.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      if (!window.location.pathname.startsWith('/acceso')) {
        window.location.assign('/acceso')
      }
    }
    return Promise.reject(error)
  },
)

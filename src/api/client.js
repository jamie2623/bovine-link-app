import axios from 'axios'

import { API_URL } from '../config'
import { borrarSesion, leerToken } from '../auth/session-storage'

/** Instancia unica de axios para hablar con el backend. */
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Adjunta el JWT a cada peticion si hay sesion.
apiClient.interceptors.request.use((config) => {
  const token = leerToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Si el backend responde 401/403, la sesion ya no sirve: se limpia y se manda a /login.
// (Hoy estos endpoints solo exigen estar autenticado, no un rol; cuando exista control
//  por rol habra que distinguir "no logueado" de "sin permiso".)
apiClient.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      borrarSesion()
      const enAuth =
        window.location.pathname.startsWith('/login') ||
        window.location.pathname.startsWith('/registro')
      if (!enAuth) {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

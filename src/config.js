// Configuracion global de la app.

/** URL base del backend. Se define en .env como VITE_API_URL. */
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

/** Clave de localStorage donde se guarda la sesion (token + datos del usuario). */
export const AUTH_STORAGE_KEY = 'bovinelink.auth'

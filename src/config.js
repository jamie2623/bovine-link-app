// Configuracion global de la app.

/** URL base del backend. Se define en .env como VITE_API_URL. */
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

/** Clave donde se guarda la sesion (token + datos del usuario). */
export const AUTH_STORAGE_KEY = 'bovinelink.auth'

/**
 * Logo de la marca. Colocar el archivo en public/logo-bovine-link.png
 * (si todavia no existe, el <img> hace fallback a /favicon.svg).
 */
export const LOGO_URL = '/logo-bovine-link.png'
export const LOGO_FALLBACK = '/favicon.svg'

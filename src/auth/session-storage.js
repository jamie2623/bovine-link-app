import { AUTH_STORAGE_KEY } from '../config'

// La sesion vive en localStorage si el usuario marco "Recordarme";
// si no, en sessionStorage (se borra al cerrar el navegador).

export function leerSesion() {
  try {
    const raw =
      localStorage.getItem(AUTH_STORAGE_KEY) ?? sessionStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function guardarSesion(data, recordar) {
  const destino = recordar ? localStorage : sessionStorage
  const otro = recordar ? sessionStorage : localStorage
  destino.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
  otro.removeItem(AUTH_STORAGE_KEY)
}

export function borrarSesion() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  sessionStorage.removeItem(AUTH_STORAGE_KEY)
}

export function leerToken() {
  return leerSesion()?.token ?? null
}

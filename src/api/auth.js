import { apiClient } from './client'

/**
 * POST /api/auth/login
 * @param {{ correo: string, password: string }} credenciales
 * @returns {Promise<{ token: string, id: number, nombre: string, correo: string, rol: string }>}
 */
export async function login({ correo, password }) {
  const { data } = await apiClient.post('/api/auth/login', { correo, password })
  return data
}

/**
 * POST /api/auth/register  (disponible en el backend; aun sin vista propia)
 * @param {{ nombre: string, correo: string, telefono?: string, password: string }} datos
 */
export async function register(datos) {
  const { data } = await apiClient.post('/api/auth/register', datos)
  return data
}

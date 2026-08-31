import { apiClient } from './client'

/**
 * GET /api/dashboard/resumen
 * @returns {Promise<{
 *   totalPublicaciones: number, usuariosRegistrados: number, ganadoVendido: number,
 *   publicacionesEnVenta: number, montoTotalVendido: number
 * }>}
 */
export async function obtenerResumen() {
  const { data } = await apiClient.get('/api/dashboard/resumen')
  return data
}

/**
 * GET /api/dashboard/por-ubicacion  (grafico de barras)
 * @returns {Promise<Array<{ etiqueta: string, total: number }>>}
 */
export async function obtenerPorUbicacion() {
  const { data } = await apiClient.get('/api/dashboard/por-ubicacion')
  return data
}

/**
 * GET /api/dashboard/por-raza  (grafico de pie)
 * @returns {Promise<Array<{ etiqueta: string, total: number }>>}
 */
export async function obtenerPorRaza() {
  const { data } = await apiClient.get('/api/dashboard/por-raza')
  return data
}

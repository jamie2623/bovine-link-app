import { apiClient } from './client'

/**
 * GET /api/publicaciones  (publico)
 * @returns {Promise<Array<{
 *   id: number, titulo: string, descripcion: string, precio: number,
 *   ubicacion: string, estado: 'en_venta' | 'vendido',
 *   usuarioId: number, usuarioNombre: string,
 *   razaId: number, razaNombre: string,
 *   fechaPublicacion: string, fotos: string[]
 * }>>}
 */
export async function obtenerPublicaciones() {
  const { data } = await apiClient.get('/api/publicaciones')
  return data
}

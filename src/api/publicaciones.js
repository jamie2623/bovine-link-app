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

export async function crearPublicacion(publicacion, fotos) {
  const form = new FormData()
  form.append('publicacion', new Blob([JSON.stringify(publicacion)], { type: 'application/json' }))
  fotos.forEach(foto => form.append('fotos', foto))
  const { data } = await apiClient.post('/api/publicaciones', form, { headers: { 'Content-Type': undefined } })
  return data
}

export async function obtenerPublicacion(id) {
  const { data } = await apiClient.get(`/api/publicaciones/${encodeURIComponent(id)}`)
  return data
}

export async function obtenerMisPublicaciones() {
  const { data } = await apiClient.get('/api/publicaciones/mias')
  return data
}
export async function actualizarPublicacion(id, publicacion) {
  const { data } = await apiClient.put(`/api/publicaciones/${id}`, publicacion)
  return data
}
export async function eliminarPublicacion(id) {
  await apiClient.delete(`/api/publicaciones/${id}`)
}

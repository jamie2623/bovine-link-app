import { apiClient } from './client'

/** Arma el objeto de query params, omitiendo los filtros vacios. */
function construirParams({ desde, hasta, estado } = {}) {
  const params = {}
  if (desde) params.desde = desde
  if (hasta) params.hasta = hasta
  if (estado) params.estado = estado
  return params
}

/**
 * GET /api/reportes?desde=&hasta=&estado=
 * @param {{ desde?: string, hasta?: string, estado?: string }} filtros  fechas en formato yyyy-MM-dd
 * @returns {Promise<Array<{
 *   id: number, titulo: string, raza: string, precio: number, ubicacion: string,
 *   estado: 'en_venta' | 'vendido', vendedor: string, fechaPublicacion: string
 * }>>}
 */
export async function obtenerReporte(filtros) {
  const { data } = await apiClient.get('/api/reportes', { params: construirParams(filtros) })
  return data
}

/**
 * GET /api/reportes/exportar-pdf?desde=&hasta=&estado=
 * Descarga el PDF directamente en el navegador.
 */
export async function descargarReportePdf(filtros) {
  const respuesta = await apiClient.get('/api/reportes/exportar-pdf', {
    params: construirParams(filtros),
    responseType: 'blob',
  })

  const disposition = respuesta.headers['content-disposition'] ?? ''
  const match = disposition.match(/filename="?([^";]+)"?/i)
  const nombre = match?.[1] ?? `reporte-publicaciones-${new Date().toISOString().slice(0, 10)}.pdf`

  const url = URL.createObjectURL(new Blob([respuesta.data], { type: 'application/pdf' }))
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombre
  document.body.appendChild(enlace)
  enlace.click()
  enlace.remove()
  URL.revokeObjectURL(url)
}

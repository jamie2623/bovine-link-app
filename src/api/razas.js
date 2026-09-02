import { apiClient } from './client'

/**
 * GET /api/razas  (publico)
 * @returns {Promise<Array<{ id: number, nombre: string, categoria: 'leche' | 'carne' | 'doble_proposito' }>>}
 */
export async function obtenerRazas() {
  const { data } = await apiClient.get('/api/razas')
  return data
}

/** Etiquetas legibles para las categorias de raza. */
export const CATEGORIAS_RAZA = [
  { valor: 'leche', titulo: 'Ganado Lechero' },
  { valor: 'carne', titulo: 'Ganado de Carne' },
  { valor: 'doble_proposito', titulo: 'Doble Proposito y Criollo' },
]

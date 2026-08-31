// Helpers de formato. El Salvador usa USD y fechas dd/MM/yyyy.

const monedaUSD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const fechaCorta = new Intl.DateTimeFormat('es-SV', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

/** 1500 -> "$1,500.00" */
export function formatoMoneda(valor) {
  const n = Number(valor)
  return Number.isFinite(n) ? monedaUSD.format(n) : '—'
}

/** "2026-08-12T10:15:00" -> "12/08/2026" */
export function formatoFecha(iso) {
  if (!iso) return '—'
  const fecha = new Date(iso)
  return Number.isNaN(fecha.getTime()) ? '—' : fechaCorta.format(fecha)
}

/** 1234 -> "1,234" */
export function formatoNumero(valor) {
  const n = Number(valor)
  return Number.isFinite(n) ? n.toLocaleString('en-US') : '0'
}

const ETIQUETAS_ESTADO = {
  en_venta: 'EN VENTA',
  vendido: 'VENDIDO',
}

/** "en_venta" -> "EN VENTA" */
export function etiquetaEstado(estado) {
  if (!estado) return '—'
  return ETIQUETAS_ESTADO[estado] ?? String(estado).replace(/_/g, ' ').toUpperCase()
}

/** Clase CSS para el "pill" de estado. */
export function claseEstado(estado) {
  return estado === 'vendido' ? 'pill pill--vendido' : 'pill pill--en-venta'
}

const OPCIONES_ESTADO = [
  { valor: '', texto: 'Todos' },
  { valor: 'en_venta', texto: 'En venta' },
  { valor: 'vendido', texto: 'Vendido' },
]

/**
 * Barra de filtros del reporte. Es controlada: el estado vive en el padre.
 *
 * @param {{
 *   valores: { desde: string, hasta: string, estado: string },
 *   onCambio: (parcial: object) => void,
 *   onFiltrar: () => void,
 *   onExportar: () => void,
 *   exportando?: boolean,
 *   cargando?: boolean,
 * }} props
 */
export default function FiltrosReporte({
  valores,
  onCambio,
  onFiltrar,
  onExportar,
  exportando = false,
  cargando = false,
}) {
  return (
    <form
      className="filtros"
      onSubmit={(e) => {
        e.preventDefault()
        onFiltrar()
      }}
    >
      <div className="filtros__campo">
        <label htmlFor="filtro-desde">Desde</label>
        <input
          id="filtro-desde"
          type="date"
          className="campo"
          value={valores.desde}
          max={valores.hasta || undefined}
          onChange={(e) => onCambio({ desde: e.target.value })}
        />
      </div>

      <div className="filtros__campo">
        <label htmlFor="filtro-hasta">Hasta</label>
        <input
          id="filtro-hasta"
          type="date"
          className="campo"
          value={valores.hasta}
          min={valores.desde || undefined}
          onChange={(e) => onCambio({ hasta: e.target.value })}
        />
      </div>

      <div className="filtros__campo">
        <label htmlFor="filtro-estado">Estado</label>
        <select
          id="filtro-estado"
          className="campo"
          value={valores.estado}
          onChange={(e) => onCambio({ estado: e.target.value })}
        >
          {OPCIONES_ESTADO.map((op) => (
            <option key={op.valor} value={op.valor}>
              {op.texto}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="boton boton--primario" disabled={cargando}>
        {cargando ? 'Filtrando…' : 'Filtrar'}
      </button>

      <button
        type="button"
        className="boton boton--pdf"
        onClick={onExportar}
        disabled={exportando}
      >
        {exportando ? 'Generando…' : 'Exportar a PDF'}
      </button>
    </form>
  )
}

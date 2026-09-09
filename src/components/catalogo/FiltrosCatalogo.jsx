import { CATEGORIAS_RAZA } from '../../api/razas'

/**
 * Barra lateral de filtros del catalogo: razas (agrupadas por categoria) y rango de precio.
 *
 * @param {{
 *   razas: Array<{id:number, nombre:string, categoria:string}>,
 *   seleccionadas: Set<number>,
 *   onToggleRaza: (id:number) => void,
 *   precioDesde: string, precioHasta: string,
 *   onPrecioChange: (parcial:{desde?:string, hasta?:string}) => void,
 *   onBuscar: () => void,
 * }} props
 */
export default function FiltrosCatalogo({
  razas = [],
  seleccionadas,
  onToggleRaza,
  precioDesde,
  precioHasta,
  onPrecioChange,
  onBuscar,
  onLimpiar,
}) {
  return (
    <aside className="cat-filtros" aria-label="Filtros del catálogo">
      <form onSubmit={(e) => { e.preventDefault(); onBuscar() }}>
      <section className="cat-filtros__bloque">
        <h2 className="cat-filtros__titulo">Razas</h2>

        {CATEGORIAS_RAZA.map((cat) => {
          // Se muestran en orden de id (la migracion V8 los numera en el
          // orden pedido dentro de cada categoria).
          const delGrupo = razas
            .filter((r) => r.categoria === cat.valor)
            .sort((a, b) => a.id - b.id)
          if (delGrupo.length === 0) return null
          return (
            <div key={cat.valor} className="cat-filtros__grupo">
              <h3 className="cat-filtros__grupo-titulo">{cat.titulo}</h3>
              <div className="cat-filtros__chips">
                {delGrupo.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={
                      'cat-chip' + (seleccionadas.has(r.id) ? ' cat-chip--activo' : '')
                    }
                    aria-pressed={seleccionadas.has(r.id)}
                    onClick={() => onToggleRaza(r.id)}
                  >
                    {r.nombre}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      <section className="cat-filtros__bloque">
        <h2 className="cat-filtros__titulo">Precios</h2>
        <div className="cat-filtros__precios">
          <label className="cat-filtros__campo">
            <span>Desde</span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="$0.00"
              className="cat-input"
              value={precioDesde}
              onChange={(e) => onPrecioChange({ desde: e.target.value })}
            />
          </label>
          <label className="cat-filtros__campo">
            <span>Hasta</span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="$0.00"
              className="cat-input"
              value={precioHasta}
              onChange={(e) => onPrecioChange({ hasta: e.target.value })}
            />
          </label>
        </div>
      </section>

      <button type="submit" className="cat-buscar">
        Buscar
      </button>
      <button type="button" className="cat-limpiar" onClick={onLimpiar}>Limpiar filtros</button>
      </form>
    </aside>
  )
}

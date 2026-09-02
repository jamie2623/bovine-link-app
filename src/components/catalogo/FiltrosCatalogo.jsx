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
}) {
  return (
    <aside className="cat-filtros">
      <section className="cat-filtros__bloque">
        <h2 className="cat-filtros__titulo">Razas</h2>

        {CATEGORIAS_RAZA.map((cat) => {
          const delGrupo = razas.filter((r) => r.categoria === cat.valor)
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
              className="cat-input"
              value={precioHasta}
              onChange={(e) => onPrecioChange({ hasta: e.target.value })}
            />
          </label>
        </div>
      </section>

      <button type="button" className="cat-buscar" onClick={onBuscar}>
        Buscar
      </button>
    </aside>
  )
}

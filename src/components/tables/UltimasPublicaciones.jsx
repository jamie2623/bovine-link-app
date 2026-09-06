import {
  claseEstado,
  etiquetaEstado,
  formatoFecha,
  formatoMoneda,
} from '../../utils/formato'

/**
 * Tabla "Últimas publicaciones" del dashboard.
 * Reutiliza los datos de /api/reportes (mismos campos), ordenados por fecha desc.
 *
 * @param {{ filas: Array<object>, limite?: number }} props
 */
export default function UltimasPublicaciones({ filas = [], limite = 5 }) {
  const ultimas = [...filas]
    .sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion))
    .slice(0, limite)

  return (
    <div className="tabla-wrap">
      <table className="tabla">
        <thead>
          <tr>
            <th>Título</th>
            <th>Raza</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {ultimas.length === 0 ? (
            <tr>
              <td colSpan={5} className="tabla__vacio">
                No hay publicaciones registradas.
              </td>
            </tr>
          ) : (
            ultimas.map((fila) => (
              <tr key={fila.id}>
                <td className="tabla__titulo">{fila.titulo}</td>
                <td className="tabla__raza">{fila.raza}</td>
                <td className="precio">{formatoMoneda(fila.precio)}</td>
                <td>
                  <span className={claseEstado(fila.estado)}>{etiquetaEstado(fila.estado)}</span>
                </td>
                <td>{formatoFecha(fila.fechaPublicacion)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

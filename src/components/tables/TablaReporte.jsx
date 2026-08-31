import {
  claseEstado,
  etiquetaEstado,
  formatoFecha,
  formatoMoneda,
} from '../../utils/formato'

/**
 * Tabla del reporte filtrado.
 * @param {{ filas: Array<object> }} props
 */
export default function TablaReporte({ filas = [] }) {
  return (
    <div className="tabla-wrap">
      <table className="tabla">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Vendedor</th>
            <th>Raza</th>
            <th>Precio</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {filas.length === 0 ? (
            <tr>
              <td colSpan={5} className="tabla__vacio">
                No hay registros para los filtros seleccionados.
              </td>
            </tr>
          ) : (
            filas.map((fila) => (
              <tr key={fila.id}>
                <td>{formatoFecha(fila.fechaPublicacion)}</td>
                <td>{fila.vendedor}</td>
                <td className="tabla__raza">{fila.raza}</td>
                <td className="precio">{formatoMoneda(fila.precio)}</td>
                <td>
                  <span className={claseEstado(fila.estado)}>{etiquetaEstado(fila.estado)}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

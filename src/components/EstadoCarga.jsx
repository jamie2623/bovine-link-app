/**
 * Envuelve contenido que depende de una peticion.
 * Muestra "Cargando", el error (con boton reintentar) o los hijos.
 */
export default function EstadoCarga({ cargando, error, onReintentar, children }) {
  if (cargando) {
    return <div className="estado estado--cargando">Cargando…</div>
  }

  if (error) {
    return (
      <div className="estado estado--error">
        <p>{error}</p>
        {onReintentar && (
          <button type="button" className="boton" onClick={onReintentar}>
            Reintentar
          </button>
        )}
      </div>
    )
  }

  return children
}

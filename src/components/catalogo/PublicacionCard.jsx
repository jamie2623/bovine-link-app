import { formatoMoneda } from '../../utils/formato'

/**
 * Card de una publicación en el catálogo. Sin imagen por ahora (solo prueba).
 * @param {{ publicacion: object }} props
 */
export default function PublicacionCard({ publicacion }) {
  const { titulo, descripcion, precio, ubicacion } = publicacion

  const mensaje = encodeURIComponent(`Hola, me interesa tu publicación "${titulo}" en Bovine Link.`)

  return (
    <article className="pub-card">
      <div className="pub-card__imagen" aria-hidden="true">
        <span>Sin imagen</span>
      </div>

      <div className="pub-card__cuerpo">
        <div className="pub-card__meta">
          <span className="pub-card__ubicacion">{ubicacion}</span>
          <span className="pub-card__precio">Precio: {formatoMoneda(precio)}</span>
        </div>

        <h3 className="pub-card__titulo">{titulo}</h3>
        <p className="pub-card__desc">{descripcion}</p>

        <a
          className="pub-card__whatsapp"
          href={`https://wa.me/?text=${mensaje}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Contactar por WhatsApp
        </a>
      </div>
    </article>
  )
}

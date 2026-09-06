import { Link } from 'react-router-dom'
import { API_URL } from '../../config'
import { useState } from 'react'
import { formatoMoneda } from '../../utils/formato'

export default function PublicacionCard({ publicacion }) {
  const { titulo, descripcion, precio, ubicacion, fotos, usuarioTelefono } = publicacion
  const [fotoFallida, setFotoFallida] = useState(null)
  const foto = fotos?.[0]?.startsWith('/api/') ? `${API_URL}${fotos[0]}` : fotos?.[0]
  const digitos = (usuarioTelefono ?? '').replace(/\D/g, '')
  const telefono = digitos.length === 8 ? `503${digitos}` : digitos
  const contactoValido = telefono.length >= 10 && telefono.length <= 15
  const mensaje = encodeURIComponent(`Hola, me interesa tu publicación "${titulo}" en Bovine Link.`)
  return (
    <article className="pub-card">
      <div className="pub-card__imagen">
        {foto && fotoFallida !== foto ? <img src={foto} alt={titulo} loading="lazy" onError={() => setFotoFallida(foto)} /> : <span>Sin fotografía</span>}
      </div>
      <div className="pub-card__cuerpo">
        <div className="pub-card__meta"><span>{ubicacion}</span><span className="pub-card__precio">{formatoMoneda(precio)}</span></div>
        <h3 className="pub-card__titulo"><Link className="pub-card__detalle" to={`/publicaciones/${publicacion.id}`}>{titulo}</Link></h3>
        <p className="pub-card__desc">{descripcion}</p>
        {contactoValido ? <a className="pub-card__whatsapp" href={`https://wa.me/${telefono}?text=${mensaje}`} target="_blank" rel="noopener noreferrer" aria-label={`Contactar por WhatsApp por ${titulo}`}>☏ Contactar por WhatsApp</a> : <span className="pub-card__sin-contacto">Teléfono no disponible</span>}
      </div>
    </article>
  )
}

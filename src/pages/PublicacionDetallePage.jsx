import { useState } from 'react'
import { useParams } from 'react-router-dom'
import EstadoCarga from '../components/EstadoCarga'
import { obtenerPublicacion } from '../api/publicaciones'
import { usePeticion } from '../hooks/usePeticion'
import { formatoMoneda } from '../utils/formato'
import { API_URL } from '../config'

function Foto({ src, alt }) {
  const [fallida, setFallida] = useState(false)
  return src && !fallida ? <img src={src} alt={alt} onError={() => setFallida(true)} /> : <span className="detalle__sin-foto">Fotografía no disponible</span>
}

function Contenido({ publicacion: p }) {
  const [seleccionada, setSeleccionada] = useState(0)
  const fotos = (p.fotos ?? []).filter(Boolean).map(f => f.startsWith('/api/') ? `${API_URL}${f}` : f)
  const digitos = (p.usuarioTelefono ?? '').replace(/\D/g, '')
  const telefono = digitos.length === 8 ? `503${digitos}` : digitos
  const contacto = telefono.length >= 10 && telefono.length <= 15
  const iniciales = (p.usuarioNombre ?? '').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?'
  const mensaje = encodeURIComponent(`Hola, me interesa tu publicación "${p.titulo}" en Bovine Link.`)
  return (
    <div className="detalle__columnas">
      <section className="detalle__galeria" aria-label="Fotografías de la publicación">
        <div className="detalle__principal"><Foto key={fotos[seleccionada] ?? 'vacia'} src={fotos[seleccionada]} alt={`${p.titulo}, foto ${seleccionada + 1}`} /></div>
        {fotos.length > 1 && <div className="detalle__miniaturas">{fotos.map((foto, i) => <button key={`${foto}-${i}`} type="button" aria-label={`Ver foto ${i + 1} de ${p.titulo}`} aria-pressed={seleccionada === i} onClick={() => setSeleccionada(i)}><Foto src={foto} alt={`Foto ${i + 1}`} /></button>)}</div>}
      </section>
      <section className="detalle__informacion" aria-label="Información del ganado">
        <span className="detalle__raza">{p.razaNombre}</span>
        <h1>{p.titulo}</h1>
        <p className="detalle__precio">{formatoMoneda(p.precio)}</p>
        {p.estado === 'vendido' && <p className="detalle__vendido">Vendido</p>}
        <p className="detalle__ubicacion"><svg width="23" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>{p.ubicacion}</p>
        <p className="detalle__descripcion">{p.descripcion}</p>
        <div className="detalle__vendedor"><span className="detalle__avatar" aria-hidden="true">{iniciales}</span><div><small>Publicado por</small><h2>{p.usuarioNombre || 'Vendedor'}</h2></div></div>
        {contacto && p.estado !== 'vendido' ? <a className="detalle__whatsapp" href={`https://wa.me/${telefono}?text=${mensaje}`} target="_blank" rel="noopener noreferrer"><svg width="38" height="38" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M27 15a12 12 0 0 1-18 11L3 28l2-6A12 12 0 1 1 27 15Z"/><path d="M11 9c-4 3 6 14 10 10l-3-3-2 1-3-3 1-2Z"/></svg>Contactar por WhatsApp</a> : <p className="detalle__contacto-aviso">{p.estado === 'vendido' ? 'Esta publicación ya no está disponible para la venta.' : 'El vendedor no tiene un teléfono de contacto disponible.'}</p>}
      </section>
    </div>
  )
}

export default function PublicacionDetallePage() {
  const { id } = useParams()
  const { datos, cargando, error, recargar } = usePeticion(() => obtenerPublicacion(id), [id])
  return <main className="detalle"><EstadoCarga cargando={cargando} error={error === 'Network Error' ? 'No se pudo conectar con el servidor. Intenta de nuevo.' : error} onReintentar={recargar}>{datos && <Contenido key={datos.id} publicacion={datos} />}</EstadoCarga></main>
}

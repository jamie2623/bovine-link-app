import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import EstadoCarga from '../components/EstadoCarga'
import { obtenerMisPublicaciones, actualizarPublicacion, eliminarPublicacion } from '../api/publicaciones'
import { obtenerRazas } from '../api/razas'
import { usePeticion, mensajeDeError } from '../hooks/usePeticion'
import { formatoMoneda } from '../utils/formato'
import { alertaError, alertaExito } from '../utils/alertas'
import { API_URL } from '../config'

function Icono({ eliminar = false }) {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{eliminar ? <><path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7" /></> : <><path d="m14 5 4 4M4 20l5-1L21 7a2.8 2.8 0 0 0-4-4L5 15l-1 5ZM12 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-7" /></>}</svg>
}
function Foto({ publicacion: p }) {
  const [fallida, setFallida] = useState(false)
  const foto = p.fotos?.[0]
  return <Link to={`/publicaciones/${p.id}`} className="mis__foto" aria-label={`Ver ${p.titulo}`}>{foto && !fallida ? <img src={foto.startsWith('/api/') ? `${API_URL}${foto}` : foto} alt={p.titulo} onError={() => setFallida(true)} /> : <span>Sin fotografía</span>}{p.estado === 'vendido' && <span className="mis__vendido">Vendido</span>}</Link>
}
function Dialogo({ accion, cerrar, completado }) {
  const ref = useRef(null)
  const bloqueo = useRef(false)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')
  const [campos, setCampos] = useState(() => ({ titulo: accion.p.titulo, descripcion: accion.p.descripcion, precio: accion.p.precio, ubicacion: accion.p.ubicacion, razaId: accion.p.razaId, estado: accion.p.estado, fotos: accion.p.fotos ?? [] }))
  const { datos: razas, error: errorRazas, cargando, recargar } = usePeticion(() => accion.tipo === 'editar' ? obtenerRazas() : Promise.resolve([]), [])
  useEffect(() => { const dialogo = ref.current; dialogo.showModal(); return () => dialogo.close() }, [])
  const cambiar = e => setCampos(c => ({ ...c, [e.target.name]: e.target.value }))
  const guardar = async e => {
    e.preventDefault()
    if (bloqueo.current) return
    if (accion.tipo === 'editar' && (!campos.titulo.trim() || !campos.descripcion.trim() || !campos.ubicacion.trim())) return setError('Completa todos los campos.')
    bloqueo.current = true; setOcupado(true); setError('')
    try {
      if (accion.tipo === 'eliminar') await eliminarPublicacion(accion.p.id)
      else await actualizarPublicacion(accion.p.id, { ...campos, titulo: campos.titulo.trim(), descripcion: campos.descripcion.trim(), ubicacion: campos.ubicacion.trim(), precio: Number(campos.precio), razaId: Number(campos.razaId) })
      completado(accion.tipo === 'eliminar' ? 'Publicación eliminada.' : 'Cambios guardados.')
    } catch (err) {
      const msg = mensajeDeError(err, 'No se pudo guardar el cambio.')
      setError(msg)
      alertaError(msg)
    }
    finally { bloqueo.current = false; setOcupado(false) }
  }
  return <dialog ref={ref} className="mis__dialogo" aria-labelledby="mis-dialogo-titulo" onCancel={e => { e.preventDefault(); if (!bloqueo.current) cerrar() }}><form onSubmit={guardar}>
    <h2 id="mis-dialogo-titulo">{accion.tipo === 'editar' ? 'Editar publicación' : 'Eliminar publicación'}</h2>
    {accion.tipo === 'eliminar' ? <p>¿Eliminar “{accion.p.titulo}”? Esta acción no se puede deshacer.</p> : <fieldset disabled={ocupado}>
      <label>Título<input name="titulo" value={campos.titulo} onChange={cambiar} required maxLength={150} /></label>
      <label>Raza<select name="razaId" value={campos.razaId} onChange={cambiar} required disabled={cargando || !!errorRazas}>{!razas && <option value={campos.razaId}>{accion.p.razaNombre}</option>}{razas?.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}</select></label>
      {errorRazas && <p role="alert">No se pudieron cargar las razas. <button type="button" onClick={recargar}>Reintentar</button></p>}
      <label>Descripción<textarea name="descripcion" value={campos.descripcion} onChange={cambiar} required maxLength={5000} rows={4} /></label>
      <label>Precio ($)<input name="precio" type="number" value={campos.precio} onChange={cambiar} min="0.01" max="9999999999.99" step="0.01" required /></label>
      <label>Ubicación<input name="ubicacion" value={campos.ubicacion} onChange={cambiar} required maxLength={150} /></label>
      <label>Estado<select name="estado" value={campos.estado} onChange={cambiar}><option value="en_venta">En venta</option><option value="vendido">Vendido</option></select></label>
    </fieldset>}
    {error && <p role="alert" className="mis__error">{error}</p>}
    <div className="mis__dialogo-acciones"><button type="button" onClick={cerrar} disabled={ocupado}>Cancelar</button><button type="submit" className={accion.tipo === 'eliminar' ? 'mis__confirmar-eliminar' : 'mis__guardar'} disabled={ocupado || (accion.tipo === 'editar' && (cargando || !!errorRazas))}>{ocupado ? 'Guardando…' : accion.tipo === 'eliminar' ? 'Eliminar' : 'Guardar cambios'}</button></div>
  </form></dialog>
}
export default function MisPublicacionesPage() {
  const { datos, cargando, error, recargar } = usePeticion(obtenerMisPublicaciones, [])
  const [seleccion, setSeleccion] = useState('todos')
  const [filtro, setFiltro] = useState('todos')
  const [accion, setAccion] = useState(null)
  const visibles = (datos ?? []).filter(p => filtro === 'todos' || p.estado === filtro)
  return <main className="mis">
    <div className="mis__cabecera"><form className="mis__filtro" onSubmit={e => { e.preventDefault(); setFiltro(seleccion) }}><select aria-label="Estado de las publicaciones" value={seleccion} onChange={e => setSeleccion(e.target.value)}><option value="todos">Todos</option><option value="vendido">Vendidos</option><option value="en_venta">En venta</option></select><button type="submit">Filtrar</button></form><h1>Mis<br />publicaciones</h1><Link className="mis__publicar" to="/publicar">+ Publicar</Link></div>
    <EstadoCarga cargando={cargando} error={error === 'Network Error' ? 'No se pudo conectar con el servidor. Intenta de nuevo.' : error} onReintentar={recargar}>
      {visibles.length ? <div className="mis__tabla-scroll"><table className="mis__tabla"><caption className="mis__sr">Tus publicaciones: {filtro === 'todos' ? 'todos los estados' : filtro === 'vendido' ? 'vendidos' : 'en venta'}</caption><thead><tr>{['Foto', 'Título', 'Descripción', 'Precio', 'Ubicación', 'Acciones'].map(t => <th key={t} scope="col">{t}</th>)}</tr></thead><tbody>{visibles.map(p => <tr key={p.id}>
        <td><Foto key={p.fotos?.[0]} publicacion={p} /></td><td><Link to={`/publicaciones/${p.id}`}>{p.titulo}</Link></td><td><p className="mis__descripcion">{p.descripcion}</p></td><td className="mis__precio">{formatoMoneda(p.precio)}</td><td>{p.ubicacion}</td><td><div className="mis__acciones"><button type="button" aria-label={`Editar ${p.titulo}`} onClick={() => setAccion({ tipo: 'editar', p })}><Icono /></button><button type="button" className="mis__eliminar" aria-label={`Eliminar ${p.titulo}`} onClick={() => setAccion({ tipo: 'eliminar', p })}><Icono eliminar /></button></div></td>
      </tr>)}</tbody></table></div> : <div className="mis__vacio"><p>{datos?.length ? 'No tienes publicaciones con este estado.' : 'Todavía no tienes publicaciones.'}</p><Link to="/publicar">Publicar ganado</Link></div>}
    </EstadoCarga>
    {accion && <Dialogo accion={accion} cerrar={() => setAccion(null)} completado={mensaje => { setAccion(null); alertaExito(mensaje); recargar() }} />}
  </main>
}

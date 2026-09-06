import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { obtenerRazas, CATEGORIAS_RAZA } from '../api/razas'
import { crearPublicacion } from '../api/publicaciones'
import { mensajeDeError, usePeticion } from '../hooks/usePeticion'

export default function PublicarPage() {
  const navigate = useNavigate()
  const { datos: razas, cargando, error: errorRazas, recargar } = usePeticion(obtenerRazas, [])
  const [campos, setCampos] = useState({ titulo: '', razaId: '', precio: '', ubicacion: '', descripcion: '' })
  const [fotos, setFotos] = useState([])
  const fotosRef = useRef([])
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const bloqueo = useRef(false)
  useEffect(() => () => fotosRef.current.forEach(f => URL.revokeObjectURL(f.url)), [])
  const cambiar = e => setCampos(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const agregar = e => {
    const archivos = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (fotos.length + archivos.length > 5) return setError('Puedes subir un máximo de 5 imágenes.')
    if (archivos.some(f => !['image/jpeg', 'image/png'].includes(f.type))) return setError('Selecciona solamente imágenes JPG o PNG.')
    if (archivos.some(f => f.size > 5 * 1024 * 1024 || f.size === 0)) return setError('Cada imagen debe pesar entre 1 byte y 5 MB.')
    const siguientes = [...fotos, ...archivos.map(file => ({ file, url: URL.createObjectURL(file) }))]
    fotosRef.current = siguientes
    setFotos(siguientes); setError('')
  }
  const quitar = url => {
    URL.revokeObjectURL(url)
    const siguientes = fotos.filter(f => f.url !== url)
    fotosRef.current = siguientes; setFotos(siguientes)
  }
  const publicar = async e => {
    e.preventDefault()
    if (bloqueo.current) return
    if (!campos.titulo.trim() || !campos.ubicacion.trim() || !campos.descripcion.trim()) return setError('Completa los campos con información del animal.')
    bloqueo.current = true; setEnviando(true); setError('')
    try {
      await crearPublicacion({ ...campos, titulo: campos.titulo.trim(), ubicacion: campos.ubicacion.trim(), descripcion: campos.descripcion.trim(), razaId: Number(campos.razaId), precio: Number(campos.precio) }, fotos.map(f => f.file))
      navigate('/catalogo', { state: { publicacionCreada: true } })
    } catch (err) {
      setError(err.response?.status === 413 ? 'Las imágenes superan el tamaño permitido (5 MB por foto).' : mensajeDeError(err, 'No se pudo publicar. Intenta de nuevo.'))
    } finally { bloqueo.current = false; setEnviando(false) }
  }
  return (
    <main className="publicar">
      <form className="publicar__form" onSubmit={publicar}>
        <fieldset className="publicar__datos" disabled={enviando}>
          <h1>Publicar ganado</h1>
          <label className="publicar__campo">Título<input autoFocus name="titulo" value={campos.titulo} onChange={cambiar} maxLength={150} required /></label>
          <label className="publicar__campo publicar__raza">Raza<select name="razaId" value={campos.razaId} onChange={cambiar} required disabled={cargando || !!errorRazas}>
            <option value="">{cargando ? 'Cargando razas…' : 'Seleccionar raza'}</option>
            {CATEGORIAS_RAZA.map(c => <optgroup key={c.valor} label={c.titulo}>{(razas ?? []).filter(r => r.categoria === c.valor).map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}</optgroup>)}
          </select></label>
          {errorRazas && <div role="alert" className="publicar__error">No se pudieron cargar las razas. <button type="button" onClick={recargar}>Reintentar</button></div>}
          <label className="publicar__campo">Precio<div className="publicar__precio"><span aria-hidden="true">$</span><input aria-label="Precio en dólares" name="precio" type="number" min="0.01" max="9999999999.99" step="0.01" value={campos.precio} onChange={cambiar} required /></div></label>
          <label className="publicar__campo">Ubicación<input name="ubicacion" placeholder="Departamento/pueblo, etc." value={campos.ubicacion} onChange={cambiar} maxLength={150} required /></label>
          <label className="publicar__campo">Descripción<textarea name="descripcion" placeholder="Escribe la descripción del animal…" value={campos.descripcion} onChange={cambiar} maxLength={5000} required rows={6} /></label>
        </fieldset>
        <fieldset className="publicar__fotos" disabled={enviando}>
          <h2>Fotos</h2>
          <label className="publicar__subir">
            <input type="file" accept="image/jpeg,image/png" multiple onChange={agregar} disabled={enviando || fotos.length === 5} aria-label="Subir fotos JPG o PNG, máximo 5 imágenes" />
            <svg width="76" height="90" viewBox="0 0 76 90" aria-hidden="true"><path fill="currentColor" d="M12 0h34l24 24v56a10 10 0 0 1-10 10H12A10 10 0 0 1 2 80V10A10 10 0 0 1 12 0Zm28 10v22h22ZM17 77h40L43 52 31 67 24 58Zm4-29a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" /></svg>
            <strong>Subir fotos<br />(JPG, PNG)<br />Máx. 5 imágenes</strong>
            <small>Hasta 5 MB por imagen</small>
          </label>
          <div className="publicar__miniaturas">{fotos.map((f, i) => <div key={f.url}><img src={f.url} alt={`Vista previa ${i + 1}: ${f.file.name}`} /><button type="button" onClick={() => quitar(f.url)} aria-label={`Quitar foto ${i + 1}`}>×</button></div>)}</div>
          <p className="publicar__contador" role="status">{fotos.length} de 5 fotos seleccionadas</p>
          {error && <p className="publicar__error" role="alert">{error}</p>}
          <div className="publicar__acciones"><button className="publicar__cancelar" type="button" onClick={() => navigate('/catalogo')}>Cancelar</button><button className="publicar__guardar" type="submit" disabled={enviando || cargando || !!errorRazas}>{enviando ? 'Publicando…' : 'Publicar ganado'}</button></div>
        </fieldset>
      </form>
    </main>
  )
}

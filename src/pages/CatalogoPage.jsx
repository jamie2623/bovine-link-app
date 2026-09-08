import { useMemo, useState } from 'react'
import EstadoCarga from '../components/EstadoCarga'
import FiltrosCatalogo from '../components/catalogo/FiltrosCatalogo'
import PublicacionCard from '../components/catalogo/PublicacionCard'
import { obtenerPublicaciones } from '../api/publicaciones'
import { obtenerRazas } from '../api/razas'
import { usePeticion } from '../hooks/usePeticion'

async function cargarCatalogo() {
  const [publicaciones, razas] = await Promise.all([obtenerPublicaciones(), obtenerRazas()])
  return { publicaciones, razas }
}

export default function CatalogoPage() {
  const { datos, cargando, error, recargar } = usePeticion(cargarCatalogo, [])
  const [razasSel, setRazasSel] = useState(() => new Set())
  const [precioDesde, setPrecioDesde] = useState('')
  const [precioHasta, setPrecioHasta] = useState('')
  const [aviso, setAviso] = useState('')
  const [aplicados, setAplicados] = useState({ razas: new Set(), desde: '', hasta: '' })
  // Las razas se aplican al instante: al hacer clic en un chip se filtra sin
  // tocar "Buscar". Ese botón queda solo para el rango de precios.
  const toggleRaza = (id) => {
    const next = new Set(razasSel)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setRazasSel(next)
    setAplicados(a => ({ ...a, razas: next }))
  }
  const buscar = () => {
    if (precioDesde !== '' && precioHasta !== '' && Number(precioDesde) > Number(precioHasta)) {
      setAviso('El precio desde no puede ser mayor que el precio hasta.')
      return
    }
    setAviso('')
    setAplicados(a => ({ ...a, desde: precioDesde, hasta: precioHasta }))
  }
  const limpiar = () => {
    setRazasSel(new Set()); setPrecioDesde(''); setPrecioHasta(''); setAviso('')
    setAplicados({ razas: new Set(), desde: '', hasta: '' })
  }
  const visibles = useMemo(() => (datos?.publicaciones ?? []).filter(p =>
    p.estado === 'en_venta' &&
    (!aplicados.razas.size || aplicados.razas.has(p.razaId)) &&
    (aplicados.desde === '' || Number(p.precio) >= Number(aplicados.desde)) &&
    (aplicados.hasta === '' || Number(p.precio) <= Number(aplicados.hasta))
  ), [datos, aplicados])
  return (
    <div className="cat__layout">
      <FiltrosCatalogo razas={datos?.razas ?? []} seleccionadas={razasSel}
        onToggleRaza={toggleRaza} precioDesde={precioDesde} precioHasta={precioHasta}
        onPrecioChange={({ desde, hasta }) => {
          if (desde !== undefined) setPrecioDesde(desde)
          if (hasta !== undefined) setPrecioHasta(hasta)
        }} onBuscar={buscar} onLimpiar={limpiar} />
      <main className="cat__main">
        <h1 className="cat__titulo">Catálogo</h1>
        <section className="cat-hero">
          <div className="cat-hero__texto">
            <h2>Conectando ganaderos, impulsando tu negocio.</h2>
            <p>La forma más fácil de vender y comprar ganado.<br />Sin intermediarios, de forma directa.</p>
          </div>
          <img className="cat-hero__foto" src="/demo/ganado-1.jpg" alt="Ganado en el campo" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/logo.png' }} />
        </section>
        {aviso && <p className="cat__aviso" role="alert">{aviso}</p>}
        <EstadoCarga cargando={cargando} error={error === 'Network Error' ? 'No se pudo conectar con el servidor. Verifica que el backend esté iniciado y vuelve a intentar.' : error} onReintentar={recargar}>
          <p className="cat__resultados" role="status">{visibles.length} publicaciones disponibles</p>
          {visibles.length ? <div className="cat-grid">{visibles.map(p => <PublicacionCard key={p.id} publicacion={p} />)}</div> :
            <div className="cat__vacio"><p>No hay publicaciones que coincidan con los filtros.</p><button className="cat-limpiar" onClick={limpiar}>Ver todas las publicaciones</button></div>}
        </EstadoCarga>
      </main>
    </div>
  )
}


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
  const [aplicados, setAplicados] = useState({ razas: new Set(), desde: '', hasta: '' })

  const toggleRaza = (id) => {
    setRazasSel((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const buscar = () =>
    setAplicados({ razas: new Set(razasSel), desde: precioDesde, hasta: precioHasta })

  const visibles = useMemo(() => {
    const lista = datos?.publicaciones ?? []
    const desde = aplicados.desde !== '' ? Number(aplicados.desde) : null
    const hasta = aplicados.hasta !== '' ? Number(aplicados.hasta) : null
    return lista.filter((p) => {
      if (p.estado !== 'en_venta') return false
      if (aplicados.razas.size > 0 && !aplicados.razas.has(p.razaId)) return false
      if (desde != null && Number(p.precio) < desde) return false
      if (hasta != null && Number(p.precio) > hasta) return false
      return true
    })
  }, [datos, aplicados])

  return (
    <div className="cat__layout">
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        {datos && (
          <>
            <FiltrosCatalogo
              razas={datos.razas}
              seleccionadas={razasSel}
              onToggleRaza={toggleRaza}
              precioDesde={precioDesde}
              precioHasta={precioHasta}
              onPrecioChange={({ desde, hasta }) => {
                if (desde !== undefined) setPrecioDesde(desde)
                if (hasta !== undefined) setPrecioHasta(hasta)
              }}
              onBuscar={buscar}
            />

            <main className="cat__main">
              <h1 className="cat__titulo">Catálogo</h1>

              <section className="cat-hero">
                <div className="cat-hero__texto">
                  <h2>Conectando ganaderos, impulsando tu negocio.</h2>
                  <p>
                    La forma más fácil de vender y comprar ganado. Sin intermediarios, de forma
                    directa.
                  </p>
                </div>
              </section>

              {visibles.length === 0 ? (
                <p className="cat__vacio">No hay publicaciones que coincidan con los filtros.</p>
              ) : (
                <div className="cat-grid">
                  {visibles.map((p) => (
                    <PublicacionCard key={p.id} publicacion={p} />
                  ))}
                </div>
              )}
            </main>
          </>
        )}
      </EstadoCarga>
    </div>
  )
}

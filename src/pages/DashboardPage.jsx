import BarrasPorUbicacion from '../components/charts/BarrasPorUbicacion'
import PastelPorRaza from '../components/charts/PastelPorRaza'
import EstadoCarga from '../components/EstadoCarga'
import StatCard from '../components/StatCard'
import UltimasPublicaciones from '../components/tables/UltimasPublicaciones'
import { obtenerPorRaza, obtenerPorUbicacion, obtenerResumen } from '../api/dashboard'
import { obtenerReporte } from '../api/reportes'
import { usePeticion } from '../hooks/usePeticion'
import { formatoMoneda, formatoNumero } from '../utils/formato'

async function cargarDashboard() {
  const [resumen, porUbicacion, porRaza, publicaciones] = await Promise.all([
    obtenerResumen(),
    obtenerPorUbicacion(),
    obtenerPorRaza(),
    obtenerReporte(),
  ])
  return { resumen, porUbicacion, porRaza, publicaciones }
}

export default function DashboardPage() {
  const { datos, cargando, error, recargar } = usePeticion(cargarDashboard, [])

  return (
    <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
      {datos && (
        <>
          <section className="tarjetas">
            <StatCard
              label="Total publicaciones"
              valor={formatoNumero(datos.resumen.totalPublicaciones)}
              extra={`${formatoNumero(datos.resumen.publicacionesEnVenta)} a la venta`}
            />
            <StatCard
              label="Usuarios registrados"
              valor={formatoNumero(datos.resumen.usuariosRegistrados)}
            />
            <StatCard
              label="Ganado vendido"
              valor={formatoNumero(datos.resumen.ganadoVendido)}
              extra={`${formatoMoneda(datos.resumen.montoTotalVendido)} en ventas`}
            />
          </section>

          <section className="graficos">
            <div className="recuadro">
              <h2 className="recuadro__titulo">Publicaciones por ubicación</h2>
              <div className="recuadro__cuerpo">
                <BarrasPorUbicacion datos={datos.porUbicacion} />
              </div>
            </div>

            <div className="recuadro">
              <h2 className="recuadro__titulo">Distribución de ganado por raza</h2>
              <div className="recuadro__cuerpo">
                <PastelPorRaza datos={datos.porRaza} />
              </div>
            </div>
          </section>

          <section className="recuadro recuadro--tabla">
            <h2 className="recuadro__titulo">Últimas publicaciones</h2>
            <UltimasPublicaciones filas={datos.publicaciones} limite={5} />
          </section>
        </>
      )}
    </EstadoCarga>
  )
}

import { useCallback, useState } from 'react'

import EstadoCarga from '../components/EstadoCarga'
import FiltrosReporte from '../components/reportes/FiltrosReporte'
import TablaReporte from '../components/tables/TablaReporte'
import { descargarReportePdf, obtenerReporte } from '../api/reportes'
import { usePeticion, mensajeDeError } from '../hooks/usePeticion'

const FILTROS_VACIOS = { desde: '', hasta: '', estado: '' }

export default function ReportesPage() {
  // `filtros` = lo que el usuario esta editando; `aplicados` = lo que se consulto.
  const [filtros, setFiltros] = useState(FILTROS_VACIOS)
  const [aplicados, setAplicados] = useState(FILTROS_VACIOS)
  const [exportando, setExportando] = useState(false)
  const [errorPdf, setErrorPdf] = useState(null)

  const consultar = useCallback(() => obtenerReporte(aplicados), [aplicados])
  const { datos, cargando, error, recargar } = usePeticion(consultar, [aplicados])

  const actualizarFiltro = (parcial) => setFiltros((prev) => ({ ...prev, ...parcial }))

  const exportar = async () => {
    setExportando(true)
    setErrorPdf(null)
    try {
      await descargarReportePdf(aplicados)
    } catch (e) {
      setErrorPdf(mensajeDeError(e, 'No se pudo generar el PDF'))
    } finally {
      setExportando(false)
    }
  }

  return (
    <>
      <h1 className="reporte-titulo">Reporte de ganado publicado / vendido</h1>

      <FiltrosReporte
        valores={filtros}
        onCambio={actualizarFiltro}
        onFiltrar={() => setAplicados(filtros)}
        onExportar={exportar}
        exportando={exportando}
        cargando={cargando}
      />

      {errorPdf && <div className="auth__error">{errorPdf}</div>}

      <section className="recuadro recuadro--tabla">
        <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
          <TablaReporte filas={datos ?? []} />
        </EstadoCarga>
      </section>
    </>
  )
}

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const EJE = { fill: '#8b93a7', fontSize: 11 }

/**
 * @param {{ datos: Array<{ etiqueta: string, total: number }> }} props
 */
export default function BarrasPorUbicacion({ datos = [] }) {
  const data = datos.map((d) => ({ ubicacion: d.etiqueta, total: Number(d.total) }))

  if (data.length === 0) {
    return <p className="tabla__vacio">Sin datos de ubicacion.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -12 }}>
        <CartesianGrid stroke="#26314c" vertical={false} />
        <XAxis dataKey="ubicacion" tick={EJE} tickLine={false} axisLine={{ stroke: '#26314c' }} interval={0} />
        <YAxis allowDecimals={false} tick={EJE} tickLine={false} axisLine={{ stroke: '#26314c' }} />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          contentStyle={{
            background: '#111725',
            border: '1px solid #26314c',
            borderRadius: 8,
            color: '#e7e9f0',
          }}
          labelStyle={{ color: '#c9a24b' }}
        />
        <Bar dataKey="total" name="Publicaciones" fill="#82b1e0" radius={[3, 3, 0, 0]} maxBarSize={54} />
      </BarChart>
    </ResponsiveContainer>
  )
}

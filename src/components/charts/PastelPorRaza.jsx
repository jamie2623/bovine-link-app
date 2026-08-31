import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORES = [
  '#e5595b',
  '#6f9fd8',
  '#9aa3b2',
  '#8b7fd0',
  '#5fbf8f',
  '#e39a4a',
  '#d98cc0',
  '#63c7c1',
]

/**
 * @param {{ datos: Array<{ etiqueta: string, total: number }> }} props
 */
export default function PastelPorRaza({ datos = [] }) {
  const data = datos.map((d) => ({ name: d.etiqueta, value: Number(d.total) }))
  const total = data.reduce((acc, d) => acc + d.value, 0)

  if (total === 0) {
    return <p className="tabla__vacio">Sin datos de razas.</p>
  }

  const porcentaje = (v) => ((v / total) * 100).toFixed(1)

  return (
    <div className="pastel">
      <div className="pastel__grafico">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} stroke="#0d1120">
              {data.map((entrada, i) => (
                <Cell key={entrada.name} fill={COLORES[i % COLORES.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} (${porcentaje(value)}%)`, name]}
              contentStyle={{
                background: '#111725',
                border: '1px solid #26314c',
                borderRadius: 8,
                color: '#e7e9f0',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="pastel__leyenda">
        {data.map((entrada, i) => (
          <li key={entrada.name}>
            <span className="pastel__punto" style={{ background: COLORES[i % COLORES.length] }} />
            <span className="pastel__nombre">{entrada.name}</span>
            <span className="pastel__pct">({porcentaje(entrada.value)}%)</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

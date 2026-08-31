export default function StatCard({ label, valor, extra }) {
  return (
    <article className="tarjeta">
      <div className="tarjeta__label">{label}</div>
      <div className="tarjeta__valor">{valor}</div>
      {extra && <div className="tarjeta__extra">{extra}</div>}
    </article>
  )
}

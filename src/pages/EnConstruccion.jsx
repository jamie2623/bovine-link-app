/** Placeholder para vistas que todavía no existen (Publicar, Mis publicaciones). */
export default function EnConstruccion({ titulo = 'Sección' }) {
  return (
    <div className="en-construccion">
      <h1>{titulo}</h1>
      <p>Esta sección todavía no está implementada.</p>
    </div>
  )
}

/** Placeholder para vistas que todavia no existen (Publicar, Mis publicaciones). */
export default function EnConstruccion({ titulo = 'Seccion' }) {
  return (
    <div className="en-construccion">
      <h1>{titulo}</h1>
      <p>Esta seccion todavia no esta implementada.</p>
    </div>
  )
}

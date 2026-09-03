import { useEffect, useRef, useState } from 'react'

import { LOGO_FALLBACK, LOGO_URL } from '../../config'

/**
 * Marco compartido por Login y Registro.
 * Pantallas anchas: video a la izquierda (mitad) + tarjeta a la derecha (mitad).
 * Pantallas angostas: el video se oculta y queda solo la tarjeta centrada.
 *
 * @param {{
 *   titulo: string, subtitulo: string,
 *   children: React.ReactNode, pie: React.ReactNode,
 *   video?: string
 * }} props
 */
export default function AuthLayout({ titulo, subtitulo, children, pie, video }) {
  const videoRef = useRef(null)
  const [listo, setListo] = useState(false)

  // Solo montamos el <video> (y por lo tanto se descarga) si:
  //  - la pantalla es ancha (en angostas no hay panel de video)
  //  - el usuario NO pidio "reducir movimiento"
  const consulta = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(min-width: 901px)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [aplicaVideo, setAplicaVideo] = useState(consulta)
  useEffect(() => {
    const mqAncho = window.matchMedia('(min-width: 901px)')
    const mqMovim = window.matchMedia('(prefers-reduced-motion: reduce)')
    const actualizar = () => setAplicaVideo(mqAncho.matches && !mqMovim.matches)
    mqAncho.addEventListener('change', actualizar)
    mqMovim.addEventListener('change', actualizar)
    return () => {
      mqAncho.removeEventListener('change', actualizar)
      mqMovim.removeEventListener('change', actualizar)
    }
  }, [])

  const mostrarVideo = Boolean(video) && aplicaVideo

  // Algunos navegadores no arrancan el autoplay solo aunque este muteado.
  useEffect(() => {
    if (!mostrarVideo) return
    const el = videoRef.current
    if (el) el.play().catch(() => {})
  }, [mostrarVideo])

  return (
    <div className={'auth' + (mostrarVideo ? ' auth--split' : '')}>
      {mostrarVideo && (
        <div className="auth__media" aria-hidden="true">
          <video
            ref={videoRef}
            className={'auth__video' + (listo ? ' auth__video--listo' : '')}
            src={video}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={(e) => {
              setListo(true)
              e.currentTarget.play().catch(() => {})
            }}
            onEnded={(e) => {
              // por si algun navegador ignora loop
              e.currentTarget.currentTime = 0
              e.currentTarget.play().catch(() => {})
            }}
          />
          <div className="auth__media-borde" />
          <div className="auth__media-tinte" />
        </div>
      )}

      <div className="auth__panel">
        <div className="auth__card">
          <img
            className="auth__logo"
            src={LOGO_URL}
            alt="Bovine Link"
            onError={(e) => {
              if (e.currentTarget.src.endsWith(LOGO_URL)) {
                e.currentTarget.src = LOGO_FALLBACK
              }
            }}
          />
          <h1 className="auth__titulo">{titulo}</h1>
          <p className="auth__subtitulo">{subtitulo}</p>

          {children}

          {pie && <p className="auth__pie">{pie}</p>}
        </div>
      </div>
    </div>
  )
}

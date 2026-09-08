import { useEffect, useRef, useState } from 'react'

import { LOGO_FALLBACK, LOGO_URL } from '../../config'

/**
 * Marco compartido por Login y Registro.
 * El video va a pantalla completa detras de la tarjeta; la tarjeta es
 * translucida (efecto vidrio) para que el video se vea a traves.
 * Si el usuario pidio "reducir movimiento", no se monta el video.
 *
 * @param {{
 *   titulo: string, subtitulo: string,
 *   children: React.ReactNode, pie: React.ReactNode,
 *   video?: string,
 *   videoPosition?: string
 * }} props
 */
export default function AuthLayout({ titulo, subtitulo, children, pie, video, videoPosition }) {
  const videoRef = useRef(null)
  const [listo, setListo] = useState(false)

  // No montamos el <video> si el usuario pidio reducir movimiento.
  const sinMovimiento = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [reducido, setReducido] = useState(sinMovimiento)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const actualizar = () => setReducido(mq.matches)
    mq.addEventListener('change', actualizar)
    return () => mq.removeEventListener('change', actualizar)
  }, [])

  const mostrarVideo = Boolean(video) && !reducido

  // Algunos navegadores no arrancan el autoplay solo aunque este muteado.
  useEffect(() => {
    if (!mostrarVideo) return
    const el = videoRef.current
    if (el) el.play().catch(() => {})
  }, [mostrarVideo])

  return (
    <div className={'auth' + (mostrarVideo ? ' auth--con-video' : '')}>
      {mostrarVideo && (
        <div className="auth__media" aria-hidden="true">
          <video
            ref={videoRef}
            className={'auth__video' + (listo ? ' auth__video--listo' : '')}
            src={video}
            style={videoPosition ? { objectPosition: videoPosition } : undefined}
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

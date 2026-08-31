import { LOGO_FALLBACK, LOGO_URL } from '../../config'

/**
 * Marco compartido por Login y Registro: fondo, tarjeta, logo, titulo y subtitulo.
 *
 * @param {{ titulo: string, subtitulo: string, children: React.ReactNode, pie: React.ReactNode }} props
 */
export default function AuthLayout({ titulo, subtitulo, children, pie }) {
  return (
    <div className="auth">
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
  )
}

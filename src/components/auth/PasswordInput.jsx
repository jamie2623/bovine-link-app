import { useState } from 'react'

function IconoOjo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconoOjoTachado() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.5 0 10 7 10 7a13.2 13.2 0 0 1-2.16 2.94" />
      <path d="M6.06 6.06C3.6 7.63 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.94-1.94" />
      <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  )
}

/**
 * Input de contraseña con boton "ojito" para mostrar/ocultar el texto.
 * Reenvia el resto de props al <input> (id, value, onChange, autoComplete, required...).
 */
export default function PasswordInput({ className = '', ...props }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="auth__password">
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        className={`auth__input ${className}`.trim()}
      />
      <button
        type="button"
        className="auth__ojito"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        title={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {visible ? <IconoOjoTachado /> : <IconoOjo />}
      </button>
    </div>
  )
}

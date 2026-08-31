import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/useAuth'
import { mensajeDeError } from '../hooks/usePeticion'

/**
 * Pantalla de acceso TEMPORAL para desarrollo.
 * El modulo real de login/registro se hara en la rama feature/login;
 * cuando exista, esta pagina se reemplaza por esa.
 */
export default function AccesoPage() {
  const { estaAutenticado, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  if (estaAutenticado) {
    return <Navigate to="/dashboard" replace />
  }

  const destino = location.state?.from ?? '/dashboard'

  const enviar = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      await login({ correo, password })
      navigate(destino, { replace: true })
    } catch (err) {
      setError(mensajeDeError(err, 'Correo o contrasena incorrectos'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="acceso">
      <form className="acceso__card" onSubmit={enviar}>
        <div className="acceso__marca">
          <img src="/favicon.svg" alt="" />
          <span>Bovine Link</span>
        </div>
        <p className="acceso__nota">Acceso temporal para desarrollo</p>

        {error && <div className="acceso__error">{error}</div>}

        <div className="acceso__campo">
          <label htmlFor="acceso-correo">Correo</label>
          <input
            id="acceso-correo"
            type="email"
            className="campo"
            autoComplete="username"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <div className="acceso__campo">
          <label htmlFor="acceso-password">Contrasena</label>
          <input
            id="acceso-password"
            type="password"
            className="campo"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="boton boton--primario" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}

import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

import AuthLayout from '../components/auth/AuthLayout'
import { useAuth } from '../auth/useAuth'
import { mensajeDeError } from '../hooks/usePeticion'

export default function LoginPage() {
  const { estaAutenticado, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [recordar, setRecordar] = useState(true)
  const [error, setError] = useState(null)
  const [aviso, setAviso] = useState(null)
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
      await login({ correo, password, recordar })
      navigate(destino, { replace: true })
    } catch (err) {
      setError(mensajeDeError(err, 'Correo o contrasena incorrectos'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthLayout
      titulo="Bienvenido de vuelta"
      subtitulo="Inicie sesion para continuar"
      pie={
        <>
          ¿No tienes cuenta?
          <Link to="/registro" className="auth__enlace">
            Registrarte
          </Link>
        </>
      }
    >
      <form className="auth__form" onSubmit={enviar}>
        {error && <div className="auth__error">{error}</div>}
        {aviso && <div className="auth__aviso">{aviso}</div>}

        <div className="auth__campo">
          <label htmlFor="login-correo">Correo electronico</label>
          <input
            id="login-correo"
            type="email"
            className="auth__input"
            autoComplete="username"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <div className="auth__campo">
          <label htmlFor="login-password">Contrasena</label>
          <input
            id="login-password"
            type="password"
            className="auth__input"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="auth__olvidaste"
          onClick={() =>
            setAviso('La recuperacion de contrasena todavia no esta disponible en el backend.')
          }
        >
          ¿Olvidaste tu contrasena?
        </button>

        <label className="auth__recordarme">
          <input
            type="checkbox"
            checked={recordar}
            onChange={(e) => setRecordar(e.target.checked)}
          />
          Recordarme
        </label>

        <button type="submit" className="auth__boton" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Iniciar Sesion'}
        </button>
      </form>
    </AuthLayout>
  )
}

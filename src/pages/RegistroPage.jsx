import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import AuthLayout from '../components/auth/AuthLayout'
import PasswordInput from '../components/auth/PasswordInput'
import { useAuth } from '../auth/useAuth'
import { mensajeDeError } from '../hooks/usePeticion'

const VACIO = { nombre: '', correo: '', telefono: '', password: '', confirmar: '' }

function validar(form) {
  const errores = {}
  if (!form.nombre.trim()) errores.nombre = 'El nombre es obligatorio.'
  if (!form.correo.trim()) errores.correo = 'El correo es obligatorio.'
  if (form.password.length < 8) errores.password = 'Mínimo 8 caracteres.'
  if (form.confirmar !== form.password) errores.confirmar = 'Las contraseñas no coinciden.'
  return errores
}

export default function RegistroPage() {
  const { estaAutenticado, register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  if (estaAutenticado) {
    return <Navigate to="/catalogo" replace />
  }

  const set = (campo) => (e) => setForm((prev) => ({ ...prev, [campo]: e.target.value }))

  const enviar = async (e) => {
    e.preventDefault()
    const fallos = validar(form)
    setErrores(fallos)
    if (Object.keys(fallos).length > 0) return

    setEnviando(true)
    setError(null)
    try {
      await register({
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        telefono: form.telefono.trim() || undefined,
        password: form.password,
      })
      navigate('/catalogo', { replace: true })
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo crear la cuenta'))
    } finally {
      setEnviando(false)
    }
  }

  const claseInput = (campo) => 'auth__input' + (errores[campo] ? ' auth__input--error' : '')

  return (
    <AuthLayout
      titulo="Bienvenido"
      subtitulo="Regístrate para continuar"
      video="/auth-video-registro.mp4"
      videoPosition="center 15%"
      pie={
        <>
          ¿Ya tienes cuenta?
          <Link to="/login" className="auth__enlace">
            Iniciar sesión
          </Link>
        </>
      }
    >
      <form className="auth__form" onSubmit={enviar} noValidate>
        {error && <div className="auth__error">{error}</div>}

        <div className="auth__campo">
          <label htmlFor="reg-nombre">Nombre</label>
          <input
            id="reg-nombre"
            type="text"
            className={claseInput('nombre')}
            autoComplete="name"
            value={form.nombre}
            onChange={set('nombre')}
          />
          {errores.nombre && <span className="auth__ayuda">{errores.nombre}</span>}
        </div>

        <div className="auth__campo">
          <label htmlFor="reg-correo">Correo electrónico</label>
          <input
            id="reg-correo"
            type="email"
            className={claseInput('correo')}
            autoComplete="email"
            value={form.correo}
            onChange={set('correo')}
          />
          {errores.correo && <span className="auth__ayuda">{errores.correo}</span>}
        </div>

        <div className="auth__campo">
          <label htmlFor="reg-telefono">Teléfono</label>
          <input
            id="reg-telefono"
            type="tel"
            className="auth__input"
            autoComplete="tel"
            value={form.telefono}
            onChange={set('telefono')}
          />
        </div>

        <div className="auth__fila">
          <div className="auth__campo">
            <label htmlFor="reg-password">Contraseña</label>
            <PasswordInput
              id="reg-password"
              className={errores.password ? 'auth__input--error' : ''}
              autoComplete="new-password"
              value={form.password}
              onChange={set('password')}
            />
            {errores.password && <span className="auth__ayuda">{errores.password}</span>}
          </div>

          <div className="auth__campo">
            <label htmlFor="reg-confirmar">Confirma contraseña</label>
            <PasswordInput
              id="reg-confirmar"
              className={errores.confirmar ? 'auth__input--error' : ''}
              autoComplete="new-password"
              value={form.confirmar}
              onChange={set('confirmar')}
            />
            {errores.confirmar && <span className="auth__ayuda">{errores.confirmar}</span>}
          </div>
        </div>

        <button type="submit" className="auth__boton" disabled={enviando}>
          {enviando ? 'Creando cuenta…' : 'Regístrame'}
        </button>
      </form>
    </AuthLayout>
  )
}

import { useCallback, useMemo, useState } from 'react'

import { login as loginRequest, register as registerRequest } from '../api/auth'
import { AuthContext } from './auth-context'
import { borrarSesion, guardarSesion, leerSesion } from './session-storage'

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion)

  const login = useCallback(async ({ correo, password, recordar = true }) => {
    const data = await loginRequest({ correo, password }) // { token, id, nombre, correo, rol }
    guardarSesion(data, recordar)
    setSesion(data)
    return data
  }, [])

  const register = useCallback(async ({ nombre, correo, telefono, password }) => {
    const data = await registerRequest({ nombre, correo, telefono, password })
    guardarSesion(data, true)
    setSesion(data)
    return data
  }, [])

  const logout = useCallback(() => {
    borrarSesion()
    setSesion(null)
  }, [])

  const value = useMemo(
    () => ({
      usuario: sesion,
      token: sesion?.token ?? null,
      estaAutenticado: Boolean(sesion?.token),
      esAdmin: sesion?.rol === 'ADMIN',
      login,
      register,
      logout,
    }),
    [sesion, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

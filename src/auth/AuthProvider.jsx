import { useCallback, useMemo, useState } from 'react'

import { login as loginRequest } from '../api/auth'
import { AUTH_STORAGE_KEY } from '../config'
import { AuthContext } from './auth-context'

function leerSesion() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion)

  const login = useCallback(async (credenciales) => {
    const data = await loginRequest(credenciales) // { token, id, nombre, correo, rol }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
    setSesion(data)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setSesion(null)
  }, [])

  const value = useMemo(
    () => ({
      usuario: sesion,
      token: sesion?.token ?? null,
      estaAutenticado: Boolean(sesion?.token),
      esAdmin: sesion?.rol === 'ADMIN',
      login,
      logout,
    }),
    [sesion, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

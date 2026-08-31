import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from './useAuth'

/** Deja pasar solo si hay sesion; si no, redirige a /login. */
export default function ProtectedRoute({ children }) {
  const { estaAutenticado } = useAuth()
  const location = useLocation()

  if (!estaAutenticado) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}

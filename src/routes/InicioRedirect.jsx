import { Navigate } from 'react-router-dom'

import { useAuth } from '../auth/useAuth'

/** Manda a cada rol a su pantalla de inicio. */
export default function InicioRedirect() {
  const { estaAutenticado, esAdmin } = useAuth()

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />
  }
  return <Navigate to={esAdmin ? '/dashboard' : '/catalogo'} replace />
}

import { Navigate } from 'react-router-dom'

import { useAuth } from './useAuth'

/**
 * El panel de administración (dashboard + reportes) es solo para rol ADMIN.
 * Un usuario con otro rol se manda al catálogo.
 * Nota: el backend hoy solo exige estar autenticado en estos endpoints; este
 * control es del lado del cliente.
 */
export default function RequireAdmin({ children }) {
  const { esAdmin } = useAuth()

  if (!esAdmin) {
    return <Navigate to="/catalogo" replace />
  }
  return children
}

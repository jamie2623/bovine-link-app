import { useAuth } from './useAuth'

/**
 * El panel de administracion (dashboard + reportes) es solo para rol ADMIN.
 * Nota: el backend hoy solo exige estar autenticado en estos endpoints; este
 * control es del lado del cliente. Para probar, promove el usuario a ADMIN en la BD.
 */
export default function RequireAdmin({ children }) {
  const { usuario, esAdmin, logout } = useAuth()

  if (!esAdmin) {
    return (
      <div className="aviso-rol">
        <h1>Panel restringido</h1>
        <p>
          El usuario <strong>{usuario?.correo}</strong> tiene rol{' '}
          <strong>{usuario?.rol ?? '—'}</strong>. El panel de administracion requiere rol{' '}
          <strong>ADMIN</strong>.
        </p>
        <p className="aviso-rol__hint">
          Para desarrollo, promove el usuario en la base de datos:
          <code>UPDATE usuarios SET rol = 'ADMIN' WHERE correo = '{usuario?.correo}';</code>
        </p>
        <button type="button" className="boton" onClick={logout}>
          Cerrar sesion
        </button>
      </div>
    )
  }

  return children
}

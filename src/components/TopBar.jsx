import { useAuth } from '../auth/useAuth'

export default function TopBar() {
  const { usuario, logout } = useAuth()

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <img src="/favicon.svg" alt="" className="topbar__logo" />
        <span className="topbar__wordmark">
          Bovine<strong>Link</strong>
        </span>
      </div>

      <h1 className="topbar__title">Panel de Control General</h1>

      <div className="topbar__user">
        <span className="chip">{usuario?.rol ?? 'INVITADO'}</span>
        <button type="button" className="topbar__logout" onClick={logout}>
          Cerrar sesion
        </button>
      </div>
    </header>
  )
}

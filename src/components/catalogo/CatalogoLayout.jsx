import { NavLink, Outlet } from 'react-router-dom'

import { LOGO_FALLBACK, LOGO_URL } from '../../config'
import { useAuth } from '../../auth/useAuth'

const ENLACES = [
  { to: '/catalogo', label: 'Inicio' },
  { to: '/publicar', label: 'Publicar' },
  { to: '/mis-publicaciones', label: 'Mis publicaciones' },
]

export default function CatalogoLayout() {
  const { usuario, estaAutenticado, logout } = useAuth()

  return (
    <div className="cat">
      <header className="cat__nav">
        <div className="cat__brand">
          <img
            src={LOGO_URL}
            alt="Bovine Link"
            className="cat__logo"
            onError={(e) => {
              if (e.currentTarget.src.endsWith(LOGO_URL)) {
                e.currentTarget.src = LOGO_FALLBACK
              }
            }}
          />
          <span className="cat__wordmark">
            Bovine<strong>Link</strong>
          </span>
        </div>

        <nav className="cat__links">
          {ENLACES.map((e) => (
            <NavLink
              key={e.to}
              to={e.to}
              className={({ isActive }) => 'cat__link' + (isActive ? ' cat__link--activo' : '')}
            >
              {e.label}
            </NavLink>
          ))}
        </nav>

        <div className="cat__user">
          {estaAutenticado ? (
            <>
              <span className="chip">{usuario?.nombre ?? usuario?.rol}</span>
              <button type="button" className="cat__logout" onClick={logout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <NavLink to="/login" className="cat__link">
              Iniciar sesión
            </NavLink>
          )}
        </div>
      </header>

      <Outlet />
    </div>
  )
}

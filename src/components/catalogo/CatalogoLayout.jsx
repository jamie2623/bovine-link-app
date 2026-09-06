import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { LOGO_FALLBACK, LOGO_URL } from '../../config'
import { useAuth } from '../../auth/useAuth'

const ENLACES = [
  { to: '/', label: 'Inicio' },
  { to: '/publicar', label: 'Publicar' },
  { to: '/mis-publicaciones', label: 'Mis publicaciones' },
]

export default function CatalogoLayout() {
  const { pathname } = useLocation()
  const publicando = pathname === '/publicar'
  const misPublicaciones = pathname === '/mis-publicaciones'
  const detalle = pathname.startsWith('/publicaciones/')
  const { usuario, estaAutenticado, esAdmin, logout } = useAuth()

  return (
    <div className={(publicando || misPublicaciones) ? "cat cat--publicar" : "cat"}>
      <header className="cat__nav">
        <NavLink to="/" className="cat__brand" aria-label="Bovine Link, inicio">
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
        </NavLink>

        {detalle ? <NavLink to="/catalogo" className="detalle__volver"><span aria-hidden="true">⟵</span> Volver al catálogo</NavLink> : <>
        <nav className="cat__links">
          {ENLACES.filter(e => (!publicando || e.to !== '/publicar') && (!misPublicaciones || e.to !== '/mis-publicaciones')).map((e) => (
            <NavLink
              key={e.to}
              end={e.to === "/"}
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
              {esAdmin && <NavLink to="/dashboard" className="cat__link">Dashboard</NavLink>}
              <span className="chip">{usuario?.nombre ?? usuario?.rol}</span>
              <button type="button" className="cat__logout" onClick={logout}>
                Cerrar sesion
              </button>
            </>
          ) : (
            <NavLink to="/login" className="cat__link">
              Iniciar sesión
            </NavLink>
          )}
        </div>
        </>}
      </header>

      <Outlet />
    </div>
  )
}

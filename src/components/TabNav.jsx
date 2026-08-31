import { NavLink } from 'react-router-dom'

const ENLACES = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/reportes', label: 'Reportes' },
]

export default function TabNav() {
  return (
    <nav className="tabnav">
      {ENLACES.map((enlace) => (
        <NavLink
          key={enlace.to}
          to={enlace.to}
          className={({ isActive }) =>
            'tabnav__link' + (isActive ? ' tabnav__link--activo' : '')
          }
        >
          {enlace.label}
        </NavLink>
      ))}
    </nav>
  )
}

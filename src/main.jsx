import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import { AuthProvider } from './auth/AuthProvider'
import ProtectedRoute from './auth/ProtectedRoute'
import RequireAdmin from './auth/RequireAdmin'
import CatalogoLayout from './components/catalogo/CatalogoLayout'
import PublicacionDetallePage from './pages/PublicacionDetallePage'
import CatalogoPage from './pages/CatalogoPage'
import DashboardPage from './pages/DashboardPage'
import MisPublicacionesPage from './pages/MisPublicacionesPage'
import LoginPage from './pages/LoginPage'
import RegistroPage from './pages/RegistroPage'
import PublicarPage from './pages/PublicarPage'
import ReportesPage from './pages/ReportesPage'
import './index.css'

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/registro', element: <RegistroPage /> },

  // Panel de administracion (rol ADMIN)
  {
    element: (
      <ProtectedRoute>
        <RequireAdmin>
          <App />
        </RequireAdmin>
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/reportes', element: <ReportesPage /> },
    ],
  },

  // Vistas de usuario (rol USUARIO)
  {
    element: <CatalogoLayout />,
    children: [
      { path: '/', element: <CatalogoPage /> },
      { path: '/publicaciones/:id', element: <PublicacionDetallePage /> },
      { path: '/catalogo', element: <CatalogoPage /> },
      { path: '/publicar', element: <ProtectedRoute><PublicarPage /></ProtectedRoute> },
      { path: '/mis-publicaciones', element: <ProtectedRoute><MisPublicacionesPage /></ProtectedRoute> },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)

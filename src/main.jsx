import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import { AuthProvider } from './auth/AuthProvider'
import ProtectedRoute from './auth/ProtectedRoute'
import RequireAdmin from './auth/RequireAdmin'
import CatalogoLayout from './components/catalogo/CatalogoLayout'
import CatalogoPage from './pages/CatalogoPage'
import DashboardPage from './pages/DashboardPage'
import EnConstruccion from './pages/EnConstruccion'
import LoginPage from './pages/LoginPage'
import RegistroPage from './pages/RegistroPage'
import ReportesPage from './pages/ReportesPage'
import InicioRedirect from './routes/InicioRedirect'
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
    element: (
      <ProtectedRoute>
        <CatalogoLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/catalogo', element: <CatalogoPage /> },
      { path: '/publicar', element: <EnConstruccion titulo="Publicar" /> },
      { path: '/mis-publicaciones', element: <EnConstruccion titulo="Mis publicaciones" /> },
    ],
  },

  { path: '/', element: <InicioRedirect /> },
  { path: '*', element: <Navigate to="/" replace /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)

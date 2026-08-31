import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import { AuthProvider } from './auth/AuthProvider'
import ProtectedRoute from './auth/ProtectedRoute'
import RequireAdmin from './auth/RequireAdmin'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import RegistroPage from './pages/RegistroPage'
import ReportesPage from './pages/ReportesPage'
import './index.css'

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/registro', element: <RegistroPage /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RequireAdmin>
          <App />
        </RequireAdmin>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'reportes', element: <ReportesPage /> },
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

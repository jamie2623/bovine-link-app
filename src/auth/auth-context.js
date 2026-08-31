import { createContext } from 'react'

/**
 * Contexto de sesion. Valor: {
 *   usuario, token, estaAutenticado, esAdmin, login(credenciales), logout()
 * }
 */
export const AuthContext = createContext(null)

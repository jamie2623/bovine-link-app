import { useCallback, useEffect, useState } from 'react'

/** Mensaje de error legible a partir de un error de axios. */
export function mensajeDeError(error, porDefecto = 'Ocurrio un error inesperado') {
  return (
    error?.response?.data?.mensaje ??
    error?.response?.data?.message ??
    error?.message ??
    porDefecto
  )
}

/**
 * Ejecuta una funcion async y expone { datos, cargando, error, recargar }.
 * Se re-ejecuta cuando cambia alguna de las `deps`.
 */
export function usePeticion(fn, deps = []) {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ejecutar = useCallback(fn, deps)

  const correr = useCallback(() => {
    let vivo = true
    setCargando(true)
    setError(null)
    Promise.resolve()
      .then(ejecutar)
      .then((d) => {
        if (vivo) setDatos(d)
      })
      .catch((e) => {
        if (vivo) setError(mensajeDeError(e))
      })
      .finally(() => {
        if (vivo) setCargando(false)
      })
    return () => {
      vivo = false
    }
  }, [ejecutar])

  useEffect(correr, [correr])

  return { datos, cargando, error, recargar: correr }
}

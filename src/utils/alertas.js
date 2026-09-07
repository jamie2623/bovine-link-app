import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

// Toast chico arriba a la derecha, tema oscuro, se cierra solo.
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3200,
  timerProgressBar: true,
  width: '22rem',
  background: '#111725',
  color: '#e7e9f0',
  didOpen: (el) => {
    el.addEventListener('mouseenter', Swal.stopTimer)
    el.addEventListener('mouseleave', Swal.resumeTimer)
  },
})

export function alertaExito(titulo) {
  return Toast.fire({ icon: 'success', title: titulo })
}

export function alertaError(titulo) {
  return Toast.fire({ icon: 'error', title: titulo })
}

export function alertaInfo(titulo) {
  return Toast.fire({ icon: 'info', title: titulo })
}

/**
 * Confirmacion modal (para acciones destructivas). Resuelve a true si el
 * usuario confirma.
 */
export function confirmar({
  titulo,
  texto,
  textoConfirmar = 'Confirmar',
  icon = 'warning',
} = {}) {
  return Swal.fire({
    title: titulo,
    text: texto,
    icon,
    background: '#111725',
    color: '#e7e9f0',
    showCancelButton: true,
    confirmButtonText: textoConfirmar,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#c0392b',
    cancelButtonColor: '#556070',
    reverseButtons: true,
  }).then((r) => r.isConfirmed)
}

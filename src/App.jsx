import { Outlet } from 'react-router-dom'

import TabNav from './components/TabNav'
import TopBar from './components/TopBar'

/** Layout del panel de administracion: barra superior + pestanas + contenido. */
export default function App() {
  return (
    <div className="panel">
      <TopBar />
      <TabNav />
      <main className="panel__contenido">
        <Outlet />
      </main>
    </div>
  )
}

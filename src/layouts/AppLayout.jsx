import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/navigation/Navbar'
import Footer from '../components/navigation/Footer'
import GlobalLoader from '../components/common/GlobalLoader'
import Toaster from '../components/common/Toaster'
import GlobalOverlay from '../components/common/GlobalOverlay'
import InstallPWA from '../components/common/InstallPWA'
import { useAuth } from '../hooks/useAuth'

export default function AppLayout() {
  const location = useLocation()
  const { user } = useAuth()
  const token = localStorage.getItem('auth_token')

  return (
    <div className="flex min-h-screen flex-col">
      <GlobalLoader />
      <GlobalOverlay />
      <Toaster />
      <InstallPWA />
      <Navbar />
      <main className="flex-1 pwa-safe-bottom">
        <div key={location.pathname} className="page-anim">
          {/* Prompt de notificaciones deshabilitado por solicitud del cliente */}
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

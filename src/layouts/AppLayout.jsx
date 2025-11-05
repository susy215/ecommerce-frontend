import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/navigation/Navbar'
import Footer from '../components/navigation/Footer'
import GlobalLoader from '../components/common/GlobalLoader'
import Toaster from '../components/common/Toaster'
import GlobalOverlay from '../components/common/GlobalOverlay'
import NotificationPrompt from '../components/common/NotificationPrompt'
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
      <Navbar />
      <main className="flex-1">
        <div key={location.pathname} className="page-anim">
          {/* Mostrar prompt de notificaciones solo si el usuario está autenticado */}
          {user && token && (
            <div className="container-responsive pt-6">
              <NotificationPrompt token={token} />
            </div>
          )}
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

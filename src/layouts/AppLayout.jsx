import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/navigation/Navbar'
import Footer from '../components/navigation/Footer'
import GlobalLoader from '../components/common/GlobalLoader'
import Toaster from '../components/common/Toaster'
import GlobalOverlay from '../components/common/GlobalOverlay'

export default function AppLayout() {
  const location = useLocation()
  return (
    <div className="flex min-h-screen flex-col">
      <GlobalLoader />
  <GlobalOverlay />
      <Toaster />
      <Navbar />
      <main className="flex-1">
        <div key={location.pathname} className="page-anim">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

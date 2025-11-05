import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, X, User } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import SearchBar from '../common/SearchBar'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import ThemeToggle from './ThemeToggle'
import InstallPWAButton from '../common/InstallPWAButton'
import VoiceAssistant from '../common/VoiceAssistant'

export default function Navbar() {
  const { count } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-subtle bg-[rgb(var(--bg))]/80 backdrop-blur supports-[backdrop-filter]:bg-[rgb(var(--bg))]/60 pwa-safe-top">
      {/* Barra principal - simplificada para móvil */}
      <div className="container-responsive flex h-14 md:h-16 items-center justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            className="inline-flex items-center justify-center rounded-lg p-2.5 hover-surface lg:hidden active:scale-95 transition-transform"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5 md:h-6 md:w-6" /> : <Menu className="h-5 w-5 md:h-6 md:w-6" />}
          </button>
          <Link to={ROUTES.home} className="font-semibold tracking-tight text-lg md:text-xl">
            <span className="gradient-text">SmartSales</span>
          </Link>
          <nav className="hidden lg:flex lg:items-center lg:gap-6 lg:ml-2">
            <NavItem to={ROUTES.home} label="Inicio" />
            <NavItem to={ROUTES.catalog} label="Tienda" />
            <NavItem to={ROUTES.promociones} label="Promociones" />
            <NavItem to={ROUTES.orders} label="Pedidos" />
          </nav>
        </div>

        {/* Barra de búsqueda - Solo desktop */}
        <div className="hidden md:flex flex-1 max-w-lg mx-4">
          <SearchBar
            placeholder="Buscar productos…"
            onSearch={(q) => {
              const sp = new URLSearchParams()
              if (q) sp.set('search', q)
              sp.set('page', '1')
              navigate(`${ROUTES.catalog}?${sp.toString()}`)
            }}
          />
        </div>

        {/* Botones de acción - más grandes y espaciados en móvil */}
        <div className="flex items-center gap-1 md:gap-3">
          <div className="hidden md:flex items-center gap-2">
            <InstallPWAButton />
            <VoiceAssistant />
          </div>
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-1">
              <NavLink to={ROUTES.account} className="inline-flex items-center gap-2 rounded-lg p-2.5 md:px-3 md:py-2 hover-surface active:scale-95 transition-transform">
                <User className="h-5 w-5" />
                <span className="hidden lg:inline text-sm">{user?.username || 'Cuenta'}</span>
              </NavLink>
              <button onClick={logout} className="hidden md:inline-flex rounded-lg px-3 py-2 text-sm hover-surface">Salir</button>
            </div>
          ) : (
            <NavLink to={ROUTES.login} className="inline-flex items-center gap-1.5 rounded-lg p-2.5 md:px-3 md:py-2 hover-surface active:scale-95 transition-transform">
              <User className="h-5 w-5" />
              <span className="hidden md:inline text-sm">Entrar</span>
            </NavLink>
          )}
          <NavLink to={ROUTES.cart} className="relative inline-flex items-center gap-1.5 rounded-lg p-2.5 md:px-3 md:py-2 hover-surface active:scale-95 transition-transform">
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden md:inline text-sm">Carrito</span>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[hsl(var(--primary))] px-1 text-xs font-bold text-white shadow-md">{count}</span>
            )}
          </NavLink>
        </div>
      </div>

      {/* Barra de búsqueda móvil - segunda línea */}
      <div className="md:hidden border-t border-subtle bg-[rgb(var(--bg))]">
        <div className="container-responsive py-2">
          <SearchBar
            placeholder="Buscar productos…"
            onSearch={(q) => {
              const sp = new URLSearchParams()
              if (q) sp.set('search', q)
              sp.set('page', '1')
              navigate(`${ROUTES.catalog}?${sp.toString()}`)
            }}
          />
        </div>
      </div>

      {/* Mobile menu drawer - mejorado */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-subtle bg-[rgb(var(--bg))] shadow-lg">
          <div className="container-responsive py-3">
            <div className="flex flex-col gap-1">
              <NavLink to={ROUTES.home} className="rounded-lg px-4 py-3 hover-surface font-medium active:scale-98 transition-transform" onClick={() => setMobileOpen(false)}>Inicio</NavLink>
              <NavLink to={ROUTES.catalog} className="rounded-lg px-4 py-3 hover-surface font-medium active:scale-98 transition-transform" onClick={() => setMobileOpen(false)}>Tienda</NavLink>
              <NavLink to={ROUTES.promociones} className="rounded-lg px-4 py-3 hover-surface font-medium active:scale-98 transition-transform" onClick={() => setMobileOpen(false)}>Promociones</NavLink>
              <NavLink to={ROUTES.orders} className="rounded-lg px-4 py-3 hover-surface font-medium active:scale-98 transition-transform" onClick={() => setMobileOpen(false)}>Pedidos</NavLink>
              <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />
              {user ? (
                <>
                  <NavLink to={ROUTES.account} className="rounded-lg px-4 py-3 hover-surface font-medium active:scale-98 transition-transform" onClick={() => setMobileOpen(false)}>Mi cuenta</NavLink>
                  <button onClick={() => { setMobileOpen(false); logout() }} className="text-left rounded-lg px-4 py-3 hover-surface font-medium text-red-600 dark:text-red-400 active:scale-98 transition-transform">Cerrar sesión</button>
                </>
              ) : (
                <NavLink to={ROUTES.login} className="rounded-lg px-4 py-3 hover-surface font-medium active:scale-98 transition-transform" onClick={() => setMobileOpen(false)}>Iniciar sesión</NavLink>
              )}
              <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />
              <div className="flex items-center gap-3 px-4 py-2">
                <InstallPWAButton />
                <VoiceAssistant />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative text-sm font-medium transition-colors hover:text-[hsl(var(--primary))] ${isActive ? 'text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))] -mb-[2px]' : 'text-[rgb(var(--fg))]/80'}`
      }
    >
      <span className="px-1 py-0.5">{label}</span>
    </NavLink>
  )
}

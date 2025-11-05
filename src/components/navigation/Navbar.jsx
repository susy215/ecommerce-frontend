import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
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
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Ocultar sidebar en páginas de autenticación
  const isAuthPage = location.pathname === ROUTES.login || location.pathname === ROUTES.register

  // Cerrar sidebar al navegar a login/register
  useEffect(() => {
    if (isAuthPage) {
      setMobileOpen(false)
    }
  }, [isAuthPage])

  // Bloquear scroll del body cuando el sidebar está abierto
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-subtle bg-[rgb(var(--bg))]/80 backdrop-blur supports-[backdrop-filter]:bg-[rgb(var(--bg))]/60 pwa-safe-top">
      {/* Barra principal - simplificada para móvil */}
      <div className="container-responsive flex h-14 md:h-16 items-center justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-4">
          {/* Ocultar botón de menú en login/register */}
          {!isAuthPage && (
            <button 
              className="inline-flex items-center justify-center rounded-lg p-2.5 hover-surface lg:hidden active:scale-95 transition-transform"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5 md:h-6 md:w-6" /> : <Menu className="h-5 w-5 md:h-6 md:w-6" />}
            </button>
          )}
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
            placeholder="   Buscar productos…"
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
            placeholder="   Buscar productos…"
            onSearch={(q) => {
              const sp = new URLSearchParams()
              if (q) sp.set('search', q)
              sp.set('page', '1')
              navigate(`${ROUTES.catalog}?${sp.toString()}`)
            }}
          />
        </div>
      </div>

      {/* Mobile menu drawer - Overlay lateral deslizante - NO mostrar en login/register */}
      {mobileOpen && !isAuthPage && (
        <>
          {/* Overlay oscuro - z-index máximo para estar sobre todo */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] lg:hidden animate-in fade-in"
            onClick={() => setMobileOpen(false)}
          />
          
          {/* Panel lateral - z-index supremo, siempre visible */}
          <div className="fixed top-0 left-0 bottom-0 w-72 bg-[rgb(var(--bg))] border-r border-subtle shadow-2xl z-[9999] lg:hidden animate-in slide-in-from-left">
            <div className="flex flex-col h-full">
              {/* Header del menú */}
              <div className="flex items-center justify-between p-4 border-b border-subtle bg-gradient-to-r from-[hsl(var(--primary))]/5 to-transparent">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <span className="font-bold text-lg gradient-text">SmartSales</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover-surface active:scale-95 transition-transform"
                  aria-label="Cerrar menú"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Usuario info si está logueado */}
              {user && (
                <div className="px-4 py-3 border-b border-subtle bg-surface-hover">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-[hsl(var(--primary))]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{user?.username || 'Usuario'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'usuario@email.com'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navegación principal */}
              <nav className="flex-1 overflow-y-auto py-4">
                <div className="px-3 space-y-1">
                  <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Navegación</p>
                  <NavLink 
                    to={ROUTES.home} 
                    className="flex items-center gap-3 rounded-lg px-4 py-3 hover-surface font-medium active:scale-98 transition-all" 
                    onClick={() => setMobileOpen(false)}
                  >
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Inicio
                  </NavLink>
                  <NavLink 
                    to={ROUTES.catalog} 
                    className="flex items-center gap-3 rounded-lg px-4 py-3 hover-surface font-medium active:scale-98 transition-all" 
                    onClick={() => setMobileOpen(false)}
                  >
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Tienda
                  </NavLink>
                  <NavLink 
                    to={ROUTES.promociones} 
                    className="flex items-center gap-3 rounded-lg px-4 py-3 hover-surface font-medium active:scale-98 transition-all" 
                    onClick={() => setMobileOpen(false)}
                  >
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    Promociones
                  </NavLink>
                  <NavLink 
                    to={ROUTES.orders} 
                    className="flex items-center gap-3 rounded-lg px-4 py-3 hover-surface font-medium active:scale-98 transition-all" 
                    onClick={() => setMobileOpen(false)}
                  >
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Mis Pedidos
                  </NavLink>
                </div>

                {/* Sección de cuenta */}
                <div className="px-3 mt-4 space-y-1">
                  <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cuenta</p>
                  {user ? (
                    <>
                      <NavLink 
                        to={ROUTES.account} 
                        className="flex items-center gap-3 rounded-lg px-4 py-3 hover-surface font-medium active:scale-98 transition-all" 
                        onClick={() => setMobileOpen(false)}
                      >
                        <User className="h-5 w-5 text-gray-500" />
                        Mi cuenta
                      </NavLink>
                      <button 
                        onClick={() => { setMobileOpen(false); logout() }} 
                        className="w-full flex items-center gap-3 text-left rounded-lg px-4 py-3 hover-surface font-medium text-red-600 dark:text-red-400 active:scale-98 transition-all"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <NavLink 
                      to={ROUTES.login} 
                      className="flex items-center gap-3 rounded-lg px-4 py-3 hover-surface font-medium active:scale-98 transition-all" 
                      onClick={() => setMobileOpen(false)}
                    >
                      <User className="h-5 w-5 text-gray-500" />
                      Iniciar sesión
                    </NavLink>
                  )}
                </div>
              </nav>

              {/* Footer con herramientas */}
              <div className="p-4 border-t border-subtle bg-surface-hover">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Herramientas</p>
                <div className="flex items-center gap-2">
                  <InstallPWAButton />
                  <VoiceAssistant />
                </div>
              </div>
            </div>
          </div>
        </>
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

import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, Search, User } from 'lucide-react'
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

  return (
    <header className="sticky top-0 z-40 border-b border-subtle bg-[rgb(var(--bg))]/80 backdrop-blur supports-[backdrop-filter]:bg-[rgb(var(--bg))]/60">
      <div className="container-responsive flex h-16 items-center justify-between gap-4 md:gap-6">
        <div className="flex items-center gap-3 md:gap-4">
          <button className="inline-flex items-center justify-center rounded-md p-2 hover-surface lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <Link to={ROUTES.home} className="font-semibold tracking-tight text-xl">
            <span className="gradient-text">SmartSales</span>
          </Link>
          <nav className="hidden lg:flex lg:items-center lg:gap-6 lg:ml-2">
            <NavItem to={ROUTES.home} label="Inicio" />
            <NavItem to={ROUTES.catalog} label="Tienda" />
            <NavItem to={ROUTES.promociones} label="Promociones" />
            <NavItem to={ROUTES.orders} label="Pedidos" />
          </nav>
        </div>

        <div className="flex flex-1 max-w-lg mx-4">
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

        <div className="flex items-center gap-2 md:gap-3">
          <InstallPWAButton />
          <VoiceAssistant />
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-2">
              <NavLink to={ROUTES.account} className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 hover-surface">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">{user?.username || 'Cuenta'}</span>
              </NavLink>
              <button onClick={logout} className="rounded-md px-2 py-1.5 text-sm hover-surface">Salir</button>
            </div>
          ) : (
            <NavLink to={ROUTES.login} className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 hover-surface">
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">Entrar</span>
            </NavLink>
          )}
          <NavLink to={ROUTES.cart} className="relative inline-flex items-center gap-2 rounded-md px-2 py-1.5 hover-surface">
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden sm:inline">Carrito</span>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[hsl(var(--primary))] px-1 text-xs font-medium text-white shadow-sm">{count}</span>
            )}
          </NavLink>
        </div>
      </div>
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

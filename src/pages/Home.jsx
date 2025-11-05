import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductGrid from '../components/product/ProductGrid'
import { useCart } from '../hooks/useCart'
import { getProducts } from '../services/products'
import { toArray } from '../utils/data'
import { ROUTES } from '../constants/routes'
import { ArrowRight, Sparkles } from 'lucide-react'
import InstallPWAButton from '../components/common/InstallPWAButton'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const { addItem } = useCart()

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const data = await getProducts({ page: 1 })
        if (!ignore) {
          const list = toArray(data)
          setProducts(list.slice(0, 8))
        }
      } catch {
        if (!ignore) setProducts([])
      } finally { if (!ignore) setLoading(false) }
    }
    load()
    return () => { ignore = true }
  }, [])

  return (
    <div className="page-anim">
      {/* Hero Section - Optimizado para móvil */}
      <section className="container-responsive py-4 sm:py-8 md:py-12">
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))]/8 via-[hsl(var(--primary))]/5 to-transparent border border-[hsl(var(--primary))]/10 p-5 sm:p-8 md:p-10">
          {/* Decorative elements */}
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[hsl(var(--primary))]/5 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-[hsl(var(--primary))]/5 blur-3xl" />
          
          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mb-3 sm:mb-4 inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-[hsl(var(--primary))]/10 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[hsl(var(--primary))]">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide">Bienvenido a SmartSales</span>
            </div>
            
            <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Tu tienda online{' '}
              <span className="gradient-text">
                de confianza
              </span>
            </h1>
            
            <p className="mb-5 sm:mb-6 md:mb-8 max-w-2xl text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
              Descubre productos de calidad con envío rápido y los mejores precios.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 items-stretch sm:items-center">
              <Link 
                to={ROUTES.catalog}
                className="btn-primary inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 sm:py-2.5 text-sm font-semibold shadow-sm transition-all hover:shadow-md"
              >
                Explorar productos
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                to={ROUTES.catalog}
                className="btn-outline inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 sm:py-2.5 text-sm font-semibold"
              >
                Ver ofertas
              </Link>
              <div className="hidden sm:block">
                <InstallPWAButton className="ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-responsive pb-8 sm:pb-12 md:pb-16">
        <div className="mb-4 sm:mb-6 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Productos destacados</h2>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">Lo mejor de nuestra colección</p>
          </div>
          <Link 
            to={ROUTES.catalog}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[hsl(var(--primary))] hover:underline whitespace-nowrap"
          >
            Ver todo
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg sm:rounded-xl bg-surface-hover" />
            ))}
          </div>
        ) : (
          <ProductGrid products={products} onAdd={addItem} />
        )}
      </section>

      {/* Features Section - Más compacta en móvil */}
      <section className="container-responsive pb-8 sm:pb-12 md:pb-16">
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
          <div className="group card-surface card-hover p-4 sm:p-5 text-center">
            <div className="mx-auto mb-2 sm:mb-3 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl bg-[hsl(var(--primary))]/10 transition-colors group-hover:bg-[hsl(var(--primary))]/15">
              <svg className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mb-1 sm:mb-1.5 text-xs sm:text-sm font-semibold">Calidad garantizada</h3>
            <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">Productos verificados</p>
          </div>
          <div className="group card-surface card-hover p-4 sm:p-5 text-center">
            <div className="mx-auto mb-2 sm:mb-3 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl bg-[hsl(var(--primary))]/10 transition-colors group-hover:bg-[hsl(var(--primary))]/15">
              <svg className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mb-1 sm:mb-1.5 text-xs sm:text-sm font-semibold">Envío rápido</h3>
            <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">Entrega en tiempo récord</p>
          </div>
          <div className="group card-surface card-hover p-4 sm:p-5 text-center">
            <div className="mx-auto mb-2 sm:mb-3 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl bg-[hsl(var(--primary))]/10 transition-colors group-hover:bg-[hsl(var(--primary))]/15">
              <svg className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="mb-1 sm:mb-1.5 text-xs sm:text-sm font-semibold">Pago seguro</h3>
            <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">Protegido con Stripe</p>
          </div>
        </div>
      </section>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductGrid from '../components/product/ProductGrid'
import { useCart } from '../hooks/useCart'
import { getProducts } from '../services/products'
import { toArray } from '../utils/data'
import { ROUTES } from '../constants/routes'
import { ArrowRight, Sparkles } from 'lucide-react'

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
      {/* Hero Section */}
      <section className="container-responsive py-8 sm:py-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))]/8 via-[hsl(var(--primary))]/5 to-transparent border border-[hsl(var(--primary))]/10 p-8 sm:p-10">
          {/* Decorative elements */}
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[hsl(var(--primary))]/5 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-[hsl(var(--primary))]/5 blur-3xl" />
          
          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))]/10 px-3 py-1.5 text-[hsl(var(--primary))]">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold uppercase tracking-wide">Bienvenido a SmartSales</span>
            </div>
            
            <h1 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Tu tienda online{' '}
              <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-700))] bg-clip-text text-transparent">
                de confianza
              </span>
            </h1>
            
            <p className="mb-8 max-w-2xl text-base text-gray-600 dark:text-gray-400 sm:text-lg">
              Descubre productos de calidad con envío rápido y los mejores precios del mercado.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Link 
                to={ROUTES.catalog}
                className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm transition-all hover:shadow-md"
              >
                Explorar productos
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                to={ROUTES.catalog}
                className="btn-outline inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
              >
                Ver ofertas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-responsive pb-16">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Productos destacados</h2>
            <p className="mt-1 text-sm text-gray-600">Lo mejor de nuestra colección</p>
          </div>
          <Link 
            to={ROUTES.catalog}
            className="inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--primary))] hover:underline"
          >
            Ver todo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-surface-hover" />
            ))}
          </div>
        ) : (
          <ProductGrid products={products} onAdd={addItem} />
        )}
      </section>

      {/* Features Section */}
      <section className="container-responsive pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="group card-surface p-5 text-center transition-all hover:shadow-md">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(var(--primary))]/10 transition-colors group-hover:bg-[hsl(var(--primary))]/15">
              <svg className="h-5 w-5 text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mb-1.5 text-sm font-semibold">Calidad garantizada</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Productos verificados con controles de calidad</p>
          </div>
          <div className="group card-surface p-5 text-center transition-all hover:shadow-md">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(var(--primary))]/10 transition-colors group-hover:bg-[hsl(var(--primary))]/15">
              <svg className="h-5 w-5 text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mb-1.5 text-sm font-semibold">Envío rápido</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Recibe tus productos en tiempo récord</p>
          </div>
          <div className="group card-surface p-5 text-center transition-all hover:shadow-md">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(var(--primary))]/10 transition-colors group-hover:bg-[hsl(var(--primary))]/15">
              <svg className="h-5 w-5 text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="mb-1.5 text-sm font-semibold">Pago seguro</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Transacciones protegidas con Stripe</p>
          </div>
        </div>
      </section>
    </div>
  )
}

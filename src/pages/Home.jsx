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
      {/* Hero Section Premium - Diseño completamente nuevo */}
      <section className="container-responsive py-6 sm:py-12 md:py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(var(--primary))]/10 via-[hsl(var(--accent))]/5 to-transparent border-2 border-[hsl(var(--primary))]/15 p-6 sm:p-10 md:p-14 shadow-[0_20px_60px_rgba(0,128,255,0.15)]">
          {/* Elementos decorativos mejorados */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--accent))]/10 blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-gradient-to-tr from-[hsl(var(--accent))]/20 to-[hsl(var(--primary))]/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[hsl(var(--accent))]/5 blur-3xl" />
          
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-[rgb(var(--card))]/80 backdrop-blur-sm px-4 sm:px-5 py-2 sm:py-2.5 text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/20 shadow-lg">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Bienvenido a SmartSales</span>
            </div>
            
            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
              Descubre el futuro del{' '}
              <span className="gradient-text block sm:inline mt-2 sm:mt-0">
                comercio online
              </span>
            </h1>
            
            <p className="mb-6 sm:mb-8 md:mb-10 mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              Productos premium con tecnología de vanguardia. Envíos ultra rápidos y experiencia de compra inigualable.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link 
                to={ROUTES.catalog}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] shadow-[0_8px_24px_rgba(0,128,255,0.35)] hover:shadow-[0_12px_32px_rgba(0,128,255,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Explorar tienda
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to={ROUTES.promociones}
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-bold border-2 border-[hsl(var(--primary))]/40 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/5 hover:border-[hsl(var(--primary))]/60 hover:shadow-[0_4px_16px_rgba(0,128,255,0.2)] active:scale-[0.98] transition-all duration-300 bg-white/60 dark:bg-[rgb(var(--card))]/60 backdrop-blur-sm"
              >
                <Sparkles className="h-5 w-5" />
                Ver ofertas especiales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products con nuevo diseño */}
      <section className="container-responsive pb-10 sm:pb-14 md:pb-20">
        <div className="mb-6 sm:mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2">
              Productos <span className="gradient-text">destacados</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">Lo mejor de nuestra selección premium</p>
          </div>
          <Link 
            to={ROUTES.catalog}
            className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[hsl(var(--primary))] hover:gap-3 transition-all self-center sm:self-auto group"
          >
            Ver todos los productos
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl skeleton-shimmer shadow-md" />
          ))}
        </div>
        ) : (
          <ProductGrid products={products} onAdd={addItem} />
        )}
      </section>

      {/* Features Section - Diseño premium mejorado */}
      <section className="container-responsive pb-10 sm:pb-14 md:pb-20">
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--success))]/10 to-transparent border-2 border-[hsl(var(--success))]/20 p-6 sm:p-8 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(38,183,168,0.25)] hover:-translate-y-1">
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-[hsl(var(--success))]/10 blur-2xl" />
            <div className="relative">
              <div className="mb-4 inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--success))] to-[hsl(var(--success))]/70 shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3">
                <svg className="h-7 w-7 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg sm:text-xl font-black">Calidad Premium</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">Productos cuidadosamente seleccionados y verificados</p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))]/10 to-transparent border-2 border-[hsl(var(--primary))]/20 p-6 sm:p-8 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,128,255,0.25)] hover:-translate-y-1">
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-[hsl(var(--primary))]/10 blur-2xl" />
            <div className="relative">
              <div className="mb-4 inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3">
                <svg className="h-7 w-7 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg sm:text-xl font-black">Envío Express</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">Entrega ultra rápida en tiempo récord</p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--accent))]/10 to-transparent border-2 border-[hsl(var(--accent))]/20 p-6 sm:p-8 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(38,183,168,0.25)] hover:-translate-y-1">
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-[hsl(var(--accent))]/10 blur-2xl" />
            <div className="relative">
              <div className="mb-4 inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--accent))]/70 shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3">
                <svg className="h-7 w-7 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg sm:text-xl font-black">Pago Seguro</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">Protección total con tecnología de cifrado</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

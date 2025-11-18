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
      {/* Hero Section editorial */}
      <section className="container-responsive py-8 sm:py-12 md:py-16">
        <div className="relative overflow-hidden rounded-3xl border border-[hsl(var(--primary))]/15 bg-[rgb(var(--card))] shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center p-6 sm:p-10 lg:p-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--primary))]/40 bg-white/80 dark:bg-[rgb(var(--card))]/80 px-4 py-1.5 text-[hsl(var(--primary))] text-xs font-semibold uppercase tracking-[0.18em]">
                <Sparkles className="h-4 w-4" />
                Nueva curaduría 2025
              </div>
              <h1 className="text-[clamp(2rem,6vw,3.75rem)] font-black leading-tight text-left">
                Tecnología fina,{' '}
                <span className="gradient-text inline-block">menos ruido.</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-xl leading-relaxed">
                Inspirado en las vitrinas minimalistas de las concept stores europeas: colecciones cortas, lanzamientos semanales y un servicio que responde como app nativa.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={ROUTES.catalog}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm sm:text-base font-semibold text-white bg-[hsl(var(--primary))] shadow-[0_10px_24px_rgba(0,128,255,0.25)] hover:-translate-y-0.5 transition-all"
                >
                  Ver novedades
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={ROUTES.promociones}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm sm:text-base font-semibold border border-[hsl(var(--primary))]/30 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/5"
                >
                  Colecciones cápsula
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[{
                  label: 'Stock boutique',
                  value: '120+',
                }, {
                  label: 'Pedidos en 24h',
                  value: '92%',
                }, {
                  label: 'Clientes recurrentes',
                  value: '4.9★',
                }].map(({ label, value }) => (
                  <div key={label} className="rounded-2xl border border-[rgb(var(--border-rgb))]/30 bg-[rgb(var(--bg))]/40 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-semibold">{label}</p>
                    <p className="text-2xl font-black mt-2">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-4 rounded-[2.5rem] bg-gradient-to-br from-[hsl(var(--primary))]/25 via-transparent to-[hsl(var(--accent))]/25 blur-3xl" />
              <div className="relative rounded-[2.5rem] border border-white/30 dark:border-white/10 bg-gradient-to-br from-[rgb(var(--card))] to-[hsl(var(--primary))]/5 p-6 lg:p-8 flex flex-col gap-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">Preview exclusivo</p>
                  <p className="text-3xl font-black mt-2">Smart Desk Set</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Disponibles 40 unidades</p>
                </div>
                <div className="rounded-2xl bg-[rgb(var(--surface-hover))] p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-500">Versión</span>
                    <span className="font-bold">Graphite Frost</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-500">Entrega</span>
                    <span className="font-bold text-[hsl(var(--accent))]">48h express</span>
                  </div>
                </div>
                <InstallPWAButton className="rounded-xl px-4 py-2.5 text-sm" />
              </div>
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

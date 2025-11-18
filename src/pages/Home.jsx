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
      {/* Hero Section minimalista */}
      <section className="container-responsive py-6 sm:py-10">
        <div className="relative overflow-hidden rounded-[32px] border border-[hsl(var(--primary))]/20 bg-gradient-to-br from-[rgb(var(--card))] via-[hsl(var(--primary))]/6 to-[rgb(var(--surface))]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center p-6 sm:p-10">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-gray-500">
                <Sparkles className="h-3.5 w-3.5" />
                Edición SS365
              </p>
              <h1 className="text-[clamp(2.2rem,5vw,3.7rem)] font-black leading-tight">
                Tu tienda digital con stock listo para despachar.
              </h1>
              <p className="max-w-2xl text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Integramos proveedores confiables, despachamos desde bodegas urbanas y cuidamos cada entrega con empaques premium. Solo elige las piezas y nosotros nos encargamos del resto.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={ROUTES.catalog}
                  className="inline-flex items-center gap-2 rounded-2xl border border-transparent bg-[hsl(var(--primary))] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,128,255,0.25)] hover:-translate-y-0.5 transition"
                >
                  Empezar a comprar
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={ROUTES.promociones}
                  className="inline-flex items-center gap-2 rounded-2xl border border-[hsl(var(--primary))]/40 px-5 py-3 text-sm font-semibold text-[hsl(var(--primary))] hover:bg-white/60 dark:hover:bg-white/10"
                >
                  Ver promociones
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[{
                  value: '48h',
                  label: 'entregas nacionales'
                }, {
                  value: '4.9★',
                  label: 'rating de clientes'
                }, {
                  value: '30 días',
                  label: 'cambios garantizados'
                }].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/30 bg-white/70 p-4 text-center shadow-[0_15px_30px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/5">
                    <p className="text-2xl font-black text-[rgb(var(--fg))]">{item.value}</p>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-gray-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hero-anim h-[260px] sm:h-[340px] lg:h-[420px]">
              {/* Animated orbs */}
              <div className="hero-orb hero-orb-a" style={{ width: '55%', height: '55%', left: '5%', top: '15%' }} />
              <div className="hero-orb hero-orb-b" style={{ width: '48%', height: '48%', right: '8%', top: '8%' }} />
              <div className="hero-orb hero-orb-c" style={{ width: '38%', height: '38%', left: '35%', bottom: '10%' }} />

              {/* Rotating dashed ring */}
              <div className="hero-ring" />

              {/* Rising sparks */}
              <span className="hero-spark" style={{ left: '12%', bottom: '12%', animationDelay: '0s' }} />
              <span className="hero-spark" style={{ left: '32%', bottom: '8%', animationDelay: '0.6s' }} />
              <span className="hero-spark" style={{ right: '18%', bottom: '14%', animationDelay: '1.1s' }} />
              <span className="hero-spark" style={{ right: '8%', top: '12%', animationDelay: '1.7s' }} />
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

      {/* Features Section - estilo editorial compacto */}
      <section className="container-responsive pb-10 sm:pb-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {[{
            title: 'Curaduría precisa',
            copy: 'Surtido limitado con pruebas técnicas y garantía.',
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )
          }, {
            title: 'Logística ligera',
            copy: 'Centros urbanos con rutas nocturnas y seguimiento en vivo.',
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h11l4-4v14H3z" />
              </svg>
            )
          }, {
            title: 'Cobertura segura',
            copy: 'Pagos verificados y soporte en 3 toques con agentes reales.',
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v6m0 0H6a2 2 0 01-2-2v-7m8 9h6a2 2 0 002-2v-7m-8 3l-3-3m3 3l3-3m-3-6V3m8 6V7a4 4 0 00-8 0v2" />
              </svg>
            )
          }].map((item) => (
            <div key={item.title} className="rounded-2xl border border-[rgb(var(--border-rgb))]/30 bg-[rgb(var(--card))] p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

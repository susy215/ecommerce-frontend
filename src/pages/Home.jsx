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
      {/* Hero Section liviano */}
      <section className="container-responsive py-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] rounded-[28px] border border-[hsl(var(--primary))]/15 bg-gradient-to-br from-[rgb(var(--card))] to-[hsl(var(--primary))]/3 p-6 sm:p-10">
          <div className="space-y-5">
            <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-gray-500">
              <Sparkles className="h-3.5 w-3.5" />
              Colección activa
            </p>
            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-tight">
              Productos seleccionados para una tienda que se siente física.
            </h1>
            <p className="max-w-xl text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Renovamos el catálogo con marcas que cuidan acabados, logística ágil y garantías claras. Todo listo para que armes tu carrito sin complicaciones.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to={ROUTES.catalog}
                className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,128,255,0.2)] hover:-translate-y-0.5 transition"
              >
                Ir a la tienda
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={ROUTES.promociones}
                className="inline-flex items-center gap-2 rounded-lg border border-[hsl(var(--primary))]/30 px-4 py-2.5 text-sm font-semibold text-[hsl(var(--primary))] hover:bg-white/60 dark:hover:bg-white/10"
              >
                Promos en vivo
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.25em] text-gray-500">
              <div>
                <p className="text-[rgb(var(--fg))] text-2xl font-black tracking-normal">48h</p>
                despacho urbano
              </div>
              <div>
                <p className="text-[rgb(var(--fg))] text-2xl font-black tracking-normal">4.9★</p>
                feedback clientes
              </div>
              <div>
                <p className="text-[rgb(var(--fg))] text-2xl font-black tracking-normal">+80</p>
                referencias activas
              </div>
            </div>
          </div>
          <div className="relative rounded-[24px] border border-white/20 bg-[rgb(var(--card))]/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.15)]">
            <div className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Servicios incluidos</p>
                <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
                    Devoluciones asistidas durante 30 días.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
                    Seguimiento de pedidos con alertas en tiempo real.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
                    Equipo de soporte disponible por chat y teléfono.
                  </li>
                </ul>
              </div>
              <div className="grid gap-3">
                <div className="rounded-xl border border-[rgb(var(--border-rgb))]/20 bg-[rgb(var(--surface-hover))] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Clientes empresa</p>
                  <p className="text-sm font-semibold text-[rgb(var(--fg))]">Catálogo con precios netos y facturación automática.</p>
                </div>
                <div className="rounded-xl border border-[rgb(var(--border-rgb))]/20 bg-[rgb(var(--surface-hover))] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Ventas al detalle</p>
                  <p className="text-sm font-semibold text-[rgb(var(--fg))]">Promos activas cada fin de semana sin códigos raros.</p>
                </div>
              </div>
              <InstallPWAButton className="rounded-lg px-4 py-2 text-xs font-semibold" />
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-br from-[hsl(var(--primary))]/10 to-transparent" />
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

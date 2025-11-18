import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import ProductGrid from '../components/product/ProductGrid'
import FiltersSidebar from '../components/common/FiltersSidebar'
import Pagination from '../components/common/Pagination'
import { useCart } from '../hooks/useCart'
import { getProducts, getCategories } from '../services/products'
import { toArray } from '../utils/data'
import SortSelect from '../components/common/SortSelect'

export default function Catalog() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const page = Number(searchParams.get('page') || '1')
  const search = searchParams.get('search') || ''
  const ordering = searchParams.get('ordering') || '-fecha_creacion'
  const categoria = searchParams.get('categoria') || ''
  const [totalPages, setTotalPages] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    let ignore = false
    async function load() {
      setLoading(true)
      try {
        const data = await getProducts({ page, search, ordering, categoria })
        if (!ignore) {
          const list = toArray(data)
          setProducts(list)
          const count = data?.count
          // Paginación estándar DRF: 20 por página por defecto
          setTotalPages(count ? Math.max(1, Math.ceil(count / 20)) : 1)
        }
      } catch {
        if (!ignore) setProducts([])
      } finally { if (!ignore) setLoading(false) }
    }
    load()
    return () => { ignore = true }
  }, [page, search, ordering, categoria])

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        const data = await getCategories()
        if (!ignore) setCategories(toArray(data))
      } catch {
        if (!ignore) setCategories([])
      }
    })()
    return () => { ignore = true }
  }, [])

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next, { replace: true })
  }

  const onSortChange = (ord) => {
    const next = new URLSearchParams(searchParams)
    next.set('ordering', ord)
    next.set('page', '1')
    setSearchParams(next)
  }

  const onFiltersChange = ({ categoria: catId }) => {
    const next = new URLSearchParams(searchParams)
    if (!catId) next.delete('categoria')
    else next.set('categoria', String(catId))
    next.set('page', '1')
    setSearchParams(next)
  }

  const quickThemes = useMemo(() => [
    { label: 'Audio inmersivo', search: 'audio' },
    { label: 'Setup híbrido', search: 'desk' },
    { label: 'Wellness tech', search: 'wellness' },
    { label: 'Movilidad', search: 'smart' },
  ], [])

  const activeCategoryName = useMemo(() => {
    if (!categoria) return ''
    const current = categories.find((cat) => String(cat.id) === String(categoria))
    return current?.nombre || ''
  }, [categoria, categories])

  const applyQuickTheme = (theme) => {
    const next = new URLSearchParams(searchParams)
    if (theme.search) next.set('search', theme.search)
    if (theme.ordering) next.set('ordering', theme.ordering)
    if (theme.categoria) next.set('categoria', String(theme.categoria))
    else if (!theme.categoria) next.delete('categoria')
    next.set('page', '1')
    setSearchParams(next)
  }

  return (
    <div className="container-responsive py-6 sm:py-8 md:py-10 page-anim">
      <div className="mb-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-3xl border border-[rgb(var(--border-rgb))]/30 bg-[rgb(var(--card))] p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-500">
            Shop / Temporada 05
          </div>
          <h1 className="mt-3 text-3xl sm:text-[2.5rem] font-black leading-tight">
            {search ? (
              <>Curamos <span className="gradient-text">"{search}"</span> para ti</>
            ) : (
              <>Colección editada para <span className="gradient-text">creadores</span></>
            )}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl">
            {activeCategoryName
              ? `Mostrando primeras unidades de la categoría ${activeCategoryName}.`
              : 'Filtra por estilos, ensambla tu setup modular y muévete entre drops como si fuera una app nativa.'}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {quickThemes.map((theme) => (
              <button
                key={theme.label}
                onClick={() => applyQuickTheme(theme)}
                className="rounded-full border border-[hsl(var(--primary))]/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600 hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] transition"
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-[rgb(var(--border-rgb))]/30 bg-[rgb(var(--surface-hover))] p-6 sm:p-8 flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            <span>Ordenar</span>
            <span>{products.length || '–'} items</span>
          </div>
          <SortSelect value={ordering} onChange={onSortChange} className="w-full" />
          <button
            onClick={() => {
              const next = new URLSearchParams(searchParams)
              next.delete('search'); next.delete('categoria'); next.set('page', '1')
              setSearchParams(next)
            }}
            className="inline-flex items-center justify-center rounded-xl border border-dashed border-[hsl(var(--primary))]/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[hsl(var(--primary))] hover:bg-white"
          >
            Reiniciar filtros
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        <FiltersSidebar categories={categories} selectedCategoria={categoria} onChange={onFiltersChange} />
        <div className="flex-1 min-w-0">
          {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl skeleton-shimmer shadow-md" />
            ))}
          </div>
          ) : products.length === 0 ? (
            <div className="card-surface p-12 sm:p-16 text-center border-2 border-dashed border-[hsl(var(--primary))]/20 rounded-3xl">
              <div className="mx-auto mb-6 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--accent))]/10">
                <svg className="h-10 w-10 sm:h-12 sm:w-12 text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="mb-3 text-2xl sm:text-3xl font-black">No encontramos productos</h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 font-medium max-w-md mx-auto">
                Intenta ajustar tus filtros o búsqueda para encontrar lo que necesitas
              </p>
              <button
                onClick={() => {
                  const next = new URLSearchParams(searchParams)
                  next.delete('search'); next.delete('categoria'); next.set('page','1')
                  setSearchParams(next)
                }}
                className="btn-primary rounded-2xl px-8 py-4 text-base font-bold shadow-[0_8px_24px_rgba(0,128,255,0.35)]"
              >
                Limpiar todos los filtros
              </button>
            </div>
          ) : (
            <ProductGrid products={products} onAdd={addItem} />
          )}
          {!loading && products.length > 0 && (
            <Pagination page={page} total={totalPages} onPageChange={setPage} />
          )}
        </div>
      </div>
    </div>
  )
}

// Sin datos de ejemplo: si falla la carga, se mostrará el estado vacío y CTA para limpiar filtros.

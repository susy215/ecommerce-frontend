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

  return (
    <div className="container-responsive py-8 page-anim">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Tienda</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{search ? `Resultados para "${search}"` : 'Descubre nuestros productos'}</p>
        </div>
        <SortSelect value={ordering} onChange={onSortChange} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <FiltersSidebar categories={categories} selectedCategoria={categoria} onChange={onFiltersChange} />
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-xl bg-surface-hover" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="card-surface p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No se encontraron productos.</p>
              <button
                onClick={() => {
                  const next = new URLSearchParams(searchParams)
                  next.delete('search'); next.delete('categoria'); next.set('page','1')
                  setSearchParams(next)
                }}
                className="btn-primary rounded-md px-5 py-2 text-sm font-medium"
              >
                Limpiar filtros
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

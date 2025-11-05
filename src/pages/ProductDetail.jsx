import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductById } from '../services/products'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../utils/format'
import { ROUTES } from '../constants/routes'
import Breadcrumbs from '../components/common/Breadcrumbs'
import Button from '../components/ui/Button'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const data = await getProductById(id)
        if (!ignore) setProduct(data)
      } catch {
        if (!ignore) setProduct(null)
      } finally { if (!ignore) setLoading(false) }
    }
    load()
    return () => { ignore = true }
  }, [id])

  if (loading) {
    return (
      <div className="container-responsive py-10 page-anim">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-surface-hover" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-surface-hover" />
            <div className="h-6 w-1/2 animate-pulse rounded bg-surface-hover" />
            <div className="h-24 w-full animate-pulse rounded bg-surface-hover" />
            <div className="h-10 w-40 animate-pulse rounded bg-surface-hover" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-responsive py-10 page-anim">
        <div className="card-surface p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mb-2 text-lg font-semibold">Producto no encontrado</h2>
          <p className="text-gray-600 dark:text-gray-400">El producto que buscas no existe o fue eliminado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-responsive py-10 page-anim pb-24 lg:pb-0">
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Inicio', to: ROUTES.home },
            { label: 'Tienda', to: ROUTES.catalog },
            { label: product?.nombre || product?.name },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-2xl card-surface grid place-items-center aspect-square shadow-sm">
            {/* Nota: El backend no tiene campo 'imagen' en el modelo Producto según documentación.
                Se usa imagen placeholder por defecto. Agregar campo al backend si se requiere. */}
            {product?.imagen || product?.image ? (
              <img
                src={product.imagen || product.image}
                alt={product?.nombre || product?.name || 'Producto'}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <svg className="h-12 w-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-500">Sin imagen</span>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product?.nombre || product?.name}</h1>
            <p className="text-3xl font-bold text-[hsl(var(--primary))]">{formatPrice(Number(product?.precio ?? product?.price ?? 0))}</p>
          </div>
          
          {(product?.descripcion || product?.description) && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Descripción</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.descripcion || product.description}</p>
            </div>
          )}
          
          <div className="rounded-xl bg-surface-hover border border-subtle p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product?.sku && (
                <div>
                  <span className="text-gray-500 text-xs">SKU</span>
                  <p className="font-medium mt-0.5">{product.sku}</p>
                </div>
              )}
              {product?.categoria?.nombre && (
                <div>
                  <span className="text-gray-500 text-xs">Categoría</span>
                  <p className="font-medium mt-0.5">{product.categoria.nombre}</p>
                </div>
              )}
              {typeof product?.stock === 'number' && (
                <div>
                  <span className="text-gray-500 text-xs">Stock disponible</span>
                  <p className="font-medium mt-0.5">
                    <span className={product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 pt-2">
            <Button 
              onClick={() => addItem(product, 1)}
              disabled={product?.stock === 0}
              className="flex-1 sm:flex-none"
            >
              {product?.stock === 0 ? 'Agotado' : 'Añadir al carrito'}
            </Button>
          </div>
        </div>
      </div>

      {/* Sticky action bar for mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[40] border-t border-subtle bg-[rgb(var(--bg))] p-3 pwa-safe-bottom">
        <div className="container-responsive">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm text-gray-600">{product?.nombre || product?.name}</div>
              <div className="font-bold text-[hsl(var(--primary))]">{formatPrice(Number(product?.precio ?? product?.price ?? 0))}</div>
            </div>
            <Button 
              onClick={() => addItem(product, 1)}
              disabled={product?.stock === 0}
              className="flex-shrink-0"
            >
              {product?.stock === 0 ? 'Agotado' : 'Añadir'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

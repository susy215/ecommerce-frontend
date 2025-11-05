import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductById } from '../services/products'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../utils/format'
import { ROUTES } from '../constants/routes'
import Breadcrumbs from '../components/common/Breadcrumbs'
import Button from '../components/ui/Button'
import { ShoppingCart, Package, Tag, CheckCircle } from 'lucide-react'
import toast from '../utils/toastBus'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const { addItem } = useCart()

  // Haptic feedback for PWA (vibración táctil)
  const hapticFeedback = (type = 'light') => {
    if ('vibrate' in navigator) {
      if (type === 'light') navigator.vibrate(10)
      if (type === 'medium') navigator.vibrate(20)
      if (type === 'success') navigator.vibrate([10, 50, 10])
    }
  }

  const handleAddToCart = () => {
    setAddingToCart(true)
    hapticFeedback('light')
    
    setTimeout(() => {
      addItem(product, 1)
      setAddingToCart(false)
      hapticFeedback('success')
      toast.success('Producto añadido', {
        description: product?.nombre || product?.name,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      })
    }, 300)
  }

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
          <div className="aspect-square rounded-2xl skeleton-shimmer" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 rounded skeleton-shimmer" />
            <div className="h-6 w-1/2 rounded skeleton-shimmer" />
            <div className="h-24 w-full rounded skeleton-shimmer" />
            <div className="h-10 w-40 rounded skeleton-shimmer" />
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
    <div className="container-responsive py-4 sm:py-8 page-anim pb-28 lg:pb-8">
      {/* Breadcrumbs - más compacto en móvil */}
      <div className="mb-4 sm:mb-6">
        <Breadcrumbs
          items={[
            { label: 'Inicio', to: ROUTES.home },
            { label: 'Tienda', to: ROUTES.catalog },
            { label: product?.nombre || product?.name },
          ]}
        />
      </div>

      {/* Layout mejorado */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-2">
        {/* Imagen del producto - Más compacta en móvil */}
        <div>
          <div className="overflow-hidden rounded-xl sm:rounded-2xl card-surface grid place-items-center aspect-square shadow-sm border border-subtle transition-transform hover:scale-[1.01] active:scale-100">
            {product?.imagen || product?.image ? (
              <img
                src={product.imagen || product.image}
                alt={product?.nombre || product?.name || 'Producto'}
                className="h-full w-full object-cover"
                loading="eager"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-400">
                <Package className="h-16 w-16 sm:h-20 sm:w-20" strokeWidth={1.5} />
                <span className="text-sm">Sin imagen</span>
              </div>
            )}
          </div>
        </div>

        {/* Info del producto - Optimizada para móvil */}
        <div className="space-y-4 sm:space-y-5">
          {/* Header con precio destacado */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{product?.nombre || product?.name}</h1>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl font-bold text-[hsl(var(--primary))]">
                {formatPrice(Number(product?.precio ?? product?.price ?? 0))}
              </p>
              {product?.stock > 0 && (
                <span className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Disponible
                </span>
              )}
            </div>
          </div>
          
          {/* Descripción */}
          {(product?.descripcion || product?.description) && (
            <div className="rounded-lg bg-surface-hover/50 p-3 sm:p-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Descripción
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.descripcion || product.description}
              </p>
            </div>
          )}
          
          {/* Detalles técnicos - Grid mejorado */}
          <div className="rounded-xl bg-gradient-to-br from-surface-hover to-surface-hover/50 border border-subtle p-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {product?.sku && (
                <div className="flex items-start gap-2">
                  <Tag className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-500 block">SKU</span>
                    <p className="font-semibold text-sm mt-0.5">{product.sku}</p>
                  </div>
                </div>
              )}
              {product?.categoria?.nombre && (
                <div className="flex items-start gap-2">
                  <svg className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <div>
                    <span className="text-xs text-gray-500 block">Categoría</span>
                    <p className="font-semibold text-sm mt-0.5">{product.categoria.nombre}</p>
                  </div>
                </div>
              )}
              {typeof product?.stock === 'number' && (
                <div className="flex items-start gap-2 col-span-2">
                  <Package className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-500 block">Stock disponible</span>
                    <p className="font-semibold text-sm mt-0.5">
                      <span className={product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Botón de escritorio - Solo visible en desktop */}
          <div className="hidden lg:flex items-center gap-3 pt-2">
            <Button 
              onClick={handleAddToCart}
              disabled={product?.stock === 0 || addingToCart}
              className="flex-1 sm:flex-none text-base py-3 px-8"
            >
              {addingToCart ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Añadiendo...
                </span>
              ) : product?.stock === 0 ? (
                'Agotado'
              ) : (
                <span className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Añadir al carrito
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Sticky action bar MEJORADA para móvil - Más elegante con glassmorphism */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[40] backdrop-blur-xl bg-[rgb(var(--bg))]/90 border-t border-subtle shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] pwa-safe-bottom">
        <div className="container-responsive py-3">
          <div className="flex items-center gap-3">
            {/* Info compacta del precio */}
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {product?.nombre || product?.name}
              </span>
              <span className="text-xl font-bold text-[hsl(var(--primary))]">
                {formatPrice(Number(product?.precio ?? product?.price ?? 0))}
              </span>
            </div>
            
            {/* Botón principal con icono */}
            <Button 
              onClick={handleAddToCart}
              disabled={product?.stock === 0 || addingToCart}
              className="flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow px-5 py-3"
            >
              {addingToCart ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : product?.stock === 0 ? (
                'Agotado'
              ) : (
                <span className="flex items-center gap-2 font-semibold">
                  <ShoppingCart className="h-4 w-4" />
                  Añadir
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useCart } from '../hooks/useCart'
import { formatPrice } from '../utils/format'
import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import Button from '../components/ui/Button'
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'

export default function Cart() {
  const { items, updateQty, removeItem, subtotal, clear } = useCart()

  return (
    <div className="container-responsive py-4 sm:py-6 md:py-8 page-anim">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-[hsl(var(--primary))]" />
          Carrito
        </h1>
        {items.length > 0 && (
          <button onClick={clear} className="text-xs sm:text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1.5 self-start sm:self-auto">
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Vaciar carrito
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card-surface p-8 sm:p-12 text-center">
          <div className="mx-auto mb-3 sm:mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <ShoppingCart className="h-7 w-7 sm:h-8 sm:w-8 text-gray-400" />
          </div>
          <h2 className="mb-2 text-lg sm:text-xl font-semibold">Tu carrito está vacío</h2>
          <p className="mb-5 sm:mb-6 text-sm sm:text-base text-gray-600 dark:text-gray-400">Agrega productos para comenzar</p>
          <Link to={ROUTES.catalog} className="btn-primary inline-flex items-center justify-center rounded-lg px-6 py-3 sm:py-2.5 text-sm font-medium">
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="card-surface p-3 sm:p-4">
                <div className="flex gap-3 sm:gap-4">
                  <img 
                    src={item.image || 'https://placehold.co/160x160?text=Producto'} 
                    alt={item.name} 
                    className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 rounded-lg object-cover bg-surface-hover" 
                  />
                  <div className="flex-1 min-w-0 flex flex-col">
                    <Link to={`/product/${item.id}`} className="font-medium text-sm sm:text-base hover:text-[hsl(var(--primary))] line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="mt-1 sm:mt-2 text-base sm:text-lg font-semibold text-[hsl(var(--primary))]">
                      {formatPrice(item.price)}
                    </p>
                    
                    {/* Controles en móvil - abajo del nombre */}
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 card-surface border border-subtle rounded-lg">
                        <button 
                          onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                          className="p-2.5 sm:p-2 hover:bg-surface-hover transition-colors active:scale-95 rounded-l-lg"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 sm:w-12 text-center font-semibold text-sm">{item.qty}</span>
                        <button 
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="p-2.5 sm:p-2 hover:bg-surface-hover transition-colors active:scale-95 rounded-r-lg"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)} 
                        className="text-xs sm:text-sm text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 font-medium"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-20 h-fit">
            <div className="card-surface p-4 sm:p-6">
              <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold">Resumen</h2>
              <div className="space-y-2 pb-3 sm:pb-4 border-b border-subtle">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Productos ({items.length})</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex justify-between items-center">
                <span className="text-base sm:text-lg font-semibold">Total</span>
                <span className="text-xl sm:text-2xl font-bold text-[hsl(var(--primary))]">{formatPrice(subtotal)}</span>
              </div>
              <Link 
                to={ROUTES.checkout} 
                className="btn-primary mt-4 sm:mt-6 block w-full rounded-lg px-4 py-3.5 sm:py-3 text-center text-sm font-semibold"
              >
                Proceder al pago
              </Link>
              <Link 
                to={ROUTES.catalog} 
                className="btn-outline mt-3 block w-full rounded-lg px-4 py-3 sm:py-2.5 text-center text-sm font-medium"
              >
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

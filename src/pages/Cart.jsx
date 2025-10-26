import { useCart } from '../hooks/useCart'
import { formatPrice } from '../utils/format'
import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import Button from '../components/ui/Button'
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'

export default function Cart() {
  const { items, updateQty, removeItem, subtotal, clear } = useCart()

  return (
    <div className="container-responsive py-8 page-anim">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-[hsl(var(--primary))]" />
          Carrito de compras
        </h1>
        {items.length > 0 && (
          <button onClick={clear} className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1">
            <Trash2 className="h-4 w-4" />
            Vaciar carrito
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card-surface p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <ShoppingCart className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">Tu carrito está vacío</h2>
          <p className="mb-6 text-gray-600">Agrega productos para comenzar tu compra</p>
          <Link to={ROUTES.catalog} className="btn-primary inline-flex items-center justify-center rounded-md px-6 py-2.5 text-sm font-medium">
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="card-surface card-hover p-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={item.image || 'https://via.placeholder.com/80'} 
                    alt={item.name} 
                    className="h-20 w-20 rounded-lg object-cover bg-surface-hover" 
                  />
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.id}`} className="font-medium hover:text-[hsl(var(--primary))] line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-lg font-semibold text-[hsl(var(--primary))]">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 card-surface border border-subtle">
                      <button 
                        onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                        className="p-2 hover:bg-surface-hover transition-colors"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="p-2 hover:bg-surface-hover transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)} 
                      className="text-sm text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-20 h-fit">
            <div className="card-surface p-6">
              <h2 className="mb-4 text-lg font-semibold">Resumen de compra</h2>
              <div className="space-y-2 pb-4 border-b border-subtle">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Productos ({items.length})</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-[hsl(var(--primary))]">{formatPrice(subtotal)}</span>
              </div>
              <Link 
                to={ROUTES.checkout} 
                className="btn-primary mt-6 block w-full rounded-md px-4 py-3 text-center text-sm font-medium"
              >
                Proceder al pago
              </Link>
              <Link 
                to={ROUTES.catalog} 
                className="btn-outline mt-3 block w-full rounded-md px-4 py-2 text-center text-sm font-medium"
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

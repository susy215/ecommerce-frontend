import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/format'
import { ROUTES } from '../../constants/routes'

export default function ProductCard({ product, onAdd }) {
  const id = product?.id
  const to = ROUTES.product.replace(':id', String(id || '1'))
  const nombre = product?.nombre || product?.name || 'Producto'
  const precio = product?.precio ?? product?.price ?? 0
  const stock = product?.stock
  // Imagen por defecto si no existe (backend no tiene campo imagen según doc)
  const image = product?.image || product?.imagen || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop'
  
  return (
    <div className="group overflow-hidden rounded-xl card-surface card-hover">
      <Link to={to} className="block aspect-square overflow-hidden bg-surface-hover">
        <img
          src={image}
          alt={nombre}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="space-y-2 p-3">
        <Link to={to} className="line-clamp-1 font-medium hover:text-[hsl(var(--primary))]">{nombre}</Link>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">{formatPrice(Number(precio))}</span>
          <button
            onClick={() => onAdd?.(product)}
            className="btn-primary rounded-md px-3 py-1.5 text-sm font-medium active:scale-[0.98] transition-transform"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  )
}

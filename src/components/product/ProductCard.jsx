import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/format'
import { ROUTES } from '../../constants/routes'

export default function ProductCard({ product, onAdd }) {
  const id = product?.id
  const to = ROUTES.product.replace(':id', String(id || '1'))
  const nombre = product?.nombre || product?.name || 'Producto'
  const precio = product?.precio ?? product?.price ?? 0
  const stock = product?.stock
  // Imagen por defecto si no existe
  const image = product?.image || product?.imagen || 'https://placehold.co/600x600?text=Producto'
  
  return (
    <div className="group overflow-hidden rounded-lg sm:rounded-xl card-surface card-hover">
      <Link to={to} className="block aspect-square overflow-hidden bg-surface-hover">
        <img
          src={image}
          alt={nombre}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="space-y-2 p-2.5 sm:p-3">
        <Link to={to} className="block text-sm sm:text-base line-clamp-2 sm:line-clamp-1 font-medium hover:text-[hsl(var(--primary))] min-h-[2.5rem] sm:min-h-0">{nombre}</Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-base sm:text-lg font-bold text-[hsl(var(--primary))]">{formatPrice(Number(precio))}</span>
          <button
            onClick={() => onAdd?.(product)}
            className="btn-primary rounded-lg w-full sm:w-auto px-3 py-2.5 sm:py-1.5 text-xs sm:text-sm font-semibold active:scale-[0.98] transition-transform"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  )
}

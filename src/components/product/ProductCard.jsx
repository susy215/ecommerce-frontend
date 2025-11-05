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
  const image = product?.image || product?.imagen || 'https://imgs.search.brave.com/aJqdC45IQOsmTLrl_8R3-YWcSAe-zzjK5XrQ3PNo_pQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1lZGlhLWFtYXpvbi5jb20vaW1hZ2VzL0kvOTFmM2FBSlJ1Y0wuanBn'
  
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

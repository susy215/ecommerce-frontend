import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getOrders } from '../services/orders'
import { toArray } from '../utils/data'
import { formatPrice } from '../utils/format'
import Pagination from '../components/common/Pagination'
import StatusChip from '../components/common/StatusChip'
import { ROUTES } from '../constants/routes'
import { Package } from 'lucide-react'

export default function Orders() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || '1')
  const ordering = searchParams.get('ordering') || '-fecha'

  useEffect(() => {
    let ignore = false
    ;(async () => {
      setLoading(true)
      try {
        const data = await getOrders({ page, ordering })
        if (!ignore) {
          setOrders(toArray(data))
          const count = data?.count
          setTotalPages(count ? Math.max(1, Math.ceil(count / 20)) : 1)
        }
      } catch {
        if (!ignore) setOrders([])
      } finally { if (!ignore) setLoading(false) }
    })()
    return () => { ignore = true }
  }, [page, ordering])

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="container-responsive py-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Package className="h-6 w-6 text-[hsl(var(--primary))]" />
            Mis compras
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Historial de tus pedidos</p>
        </div>
      </div>
      {loading ? (
        <div className="h-40 animate-pulse rounded-xl bg-surface-hover" />
      ) : orders.length === 0 ? (
        <div className="card-surface p-6 text-center text-[rgb(var(--fg))]/70">
          Aún no tienes compras.
          <div className="mt-3">
            <Link to={ROUTES.catalog} className="btn-primary inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium">Ir a la tienda</Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-subtle">
            <table className="w-full text-sm">
              <thead className="bg-surface-hover text-left">
                <tr>
                  <th className="p-3">Pedido</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, index) => {
                  const orderNumber = `SS-${String(o.id).padStart(5, '0')}`
                  const orderDate = o.fecha ? new Date(o.fecha) : null
                  const dateStr = orderDate 
                    ? orderDate.toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })
                    : '—'
                  const timeStr = orderDate 
                    ? orderDate.toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })
                    : ''
                  
                  return (
                    <tr key={o.id} className="border-t border-subtle hover:bg-surface-hover transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]">
                            <Package className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{orderNumber}</div>
                            <div className="text-xs text-gray-500">{o.items?.length || 0} {o.items?.length === 1 ? 'producto' : 'productos'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{dateStr}</span>
                          {timeStr && <span className="text-xs text-gray-500">{timeStr}</span>}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-[hsl(var(--primary))]">{formatPrice(Number(o.total ?? 0))}</span>
                      </td>
                      <td className="p-3">
                        <StatusChip status={o.pagado_en ? 'paid' : 'pending'} />
                      </td>
                      <td className="p-3 text-right">
                        <Link 
                          className="text-[hsl(var(--primary))] hover:underline font-medium text-sm" 
                          to={ROUTES.orderDetail.replace(':id', String(o.id))}
                        >
                          Ver detalle →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={page} total={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

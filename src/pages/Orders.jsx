import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getOrders } from '../services/orders'
import { toArray } from '../utils/data'
import { formatPrice } from '../utils/format'
import Pagination from '../components/common/Pagination'
import StatusChip from '../components/common/StatusChip'
import { ROUTES } from '../constants/routes'

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
        <h1 className="text-xl font-semibold">Mis compras</h1>
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
                  <th className="p-3">#</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-subtle hover:bg-surface-hover">
                    <td className="p-3">{o.id}</td>
                    <td className="p-3">{o.fecha ? new Date(o.fecha).toLocaleString() : '—'}</td>
                    <td className="p-3">{formatPrice(Number(o.total ?? 0))}</td>
                    <td className="p-3"><StatusChip status={o.pagado_en ? 'paid' : 'pending'} /></td>
                    <td className="p-3 text-right">
                      <Link className="text-[hsl(var(--primary))] hover:underline" to={ROUTES.orderDetail.replace(':id', String(o.id))}>Ver detalle</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} total={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getOrders } from '../services/orders'
import { getMisDevoluciones, cancelarDevolucion } from '../services/devoluciones'
import { toArray } from '../utils/data'
import { formatPrice } from '../utils/format'
import Pagination from '../components/common/Pagination'
import StatusChip from '../components/common/StatusChip'
import GarantiaInfo from '../components/common/GarantiaInfo'
import ModalDevolucion from '../components/common/ModalDevolucion'
import toast from '../utils/toastBus'
import { ROUTES } from '../constants/routes'
import { Package, RotateCcw, Clock, CheckCircle2, XCircle } from 'lucide-react'

export default function Orders() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [devoluciones, setDevoluciones] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [searchParams, setSearchParams] = useSearchParams()
  const [modalItem, setModalItem] = useState(null)
  const [tab, setTab] = useState('compras') // 'compras' o 'devoluciones'
  const page = Number(searchParams.get('page') || '1')
  const ordering = searchParams.get('ordering') || '-fecha'

  useEffect(() => {
    let ignore = false
    ;(async () => {
      setLoading(true)
      try {
        const [ordersData, devolucionesData] = await Promise.all([
          getOrders({ page, ordering }),
          getMisDevoluciones()
        ])
        if (!ignore) {
          setOrders(toArray(ordersData))
          setDevoluciones(devolucionesData || [])
          const count = ordersData?.count
          setTotalPages(count ? Math.max(1, Math.ceil(count / 20)) : 1)
        }
      } catch {
        if (!ignore) {
          setOrders([])
          setDevoluciones([])
        }
      } finally { if (!ignore) setLoading(false) }
    })()
    return () => { ignore = true }
  }, [page, ordering])

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next, { replace: true })
  }

  const handleDevolucionCreada = async () => {
    // Recargar devoluciones
    try {
      const devolucionesData = await getMisDevoluciones()
      setDevoluciones(devolucionesData || [])
    } catch (e) {
      console.error('Error al recargar devoluciones:', e)
    }
  }

  const getEstadoBadge = (estado) => {
    const configs = {
      pendiente: { 
        icon: Clock, 
        className: 'bg-amber-500/20 text-amber-700 border-amber-500/30 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700/50',
        label: 'Pendiente'
      },
      aprobada: { 
        icon: CheckCircle2, 
        className: 'bg-blue-500/20 text-blue-700 border-blue-500/30 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700/50',
        label: 'Aprobada'
      },
      rechazada: { 
        icon: XCircle, 
        className: 'bg-red-500/20 text-red-700 border-red-500/30 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700/50',
        label: 'Rechazada'
      },
      completada: { 
        icon: CheckCircle2, 
        className: 'badge-success',
        label: 'Completada'
      }
    }
    
    const config = configs[estado] || configs.pendiente
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm ${config.className}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    )
  }

  return (
    <div className="container-responsive py-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Package className="h-6 w-6 text-[hsl(var(--primary))]" />
            Mis compras
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Historial de tus pedidos y devoluciones</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-black/10">
        <button
          onClick={() => setTab('compras')}
          className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${
            tab === 'compras'
              ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]'
              : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Compras ({orders.length})
          </span>
        </button>
        <button
          onClick={() => setTab('devoluciones')}
          className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${
            tab === 'devoluciones'
              ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]'
              : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Devoluciones ({devoluciones.length})
          </span>
        </button>
      </div>

      {loading ? (
        <div className="h-40 animate-pulse rounded-xl bg-surface-hover" />
      ) : tab === 'compras' ? (
        orders.length === 0 ? (
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
        )
      ) : (
        // Tab de Devoluciones
        devoluciones.length === 0 ? (
          <div className="card-surface p-6 text-center text-[rgb(var(--fg))]/70">
            No tienes solicitudes de devolución.
          </div>
        ) : (
          <div className="space-y-4">
            {devoluciones.map((dev) => (
              <div key={dev.id} className="card-surface p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">Devolución #{dev.id}</h3>
                      {getEstadoBadge(dev.estado)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {dev.tipo === 'devolucion' ? 'Devolución con reembolso' : 'Cambio por otro producto'}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-gray-600 dark:text-gray-400">Solicitado</div>
                    <div className="font-medium">
                      {new Date(dev.fecha_solicitud).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                <div className="border-t border-black/5 pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Producto:</span>
                      <p className="font-medium">{dev.compra_item_info?.producto_nombre || '—'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Cantidad:</span>
                      <p className="font-medium">{dev.cantidad}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Motivo:</span>
                      <p className="font-medium">{dev.motivo}</p>
                    </div>
                    {dev.tipo === 'devolucion' && dev.monto_reembolso && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Monto:</span>
                        <p className="font-semibold text-green-600 dark:text-green-400">
                          {formatPrice(parseFloat(dev.monto_reembolso))}
                        </p>
                      </div>
                    )}
                  </div>

                  {dev.descripcion && (
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Descripción:</span>
                      <p className="mt-1">{dev.descripcion}</p>
                    </div>
                  )}

                  {dev.respuesta_admin && (
                    <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 text-sm">
                      <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
                        Respuesta del administrador:
                      </div>
                      <p className="text-blue-600 dark:text-blue-400">{dev.respuesta_admin}</p>
                    </div>
                  )}

                  {dev.puede_cancelar && (
                    <div className="pt-2">
                      <button
                        onClick={async () => {
                          if (confirm('¿Estás seguro de cancelar esta solicitud?')) {
                            try {
                              await cancelarDevolucion(dev.id)
                              toast.success('Solicitud cancelada')
                              handleDevolucionCreada()
                            } catch (e) {
                              toast.error('Error al cancelar la solicitud')
                            }
                          }
                        }}
                        className="text-sm text-red-600 hover:underline dark:text-red-400"
                      >
                        Cancelar solicitud
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Modal de devolución */}
      {modalItem && (
        <ModalDevolucion
          item={modalItem}
          onClose={() => setModalItem(null)}
          onSuccess={handleDevolucionCreada}
        />
      )}
    </div>
  )
}

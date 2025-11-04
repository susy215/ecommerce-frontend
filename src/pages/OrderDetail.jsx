import { useEffect, useMemo, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrder, payOrder, createStripeSession, downloadReceipt } from '../services/orders'
import { formatPrice } from '../utils/format'
import { verificarGarantia } from '../services/devoluciones'
import toast from '../utils/toastBus'
import StatusChip from '../components/common/StatusChip'
import GarantiaInfo from '../components/common/GarantiaInfo'
import ModalDevolucion from '../components/common/ModalDevolucion'
import { Calendar, CreditCard, ClipboardCopy, Printer, AlertCircle, CheckCircle2, Package, Download, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
import Button from '../components/ui/Button'

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [referencia, setReferencia] = useState('')
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [itemsOpen, setItemsOpen] = useState(false)
  const [modalItem, setModalItem] = useState(null)

  const fetchOrder = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getOrder(id)
      setOrder(data)
    } catch (e) {
      setError('No se pudo cargar la compra.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchOrder() }, [fetchOrder])

  const items = useMemo(() => Array.isArray(order?.items) ? order.items : [], [order])
  const computedSubtotal = useMemo(() => items.reduce((acc, it) => acc + Number(it.subtotal ?? 0), 0), [items])

  if (loading) {
    return (
      <div className="container-responsive py-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-7 w-56 animate-pulse rounded-md bg-black/10" />
          <div className="h-6 w-40 animate-pulse rounded-md bg-black/10" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-36 animate-pulse rounded-xl bg-surface-hover" />
            <div className="h-56 animate-pulse rounded-xl bg-surface-hover" />
          </div>
          <div className="h-56 animate-pulse rounded-xl bg-surface-hover" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container-responsive py-8">
        <div className="rounded-xl border border-black/5 p-6 text-center text-gray-600">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
            <AlertCircle size={18} />
          </div>
          {error || 'Compra no encontrada.'}
          <div className="mt-4">
            <button onClick={fetchOrder} className="text-sm text-[hsl(var(--primary))] hover:underline">Reintentar</button>
          </div>
        </div>
      </div>
    )
  }

  // Generar número de pedido formateado
  const orderNumber = `SS-${String(order.id).padStart(5, '0')}`

  return (
    <div className="container-responsive py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                Pedido {orderNumber}
                <StatusChip status={order.pagado_en ? 'paid' : 'pending'} />
              </h1>
              <p className="text-xs text-gray-500">{items.length} {items.length === 1 ? 'producto' : 'productos'}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => window.print()} className="inline-flex items-center gap-1 rounded-md border border-black/10 px-2 py-1.5 text-xs hover:bg-black/5">
            <Printer size={14} /> Imprimir
          </button>
          <Link to="/orders" className="text-sm text-[hsl(var(--primary))] hover:underline font-medium">← Volver</Link>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-black/5 p-4">
            <h2 className="mb-3 flex items-center gap-2 font-semibold"><Calendar size={16} /> Resumen</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="text-sm">
                <div className="text-gray-500">Fecha</div>
                <div>{order.fecha ? new Date(order.fecha).toLocaleString() : '—'}</div>
              </div>
              <div className="text-sm">
                <div className="text-gray-500">Estado</div>
                <div className="flex items-center gap-2">
                  <StatusChip status={order.pagado_en ? 'paid' : 'pending'} />
                  <span className="text-xs text-gray-600">{order.pagado_en ? `Pagado el ${new Date(order.pagado_en).toLocaleString()}` : 'Pendiente de pago'}</span>
                </div>
              </div>
              <div className="text-sm">
                <div className="text-gray-500">Total</div>
                <div className="font-medium">{formatPrice(Number(order.total ?? 0))}</div>
              </div>
              <div className="text-sm sm:col-span-2">
                <div className="text-gray-500">Observaciones</div>
                <div>{order.observaciones || '—'}</div>
              </div>
              <div className="text-sm sm:col-span-2">
                <div className="text-gray-500">Referencia de pago</div>
                <div>{order.pago_referencia || '—'}</div>
              </div>
            </div>
          </div>

          {/* Garantía */}
          {order.pagado_en && <GarantiaInfo compra={order} />}

          <div className="rounded-xl border border-black/5 p-4">
            <button
              onClick={() => setItemsOpen(!itemsOpen)}
              className="mb-3 flex w-full items-center justify-between font-semibold hover:opacity-70"
            >
              <span className="flex items-center gap-2">
                <Package size={16} /> Items ({items.length})
              </span>
              {itemsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {itemsOpen && (
              <>
                <ul className="space-y-3">
                  {items.map((it) => {
                    const puedeDevolver = order.pagado_en && verificarGarantia(order.fecha).dentroGarantia
                    
                    return (
                      <li key={it.id} className="flex items-center justify-between gap-4 text-sm border-b border-black/5 pb-3 last:border-0 last:pb-0">
                        <div className="min-w-0 flex-1">
                          {it.producto ? (
                            <Link to={`/product/${it.producto}`} className="truncate font-medium hover:underline block">
                              {it.producto_nombre}
                            </Link>
                          ) : (
                            <span className="truncate font-medium block">{it.producto_nombre}</span>
                          )}
                          <div className="text-xs text-gray-600 mt-1">
                            Cantidad: {it.cantidad} × {formatPrice(Number(it.precio_unitario ?? 0))}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="shrink-0 font-medium">{formatPrice(Number(it.subtotal ?? 0))}</div>
                          {puedeDevolver && (
                            <button
                              onClick={() => setModalItem(it)}
                              className="shrink-0 inline-flex items-center gap-1 rounded-md border border-[hsl(var(--primary))]/30 bg-[hsl(var(--primary))]/10 px-2 py-1 text-xs font-medium text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/20 transition"
                              title="Solicitar devolución"
                            >
                              <RotateCcw size={12} />
                              Devolver
                            </button>
                          )}
                        </div>
                      </li>
                    )
                  })}
                  {items.length === 0 && (
                    <li className="py-4 text-center text-sm text-gray-600">Sin items.</li>
                  )}
                </ul>
                <div className="mt-4 flex items-center justify-end gap-6 border-t border-black/5 pt-3 text-sm">
                  <div className="text-gray-600">Subtotal items</div>
                  <div className="font-medium">{formatPrice(computedSubtotal)}</div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-black/5 p-4">
          <h2 className="mb-3 flex items-center gap-2 font-semibold"><CreditCard size={16} /> Pago</h2>
          {order.pagado_en ? (
            <div className="space-y-3">
              <div className="rounded-lg p-3 text-sm callout-success">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span className="font-medium">Pago confirmado.</span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    const blob = await downloadReceipt(order.id)
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `compra-${order.id}.pdf`
                    a.click()
                    URL.revokeObjectURL(url)
                  } catch (e) {
                    const msg = e?.response?.data?.detail || 'No se pudo descargar el comprobante'
                    toast.error(msg)
                  }
                }}
                className="w-full"
              >
                <span className="inline-flex items-center gap-2"><Download size={16} /> Descargar comprobante</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Button
                  className="w-full"
                  onClick={async () => {
                    try {
                      const origin = window.location.origin
                      const back = `${origin}/orders/${order.id}`
                      const session = await createStripeSession(order.id, { success_url: back, cancel_url: back })
                      if (session?.url) {
                        window.location.href = session.url
                      } else {
                        toast.error('No se pudo iniciar el pago con Stripe')
                      }
                    } catch (e) {
                      const msg = e?.response?.data?.detail || 'Error al iniciar pago'
                      toast.error(msg)
                    }
                  }}
                >
                  Pagar con Stripe
                </Button>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">O confirma tu pago manual ingresando la referencia.</p>
                <label className="block text-sm">
                  <span className="mb-1 block text-gray-600">Referencia de pago</span>
                  <input
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    placeholder="Ej: TRANS-123456"
                    className="input w-full"
                  />
                </label>
                <Button
                  disabled={!referencia || paying}
                  onClick={async () => {
                    setPaying(true)
                    try {
                      const updated = await payOrder(order.id, referencia)
                      setOrder(updated)
                      toast.success('Pago confirmado')
                    } catch (e) {
                      const msg = e?.response?.data?.detail || 'No se pudo confirmar el pago'
                      toast.error(msg)
                    } finally { setPaying(false) }
                  }}
                  className="w-full"
                >
                  {paying ? 'Confirmando…' : 'Confirmar pago'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de devolución */}
      {modalItem && (
        <ModalDevolucion
          item={modalItem}
          onClose={() => setModalItem(null)}
          onSuccess={() => {
            setModalItem(null)
            fetchOrder() // Recargar orden
          }}
        />
      )}
    </div>
  )
}

import { createContext, useContext, useMemo, useRef, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition'
import { parseIntent } from '../../voice/intentParser'
import { useCart } from '../../hooks/useCart'
import { getProducts } from '../../services/products'
import { toArray } from '../../utils/data'
import { ROUTES } from '../../constants/routes'
import toast from '../../utils/toastBus'

const VoiceCommandContext = createContext(null)

export function VoiceCommandProvider({ children }) {
  const { addItem, removeItem, clear, items } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [lastTranscript, setLastTranscript] = useState('')
  const [lastIntent, setLastIntent] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [candidates, setCandidates] = useState([])

  const haptic = (type = 'light') => {
    if ('vibrate' in navigator) {
      if (type === 'light') navigator.vibrate(10)
      if (type === 'success') navigator.vibrate([10, 40, 10])
      if (type === 'warn') navigator.vibrate([30, 30])
    }
  }

  const onResult = useCallback(async (text) => {
    setLastTranscript(text)
    await processText(text)
  }, [])

  const onError = useCallback((err) => {
    const map = {
      'no-speech': 'No se detectó voz',
      'audio-capture': 'No se pudo acceder al micrófono',
      'not-allowed': 'Permiso de micrófono denegado',
      'network': 'Error de red',
      'aborted': 'Reconocimiento cancelado'
    }
    toast.error(map[err] || 'Error al reconocer voz')
  }, [])

  const { isListening, isSupported, startListening, stopListening } = useVoiceRecognition(onResult, onError)

  // Detener escucha al cambiar de ruta
  const lastPathRef = useRef(location.pathname)
  if (lastPathRef.current !== location.pathname) {
    lastPathRef.current = location.pathname
    stopListening()
  }

  const searchProducts = async (query) => {
    if (!query) return []
    const data = await getProducts({ search: query, page: 1 })
    const list = toArray(data)
    return list
  }

  const normalizeProduct = (p) => ({
    id: p.id,
    nombre: p.nombre || p.name,
    name: p.name || p.nombre,
    precio: p.precio ?? p.price ?? 0,
    price: p.price ?? p.precio ?? 0,
    imagen: p.imagen || p.image,
    image: p.image || p.imagen,
    stock: p.stock
  })

  const fulfill = async (intent) => {
    switch (intent.type) {
      case 'go_cart':
        navigate(ROUTES.cart)
        toast.success('Abriendo carrito')
        haptic('light')
        return
      case 'go_checkout':
        if (items.length === 0) {
          toast.info('Tu carrito está vacío')
          haptic('warn')
          return
        }
        navigate(ROUTES.checkout)
        toast.success('Yendo a checkout')
        haptic('light')
        return
      case 'clear_cart': {
        if (items.length === 0) {
          toast.info('Tu carrito ya está vacío')
          return
        }
        clear()
        toast.success('Carrito vaciado')
        haptic('light')
        return
      }
      case 'search': {
        const q = intent.query
        setCandidates(await searchProducts(q))
        if (!q || candidates.length === 0) {
          toast.info(`No se encontraron resultados para "${q || 'consulta vacía'}"`)
        } else {
          toast.success(`Resultados para "${q}"`)
        }
        return
      }
      case 'buy': // comprar N producto -> agrega y navega a checkout
      case 'add_to_cart': {
        const q = intent.query
        const qty = intent.quantity || 1
        const list = await searchProducts(q)
        if (!list.length) {
          toast.info(`No encontré "${q}"`)
          haptic('warn')
          return
        }
        const product = normalizeProduct(list[0])
        addItem(product, qty)
        toast.success(`${product.nombre || product.name} x${qty} agregado`) 
        haptic('success')
        // Aviso para UI del FAB
        try {
          window.dispatchEvent(new CustomEvent('voiceFeedback', { detail: { type: 'added', quantity: qty, productName: product.nombre || product.name } }))
        } catch {}
        if (intent.type === 'buy') {
          navigate(ROUTES.checkout)
        }
        return
      }
      case 'remove_from_cart': {
        const q = intent.query
        const qty = intent.quantity || 1
        if (!items.length) {
          toast.info('Tu carrito está vacío')
          return
        }
        // Buscar por nombre aproximado en items del carrito
        const found = items.find(x => (x.name || x.nombre || '').toLowerCase().includes(q))
        if (!found) {
          toast.info(`No encontré "${q}" en tu carrito`)
          return
        }
        if (found.qty > qty) {
          // Reducir cantidad
          // No tenemos método de reducir cantidad directo; reutilizamos updateQty vía addItem negativo no existe
          // Estrategia: set qty exacto (no hay API aquí), se omite para simplicidad y se remueve si qty alcanza 0
          // Como no hay updateQty en este scope, preferimos retirar el item cuando coincide (UX simple)
          removeItem(found.id)
          toast.success(`Quitado ${found.name || found.nombre}`)
        } else {
          removeItem(found.id)
          toast.success(`Quitado ${found.name || found.nombre}`)
        }
        haptic('light')
        return
      }
      default:
        toast.info('No entendí. Prueba: "agrega 2 coca cola al carrito"')
    }
  }

  async function processText(text) {
    if (!text) return
    try {
      setProcessing(true)
      const intent = parseIntent(text)
      setLastIntent(intent)
      await fulfill(intent)
    } catch (e) {
      toast.error('Error procesando comando')
    } finally {
      setProcessing(false)
    }
  }

  const value = useMemo(() => ({
    isSupported,
    isListening,
    startListening,
    stopListening,
    lastTranscript,
    lastIntent,
    processing,
    candidates,
    clearCandidates: () => setCandidates([]),
    processText
  }), [isSupported, isListening, startListening, stopListening, lastTranscript, lastIntent, processing, candidates])

  return (
    <VoiceCommandContext.Provider value={value}>
      {children}
    </VoiceCommandContext.Provider>
  )
}

export function useVoiceCommands() {
  const ctx = useContext(VoiceCommandContext)
  if (!ctx) throw new Error('useVoiceCommands must be used within VoiceCommandProvider')
  return ctx
}



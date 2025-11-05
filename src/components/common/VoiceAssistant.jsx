import { useState, useEffect } from 'react'
import { Mic, MicOff, X, ShoppingCart, Search, CreditCard } from 'lucide-react'
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition'
import { getProducts } from '../../services/products'
import { useCart } from '../../hooks/useCart'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { toArray } from '../../utils/data'
import toast from '../../utils/toastBus'

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const { addItem } = useCart()
  const navigate = useNavigate()

  const handleVoiceResult = async (transcript) => {
    const text = transcript.toLowerCase().trim()
    console.log('Voz reconocida:', text)

    // Comandos simples
    if (text.includes('ir al carrito') || text.includes('ver carrito')) {
      navigate(ROUTES.cart)
      setIsOpen(false)
      toast.success('Navegando al carrito...')
      return
    }

    if (text.includes('pagar') || text.includes('checkout') || text.includes('comprar')) {
      navigate(ROUTES.checkout)
      setIsOpen(false)
      toast.success('Navegando al checkout...')
      return
    }

    if (text.includes('cerrar') || text.includes('salir')) {
      setIsOpen(false)
      return
    }

    // Buscar productos
    setLoading(true)
    try {
      const data = await getProducts({ search: text, page: 1 })
      const products = toArray(data)
      setSearchResults(products.slice(0, 5)) // Máximo 5 resultados

      if (products.length === 0) {
        toast.info(`No se encontraron productos para "${text}"`)
      } else {
        toast.success(`Encontrados ${products.length} producto(s)`)
      }
    } catch (error) {
      toast.error('Error al buscar productos')
      console.error('Error buscando productos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVoiceError = (error) => {
    console.error('Error de reconocimiento de voz:', error)
    
    const errorMessages = {
      'no-speech': 'No se detectó voz. Intenta de nuevo.',
      'audio-capture': 'No se pudo acceder al micrófono.',
      'not-allowed': 'Permiso de micrófono denegado. Por favor habilítalo en configuración.',
      'network': 'Error de red. Verifica tu conexión.',
      'aborted': 'Reconocimiento cancelado.'
    }

    toast.error(errorMessages[error] || 'Error al reconocer voz')
  }

  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening
  } = useVoiceRecognition(handleVoiceResult, handleVoiceError)

  const handleToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      setIsOpen(true)
      startListening()
    }
  }

  const handleAddToCart = (product) => {
    // Normalizar producto para asegurar estructura consistente
    // addItem ya maneja la normalización, pero esto asegura que funcione correctamente
    const normalizedProduct = {
      id: product.id,
      nombre: product.nombre || product.name,
      name: product.name || product.nombre, // Para compatibilidad
      precio: product.precio ?? product.price ?? 0,
      price: product.price ?? product.precio ?? 0, // Para compatibilidad
      imagen: product.imagen || product.image,
      image: product.image || product.imagen, // Para compatibilidad
      stock: product.stock,
    }
    
    addItem(normalizedProduct, 1)
    const productName = normalizedProduct.nombre || normalizedProduct.name || 'Producto'
    toast.success(`"${productName}" agregado al carrito`)
    setSearchResults([])
  }

  const handleProductClick = (product) => {
    navigate(ROUTES.product.replace(':id', product.id))
    setIsOpen(false)
  }

  // Cerrar cuando se hace clic fuera
  useEffect(() => {
    if (!isListening && transcript) {
      // Mantener abierto después de reconocer
    }
  }, [isListening, transcript])

  if (!isSupported) {
    return null // No mostrar si no está soportado
  }

  return (
    <>
      {/* Botón del micrófono - Mejorado para móvil */}
      <button
        onClick={handleToggle}
        className={`relative inline-flex items-center justify-center rounded-lg p-2.5 transition-all ${
          isListening 
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 animate-pulse' 
            : 'hover-surface active:scale-95'
        }`}
        aria-label={isListening ? 'Detener reconocimiento de voz' : 'Iniciar reconocimiento de voz'}
        title="Búsqueda por voz"
      >
        {isListening ? (
          <MicOff className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
        {isListening && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </button>

      {/* Panel de resultados - Optimizado para móvil */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-start sm:justify-center sm:pt-24 lg:hidden">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => {
              setIsOpen(false)
              stopListening()
            }}
          />

          {/* Panel - Desliza desde abajo en móvil, centrado en desktop */}
          <div className="relative w-full sm:max-w-md card-surface shadow-2xl rounded-t-2xl sm:rounded-xl overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-top-4 sm:fade-in max-h-[85vh] sm:max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-subtle bg-gradient-to-r from-[hsl(var(--primary))]/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  isListening ? 'bg-red-500' : 'bg-[hsl(var(--primary))]/10'
                }`}>
                  {isListening ? (
                    <MicOff className="h-5 w-5 text-white animate-pulse" />
                  ) : (
                    <Mic className="h-5 w-5 text-[hsl(var(--primary))]" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">
                    {isListening ? 'Escuchando...' : 'Asistente de Voz'}
                  </h3>
                  {transcript && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      "{transcript}"
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false)
                  stopListening()
                }}
                className="p-1.5 hover:bg-surface-hover rounded-md transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Contenido - Scrolleable */}
            <div className="flex-1 overflow-y-auto p-4">
              {isListening && !transcript && (
                <div className="text-center py-6 sm:py-8">
                  <div className="mb-3 sm:mb-4">
                    <div className="mx-auto h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-red-500/20 flex items-center justify-center">
                      <Mic className="h-7 w-7 sm:h-8 sm:w-8 text-red-500 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-sm sm:text-base font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Habla ahora...
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-4">
                    Di el nombre de un producto o un comando
                  </p>
                  <div className="mt-4 pt-4 border-t border-subtle max-w-xs mx-auto">
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-2 font-semibold">Ejemplos:</p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>"Buscar laptop"</p>
                      <p>"Ir al carrito"</p>
                      <p>"Pagar"</p>
                    </div>
                  </div>
                </div>
              )}

              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[hsl(var(--primary))] border-r-transparent"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Buscando productos...
                  </p>
                </div>
              )}

              {!isListening && !loading && searchResults.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider">
                    Productos encontrados
                  </p>
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-subtle hover:bg-surface-hover transition-all active:scale-[0.98] group"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 
                          className="font-medium text-sm cursor-pointer hover:text-[hsl(var(--primary))] line-clamp-1 mb-1"
                          onClick={() => handleProductClick(product)}
                        >
                          {product.nombre || product.name}
                        </h4>
                        <p className="text-sm font-semibold text-[hsl(var(--primary))]">
                          ${parseFloat(product.precio || product.price || 0).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/20 active:scale-95 transition-all text-xs font-semibold"
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="hidden sm:inline">Agregar</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {!isListening && !loading && transcript && searchResults.length === 0 && (
                <div className="text-center py-8">
                  <Search className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 px-4">
                    No se encontraron productos para <span className="font-semibold">"{transcript}"</span>
                  </p>
                  <button
                    onClick={startListening}
                    className="mt-4 btn-primary rounded-lg text-xs sm:text-sm px-5 py-2.5 font-semibold"
                  >
                    <Mic className="inline h-4 w-4 mr-1.5" />
                    Intentar de nuevo
                  </button>
                </div>
              )}

              {/* Comandos rápidos */}
              {!isListening && !loading && (
                <div className="mt-6 pt-4 border-t border-subtle">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider">
                    Accesos rápidos
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        navigate(ROUTES.cart)
                        setIsOpen(false)
                      }}
                      className="flex flex-col sm:flex-row items-center justify-center gap-2 p-3 rounded-lg border border-subtle hover:bg-surface-hover active:scale-[0.98] transition-all text-xs font-medium"
                    >
                      <ShoppingCart className="h-5 w-5 sm:h-4 sm:w-4 text-[hsl(var(--primary))]" />
                      <span>Ver carrito</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate(ROUTES.checkout)
                        setIsOpen(false)
                      }}
                      className="flex flex-col sm:flex-row items-center justify-center gap-2 p-3 rounded-lg border border-subtle hover:bg-surface-hover active:scale-[0.98] transition-all text-xs font-medium"
                    >
                      <CreditCard className="h-5 w-5 sm:h-4 sm:w-4 text-[hsl(var(--primary))]" />
                      <span>Pagar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}


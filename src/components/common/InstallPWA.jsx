import { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'
import Button from '../ui/Button'

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Verificar si ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Capturar el evento beforeinstallprompt
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Mostrar el prompt después de un delay (para no ser intrusivo)
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa_prompt_dismissed')
        if (!dismissed) {
          setShowPrompt(true)
        }
      }, 5000) // 5 segundos después de cargar
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Detectar si se instaló
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowPrompt(false)
      localStorage.removeItem('pwa_prompt_dismissed')
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('PWA instalada')
    }
    
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa_prompt_dismissed', 'true')
  }

  if (isInstalled || !showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-in slide-in-from-bottom-4 fade-in">
      <div className="relative rounded-xl border border-[hsl(var(--primary))]/20 bg-gradient-to-br from-[hsl(var(--primary))]/10 via-white to-white dark:from-[hsl(var(--primary))]/20 dark:via-[rgb(var(--card))] dark:to-[rgb(var(--card))] p-4 shadow-2xl backdrop-blur-sm">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 rounded-full p-1.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--primary))]/10">
            <Smartphone className="h-6 w-6 text-[hsl(var(--primary))]" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1">Instala SmartSales365</h3>
            <p className="text-sm text-[rgb(var(--muted))] mb-3">
              Accede más rápido y recibe notificaciones de tus pedidos.
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Download className="h-4 w-4 mr-2" />
                Instalar
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
              >
                Ahora no
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


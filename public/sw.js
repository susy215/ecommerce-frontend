// Service Worker para notificaciones push de SmartSales365

self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalado')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activado')
  event.waitUntil(self.clients.claim())
})

// Escuchar eventos push
self.addEventListener('push', (event) => {
  console.log('Push recibido:', event)
  
  if (!event.data) {
    console.warn('Push sin datos')
    return
  }

  let notification = {}
  try {
    notification = event.data.json()
  } catch (e) {
    notification = {
      title: 'SmartSales365',
      body: event.data.text() || 'Nueva notificación'
    }
  }

  const options = {
    body: notification.body || notification.message || 'Nueva actualización',
    icon: notification.icon || '/vite.svg',
    badge: notification.badge || '/vite.svg',
    image: notification.image,
    vibrate: [100, 50, 100],
    data: {
      url: notification.url || notification.data?.url || '/',
      dateOfArrival: Date.now(),
      primaryKey: notification.id || Date.now(),
      ...notification.data
    },
    actions: [
      { action: 'open', title: 'Ver', icon: '/vite.svg' },
      { action: 'close', title: 'Cerrar', icon: '/vite.svg' }
    ],
    tag: notification.tag || 'smartsales-notification',
    requireInteraction: false
  }

  event.waitUntil(
    self.registration.showNotification(
      notification.title || 'SmartSales365',
      options
    )
  )
})

// Manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('Notificación clickeada:', event)
  event.notification.close()

  if (event.action === 'close') {
    return
  }

  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Buscar si ya hay una ventana abierta
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }
        // Si no hay ventana abierta, abrir una nueva
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Manejar cierre de notificaciones
self.addEventListener('notificationclose', (event) => {
  console.log('Notificación cerrada:', event.notification.tag)
})


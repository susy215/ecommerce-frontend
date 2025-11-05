# 🔔 Notificaciones Push - Desarrollo Local

## ✅ Estado Actual

**Las notificaciones push YA ESTÁN IMPLEMENTADAS:**
- ✅ `src/services/notifications.js` - Servicio completo
- ✅ `public/sw.js` - Service Worker funcionando
- ✅ `src/App.jsx` - Integración automática al login
- ✅ Build exitoso sin errores

---

## 🚨 IMPORTANTE: HTTPS en Desarrollo Local

### **Service Workers y Push Notifications REQUIEREN:**

1. **HTTPS** (en producción)
2. **localhost** (funciona sin HTTPS)
3. **127.0.0.1** (funciona sin HTTPS)

### ❌ **NO FUNCIONAN en:**
- `http://192.168.x.x` (IP local)
- `http://mi-pc.local`
- Cualquier dominio sin HTTPS

---

## 🔧 Configuración para Desarrollo Local

### **Opción 1: Usar localhost (RECOMENDADO)** ✅

**Frontend:**
```bash
npm run dev
# Se ejecuta en: http://localhost:5173 ✅
```

**Backend:**
```bash
python manage.py runserver
# Se ejecuta en: http://localhost:8000 ✅
```

**Archivo `.env` del frontend:**
```env
VITE_API_URL=http://localhost:8000
```

**✅ Esto FUNCIONA porque:**
- `localhost` está en la lista blanca de navegadores
- Service Workers funcionan en localhost sin HTTPS
- Push Notifications funcionan en localhost sin HTTPS

---

### **Opción 2: HTTPS Local con mkcert** (Si necesitas probar con dominio)

Si por alguna razón necesitas HTTPS local:

1. **Instalar mkcert:**
```bash
# Windows (con Chocolatey)
choco install mkcert

# Mac
brew install mkcert

# Linux
# Ver https://github.com/FiloSottile/mkcert
```

2. **Crear certificado local:**
```bash
mkcert -install
mkcert localhost 127.0.0.1
```

3. **Configurar Vite para HTTPS:**
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    }
  }
})
```

4. **Acceder en:** `https://localhost:5173`

---

## 🧪 Cómo Probar las Notificaciones Push

### **Paso 1: Verificar que el Service Worker se Registre**

1. Abre DevTools (F12)
2. Ve a la pestaña **Application** (Chrome) o **Storage** (Firefox)
3. En el menú lateral, busca **Service Workers**
4. Deberías ver: `sw.js` registrado y activo

**Si NO aparece:**
- Verifica que estás en `localhost` (no IP)
- Verifica que el archivo `public/sw.js` existe
- Revisa la consola por errores

---

### **Paso 2: Solicitar Permisos**

1. Inicia sesión en la aplicación
2. Deberías ver un popup del navegador pidiendo permiso para notificaciones
3. Click en **"Permitir"**

**Si NO aparece el popup:**
- Ve a Configuración del navegador → Notificaciones
- Verifica que el sitio tiene permiso
- O fuerza la solicitud desde la consola:
```javascript
Notification.requestPermission()
```

---

### **Paso 3: Verificar Suscripción**

En la consola del navegador, ejecuta:

```javascript
// Verificar estado
navigator.serviceWorker.getRegistration().then(reg => {
  reg.pushManager.getSubscription().then(sub => {
    console.log('Suscripción:', sub)
  })
})
```

**Deberías ver:**
- `endpoint`: URL del servicio push de Chrome/Firefox
- `keys`: Claves de encriptación (p256dh, auth)

---

### **Paso 4: Probar Notificación Local**

En la consola del navegador:

```javascript
// Probar notificación local (sin backend)
navigator.serviceWorker.getRegistration().then(reg => {
  reg.showNotification('Test', {
    body: 'Notificación de prueba',
    icon: '/vite.svg',
    vibrate: [200, 100, 200]
  })
})
```

**Si esto funciona, el Service Worker está bien configurado ✅**

---

### **Paso 5: Verificar que el Backend Recibió la Suscripción**

1. Crea una compra de prueba
2. Ve a los logs del backend Django
3. Deberías ver:
```
POST /api/notificaciones/subscriptions/
```

4. Verifica en la base de datos que se guardó la suscripción

---

### **Paso 6: Enviar Notificación desde el Backend**

Cuando el backend envíe una notificación (por ejemplo, cuando se confirme un pago), deberías recibirla automáticamente.

**Para probar manualmente desde el backend Django:**

```python
# En el shell de Django
from notificaciones.models import PushSubscription
from notificaciones.services import send_push_notification

# Obtener una suscripción de prueba
subscription = PushSubscription.objects.first()

# Enviar notificación
send_push_notification(
    subscription,
    title='Pedido Confirmado',
    body='Tu pedido #123 ha sido confirmado',
    url='/orders/123'
)
```

---

## 🐛 Solución de Problemas Comunes

### ❌ Error: "Service Worker registration failed"

**Causa:** No estás en localhost o hay un error en el Service Worker

**Solución:**
1. Verifica que estás en `http://localhost:5173` (no IP)
2. Abre la consola y revisa errores
3. Verifica que `public/sw.js` existe y está correcto
4. Intenta limpiar el caché: DevTools → Application → Clear storage

---

### ❌ Error: "Push subscription failed"

**Causa:** La clave VAPID del backend es incorrecta o no se obtuvo

**Solución:**
1. Verifica que el backend tiene el endpoint: `/api/notificaciones/vapid-public-key/`
2. Verifica que devuelve: `{"public_key": "..."}`
3. Revisa la consola del navegador por errores de red
4. Verifica que `VITE_API_URL` en `.env` apunta al backend correcto

---

### ❌ No aparecen notificaciones cuando el backend las envía

**Causa:** La suscripción no se guardó correctamente o el backend no está enviando

**Solución:**
1. Verifica en la base de datos que existe la suscripción
2. Verifica los logs del backend cuando envía notificaciones
3. Revisa que el formato del payload sea correcto:
```json
{
  "title": "Título",
  "body": "Mensaje",
  "url": "/orders/123",
  "icon": "/icon.png"
}
```

---

### ❌ Permiso de notificaciones denegado

**Solución:**
1. Ve a Configuración del navegador
2. Busca "Notificaciones" o "Sitios web"
3. Busca `localhost:5173`
4. Cambia a "Permitir"

---

## 📋 Checklist de Verificación

### Frontend:
- [ ] Estás usando `localhost` (no IP)
- [ ] Service Worker se registra correctamente
- [ ] Popup de permisos aparece al iniciar sesión
- [ ] Suscripción se crea exitosamente
- [ ] Suscripción se envía al backend

### Backend:
- [ ] Endpoint `/api/notificaciones/vapid-public-key/` funciona
- [ ] Endpoint `/api/notificaciones/subscriptions/` recibe POST
- [ ] La suscripción se guarda en la base de datos
- [ ] El backend puede enviar notificaciones push

---

## 🎯 Flujo Completo en Desarrollo Local

```
1. Usuario abre http://localhost:5173
   ↓
2. Service Worker se registra automáticamente
   ↓
3. Usuario inicia sesión
   ↓
4. App.jsx detecta usuario autenticado
   ↓
5. Llama a subscribeToPushNotifications()
   ↓
6. Solicita permiso de notificaciones
   ↓
7. Obtiene clave VAPID del backend (http://localhost:8000)
   ↓
8. Crea suscripción push
   ↓
9. Envía suscripción al backend
   ↓
10. Backend guarda suscripción en BD
   ↓
11. ✅ Usuario está suscrito a notificaciones
```

---

## 🚀 Cuando Haya un Evento (ej: Pago Confirmado)

```
1. Backend detecta evento (pago confirmado)
   ↓
2. Backend obtiene suscripciones del usuario
   ↓
3. Backend envía notificación push usando webpush
   ↓
4. Service Worker recibe la notificación
   ↓
5. Service Worker muestra la notificación
   ↓
6. Usuario hace click
   ↓
7. Se abre la URL especificada
```

---

## ✅ Todo Listo

**Para desarrollo local, simplemente:**

1. ✅ Usa `localhost` (no IP)
2. ✅ Frontend en `http://localhost:5173`
3. ✅ Backend en `http://localhost:8000`
4. ✅ `.env` con `VITE_API_URL=http://localhost:8000`
5. ✅ Inicia sesión y acepta permisos

**¡Las notificaciones push funcionarán en localhost sin HTTPS!** 🎉

---

## 📝 Notas Importantes

- **localhost funciona sin HTTPS** ✅
- **Service Workers requieren HTTPS O localhost** ✅
- **En producción (Vercel) todo funciona automáticamente** ✅
- **No necesitas certificados SSL para desarrollo local** ✅

---

**¿Todo claro? Si tienes problemas, revisa los logs de la consola del navegador y los logs del backend Django.**


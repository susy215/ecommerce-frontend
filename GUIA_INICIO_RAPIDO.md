# 🚀 Guía de Inicio Rápido - SmartSales365 Frontend

## ⚡ Configuración en 5 Minutos

### 1️⃣ Crear archivo `.env`

Crea un archivo llamado `.env` en la raíz del proyecto con este contenido:

```env
VITE_API_URL=http://localhost:8000
VITE_STRIPE_PUBLIC_KEY=pk_test_51...
```

> ⚠️ **Importante:** Reemplaza `pk_test_51...` con tu clave pública de Stripe

---

### 2️⃣ Instalar y Ejecutar

```bash
# Instalar dependencias (solo la primera vez)
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

Abre tu navegador en: **http://localhost:5173** 🎉

---

## 📱 Probar Funcionalidades

### ✅ Registro y Login
1. Ve a `/register`
2. Crea una cuenta con:
   - Usuario único
   - Email válido
   - Contraseña segura

### ✅ Explorar Productos
1. Ve a `/shop` o haz clic en "Tienda"
2. Usa los filtros por categoría
3. Busca productos
4. Agrega al carrito

### ✅ Hacer una Compra
1. Ve al carrito `/cart`
2. Revisa tus productos
3. Haz clic en "Proceder al pago"
4. En el checkout:
   - Aplica un cupón (si tienes uno)
   - Agrega observaciones
   - Crea la compra
5. Elige método de pago:
   - **Stripe:** Redirige a pasarela segura
   - **Manual:** Ingresa referencia de pago

### ✅ Ver Promociones
1. Ve a `/promociones`
2. Copia un código de promoción
3. Úsalo en el checkout

### ✅ Gestionar Pedidos
1. Ve a `/orders`
2. Ve tus compras
3. Haz clic en "Ver detalle"
4. Descarga el comprobante PDF (si está pagado)
5. Solicita devolución (dentro de 30 días)

### ✅ Notificaciones Push
1. Inicia sesión
2. Acepta los permisos de notificación
3. Crea un pedido
4. Recibirás una notificación cuando se procese

---

## 🔑 Claves de Stripe de Prueba

Si no tienes cuenta de Stripe, puedes usar estas claves de prueba:

**Clave Pública (para .env):**
```
VITE_STRIPE_PUBLIC_KEY=pk_test_51...
```

**Tarjetas de prueba:**
- **Éxito:** `4242 4242 4242 4242`
- **Requiere autenticación:** `4000 0025 0000 3155`
- **Rechazada:** `4000 0000 0000 9995`

**Datos de prueba:**
- CVV: Cualquier 3 dígitos (ej: 123)
- Fecha: Cualquier fecha futura (ej: 12/34)
- ZIP: Cualquier código postal

---

## 🛠️ Solución de Problemas

### Error: "Network Error" o "Failed to fetch"
**Causa:** El backend no está corriendo o la URL es incorrecta

**Solución:**
1. Verifica que el backend esté en `http://localhost:8000`
2. Revisa la variable `VITE_API_URL` en `.env`
3. Reinicia el servidor dev: `npm run dev`

---

### Error: "Token expirado" o 401
**Causa:** Tu sesión expiró

**Solución:**
1. Cierra sesión
2. Vuelve a iniciar sesión

---

### Las notificaciones no funcionan
**Causa:** Permisos no otorgados o Service Worker no registrado

**Solución:**
1. Verifica permisos en: Configuración del navegador > Notificaciones
2. Abre la consola (F12) y busca errores del Service Worker
3. En Chrome: Ve a `chrome://serviceworker-internals/`
4. Desregistra y recarga la página

---

### Los estilos no se ven bien
**Causa:** TailwindCSS no se compiló correctamente

**Solución:**
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Reiniciar servidor
npm run dev
```

---

## 📦 Build para Producción

```bash
# Crear build optimizado
npm run build

# Previsualizar build
npm run preview
```

---

## 🚀 Deploy en Vercel (Producción)

### Opción 1: Desde la terminal
```bash
# Instalar CLI de Vercel
npm i -g vercel

# Deploy
vercel
```

### Opción 2: Desde GitHub
1. Sube el código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa el repositorio
4. Configura las variables de entorno:
   - `VITE_API_URL` → URL de tu backend
   - `VITE_STRIPE_PUBLIC_KEY` → Tu clave de Stripe
5. Deploy automático

---

## 📱 Características Implementadas

| Funcionalidad | Estado | Ruta |
|--------------|--------|------|
| Registro/Login | ✅ | `/register`, `/login` |
| Catálogo de Productos | ✅ | `/shop` |
| Detalle de Producto | ✅ | `/product/:id` |
| Carrito de Compras | ✅ | `/cart` |
| Checkout | ✅ | `/checkout` |
| Pago con Stripe | ✅ | Integrado |
| Pago Manual | ✅ | Integrado |
| Mis Pedidos | ✅ | `/orders` |
| Detalle de Pedido | ✅ | `/orders/:id` |
| Descargar Comprobante | ✅ | PDF |
| Promociones | ✅ | `/promociones` |
| Aplicar Cupones | ✅ | En checkout |
| Devoluciones | ✅ | Desde detalle de pedido |
| Mi Cuenta | ✅ | `/account` |
| Notificaciones Push | ✅ | Automáticas |
| Tema Oscuro/Claro | ✅ | Toggle en navbar |

---

## 🎯 Próximos Pasos

1. **Personalizar estilos:**
   - Edita colores en `src/index.css`
   - Modifica variables CSS: `--primary`, `--bg`, etc.

2. **Agregar más funcionalidades:**
   - Wishlist (lista de deseos)
   - Comparador de productos
   - Reseñas y calificaciones
   - Chat de soporte

3. **Optimizar:**
   - Lazy loading de componentes
   - Optimización de imágenes
   - Service Worker para cache offline

---

## 📚 Documentación Adicional

- **README.md** - Documentación completa del proyecto
- **FRONTEND_CLIENTE_COMPLETO.md** - Guía de implementación detallada
- **CAMBIOS_REALIZADOS.md** - Resumen de mejoras aplicadas
- **PROMOCIONES_DEVOLUCIONES.md** - Sistema de promociones y devoluciones

---

## 💡 Tips y Trucos

### Desarrollo más rápido
```bash
# Terminal 1: Backend
python manage.py runserver

# Terminal 2: Frontend
npm run dev
```

### Limpiar cache
```bash
# Si algo no funciona, prueba:
rm -rf node_modules dist .vite
npm install
npm run dev
```

### Ver logs del Service Worker
1. Abre DevTools (F12)
2. Ve a la pestaña "Application" (Chrome) o "Storage" (Firefox)
3. Busca "Service Workers"
4. Ve los logs y estado

### Testing de notificaciones
En la consola del navegador:
```javascript
// Verificar permisos
console.log(Notification.permission)

// Probar notificación
new Notification('Test', { body: 'Funciona!' })
```

---

## 🆘 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica los logs del terminal
3. Consulta la documentación del backend
4. Crea un issue en el repositorio

---

## ✨ ¡Listo para empezar!

Tu frontend está completamente configurado y listo para usar. 

**¡Feliz desarrollo!** 🎉

---

**Última actualización:** Noviembre 2025
**Versión:** 1.0.0


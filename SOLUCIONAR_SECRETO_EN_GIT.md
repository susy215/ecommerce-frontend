# 🔒 Solución: Secretos en Git (GitHub Push Protection)

## 🚨 Problema Detectado

GitHub está bloqueando tu push porque detectó una **clave secreta de Stripe** en el archivo `.env` que fue commitado.

**Error:**
```
Push cannot contain secrets
- Stripe Test API Secret Key
  locations:
    - commit: 8bb5f47331b5a9b201f2158b68a5d83158911c99
      path: .env:22
    - commit: 08ce8df64df24cf4256a25c643df55e448ec1b4e
      path: .env:22
```

---

## ✅ Solución Rápida (Recomendada)

### **Opción 1: Eliminar el secreto del historial**

Si el repositorio no tiene muchos commits o no te importa reescribir el historial:

```bash
# 1. Eliminar .env del historial completo
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# 2. Forzar push (CUIDADO: esto reescribe el historial)
git push origin --force --all
```

⚠️ **ADVERTENCIA:** Esto reescribe el historial. Si otros están trabajando en el repo, coordina con ellos.

---

### **Opción 2: Permitir el secreto temporalmente (NO RECOMENDADO)**

Solo si es una clave de TEST y no importa:

1. Ve al enlace que GitHub te dio:
   ```
   https://github.com/susy215/ecommerce-frontend/security/secret-scanning/unblock-secret/352JovoYKVLMP78o70y01TUBHmc
   ```

2. Haz clic en "Allow secret"
3. Vuelve a hacer push

⚠️ **PERO:** Esto sigue dejando el secreto en el historial. Es mejor eliminarlo.

---

### **Opción 3: Invalidar la clave y usar una nueva (RECOMENDADO)**

Si es una clave de TEST de Stripe:

1. **Ir a Stripe Dashboard:**
   - https://dashboard.stripe.com/test/apikeys
   - Revoca la clave que está en el `.env`

2. **Generar una nueva clave de prueba**

3. **Actualizar tu `.env` local** con la nueva clave

4. **Eliminar `.env` del historial** (Opción 1)

5. **Asegurarte de que `.env` está en `.gitignore`** ✅ (Ya lo agregué)

---

## 🔧 Pasos Inmediatos

### 1. **Verificar que `.env` está en `.gitignore`**

Ya lo agregué, pero verifica:

```bash
cat .gitignore | grep .env
```

Debería mostrar:
```
.env
.env.local
.env.*.local
```

### 2. **Si el `.env` está en el staging area, removerlo:**

```bash
git rm --cached .env
```

### 3. **Commit el cambio en `.gitignore`:**

```bash
git add .gitignore
git commit -m "Add .env to .gitignore"
```

### 4. **Eliminar `.env` del historial:**

```bash
# Ver qué commits tienen .env
git log --all --full-history --oneline -- .env

# Eliminar del historial (REEMPLAZA los IDs si son diferentes)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Limpiar referencias
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now
```

### 5. **Forzar push:**

```bash
git push origin --force --all
```

⚠️ **CUIDADO:** Esto reescribe el historial. Si trabajas con otros, coordina primero.

---

## 🛡️ Prevención Futura

### **Crear `.env.example` (sin secretos):**

```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# Stripe Public Key (clave pública, no secreta)
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# NO incluir claves secretas aquí
```

### **Verificar antes de commitear:**

```bash
# Ver qué archivos vas a commitear
git status

# Verificar que .env NO está incluido
git diff --cached .env
# Si muestra algo, removerlo:
git rm --cached .env
```

---

## 🔍 Verificar que Funcionó

Después de eliminar `.env` del historial:

```bash
# Verificar que .env ya no está en ningún commit
git log --all --full-history --oneline -- .env
# No debería mostrar nada

# Verificar que .gitignore tiene .env
cat .gitignore | grep "^\.env$"
# Debería mostrar: .env
```

---

## 📝 Resumen

**Problema:** Clave secreta de Stripe en `.env` commitado  
**Solución:** 
1. ✅ Agregar `.env` a `.gitignore` (hecho)
2. ⏳ Eliminar `.env` del historial de Git
3. ⏳ Invalidar la clave y crear una nueva
4. ⏳ Hacer push limpio

**Prevención:** Usar `.env.example` sin secretos

---

## ⚠️ Importante

**Si ya compartiste el repositorio con otros:**
- La clave secreta YA está expuesta
- **REVOCA la clave inmediatamente** en Stripe Dashboard
- Genera una nueva clave
- Informa a tu equipo sobre el cambio

**Si es solo un repositorio personal:**
- Sigue los pasos para limpiar el historial
- Revoca la clave y crea una nueva

---

**¿Necesitas ayuda con algún paso específico?** 🤓


import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useState } from 'react'
import Button from '../components/ui/Button'
import Input from '../components/common/Input'
import { register as apiRegister } from '../services/auth'

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    telefono: '',
  })
  const [errors, setErrors] = useState({})

  const onSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    try {
      setLoading(true)
      await apiRegister(form)
      navigate(ROUTES.login)
    } catch (e) {
      const data = e?.response?.data
      if (typeof data === 'object' && !data.detail) {
        // Field-specific errors
        setErrors(data)
      } else {
        setErrors({ general: data?.detail || 'No se pudo registrar. Verifica los datos.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-responsive flex min-h-[calc(100vh-8rem)] items-center justify-center py-6 sm:py-10 page-anim">
      <div className="w-full max-w-lg">
        {/* Card principal */}
        <div className="card-surface p-5 sm:p-8 shadow-xl">
          {/* Header con logo */}
          <div className="mb-6 sm:mb-8 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] shadow-lg mb-4">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Crear cuenta</h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Completa tus datos para comenzar</p>
          </div>

          {/* Formulario */}
          <form className="space-y-4" onSubmit={onSubmit}>
            {/* Nombre y Apellido - Stack en móvil, grid en desktop */}
            <div className="space-y-4 sm:space-y-0 sm:grid sm:gap-4 sm:grid-cols-2">
              <Input
                label="Nombre"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                placeholder="Tu nombre"
                error={errors.first_name?.[0]}
                autoComplete="given-name"
              />
              <Input
                label="Apellido"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                placeholder="Tu apellido"
                error={errors.last_name?.[0]}
                autoComplete="family-name"
              />
            </div>
            
            <Input
              label="Usuario"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Elige un nombre de usuario"
              required
              error={errors.username?.[0]}
              autoComplete="username"
            />
            
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="tu@email.com"
              required
              error={errors.email?.[0]}
              autoComplete="email"
            />
            
            <Input
              label="Teléfono (opcional)"
              type="tel"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              placeholder="+1234567890"
              error={errors.telefono?.[0]}
              autoComplete="tel"
            />
            
            <Input
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Mínimo 8 caracteres"
              required
              error={errors.password?.[0]}
              autoComplete="new-password"
              hint="Mínimo 8 caracteres"
            />
            
            {/* Error general mejorado */}
            {errors.general && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">{errors.general}</p>
              </div>
            )}
            
            <Button type="submit" disabled={loading} className="w-full py-3 sm:py-2.5 text-sm sm:text-base font-semibold">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creando cuenta...
                </span>
              ) : 'Crear mi cuenta'}
            </Button>
          </form>
        </div>

        {/* Footer con enlace a login */}
        <div className="mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <Link 
              to={ROUTES.login} 
              className="text-[hsl(var(--primary))] hover:underline font-semibold underline-offset-4"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

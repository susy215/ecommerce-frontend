import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'
import Input from '../components/common/Input'

export default function Login() {
  const navigate = useNavigate()
  const { user, login, setError, error } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ username: '', password: '' })

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await login(form)
      // Redirect to intended path if stored by 401 handler
      const intended = sessionStorage.getItem('post_login_redirect')
      if (intended) {
        sessionStorage.removeItem('post_login_redirect')
        navigate(intended, { replace: true })
      } else {
        navigate(ROUTES.account)
      }
    } catch (err) {
      // El contexto ya intentó inferir el mensaje del backend; si no, muestra uno genérico
      if (!error) setError('Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  // If already logged and is cliente, redirect away from login
  if (user && user.rol === 'cliente') {
    navigate(ROUTES.account)
  }

  return (
    <div className="container-responsive flex min-h-[calc(100vh-8rem)] items-center justify-center py-6 sm:py-10 page-anim">
      <div className="w-full max-w-md">
        {/* Card principal */}
        <div className="card-surface p-5 sm:p-8 shadow-xl">
          {/* Header con logo */}
          <div className="mb-6 sm:mb-8 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] shadow-lg mb-4">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Bienvenido de nuevo</h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Inicia sesión para continuar</p>
          </div>

          {/* Formulario */}
          <form className="space-y-4 sm:space-y-5" onSubmit={onSubmit}>
            <Input
              label="Usuario o Email"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Tu usuario o email"
              required
              autoComplete="username"
            />
            <Input
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            
            {/* Error message mejorado */}
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}
            
            <Button type="submit" disabled={loading} className="w-full py-3 sm:py-2.5 text-sm sm:text-base font-semibold">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Entrando...
                </span>
              ) : 'Iniciar sesión'}
            </Button>
          </form>
        </div>

        {/* Footer con enlace a registro */}
        <div className="mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            ¿No tienes cuenta?{' '}
            <Link 
              to={ROUTES.register} 
              className="text-[hsl(var(--primary))] hover:underline font-semibold underline-offset-4"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

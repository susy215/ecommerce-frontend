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
    <div className="container-responsive flex min-h-[70vh] items-center justify-center py-10 page-anim">
      <div className="w-full max-w-md card-surface p-6 sm:p-8">
        <h1 className="mb-2 text-2xl font-semibold">Iniciar sesión</h1>
        <p className="mb-6 text-sm text-gray-600">Accede a tu cuenta para continuar</p>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            label="Usuario o Email"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Tu usuario o email"
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes cuenta? <Link to={ROUTES.register} className="text-[hsl(var(--primary))] hover:underline font-medium">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}

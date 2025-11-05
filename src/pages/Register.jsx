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
    <div className="container-responsive flex min-h-[60vh] items-center justify-center py-10 page-anim">
      <div className="w-full max-w-lg card-surface p-6 sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--primary))]/15">
            <span className="gradient-text text-lg">S</span>
          </div>
          <div>
            <div className="gradient-text font-semibold">SmartSales</div>
            <div className="text-xs text-gray-500">Crea tu cuenta en minutos</div>
          </div>
        </div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))]/10 px-3 py-1.5 text-[hsl(var(--primary))]">
          <span className="text-xs font-semibold uppercase tracking-wide">Crear cuenta</span>
        </div>
        <h1 className="mb-2 h2">Regístrate</h1>
        <p className="mb-4 subtitle">Completa el formulario para registrarte</p>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nombre"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              placeholder="Tu nombre"
              error={errors.first_name?.[0]}
            />
            <Input
              label="Apellido"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              placeholder="Tu apellido"
              error={errors.last_name?.[0]}
            />
          </div>
          <Input
            label="Usuario"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Elige un usuario"
            required
            error={errors.username?.[0]}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="tu@email.com"
            required
            error={errors.email?.[0]}
          />
          <Input
            label="Teléfono"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            placeholder="+1234567890"
            error={errors.telefono?.[0]}
          />
          <Input
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            required
            error={errors.password?.[0]}
          />
          {errors.general && <p className="text-sm text-red-600">{errors.general}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creando cuenta…' : 'Registrarme'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta? <Link to={ROUTES.login} className="text-[hsl(var(--primary))] hover:underline font-medium">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}

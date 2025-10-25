import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { updateProfile } from '../services/auth'
import Button from '../components/ui/Button'
import Input from '../components/common/Input'
import toast from '../utils/toastBus'

export default function Account() {
  const { user, refreshUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateProfile(form)
      await refreshUser()
      toast.success('Perfil actualizado')
      setEditing(false)
    } catch (e) {
      const msg = e?.response?.data?.detail || 'No se pudo actualizar el perfil'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-responsive py-8 page-anim">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-semibold">Mi cuenta</h1>
        
        <div className="card-surface p-6">
          {user ? (
            <>
              {!editing ? (
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 text-sm flex-1">
                      <p><span className="text-gray-500">Usuario:</span> <span className="font-medium">{user.username}</span></p>
                      <p><span className="text-gray-500">Email:</span> <span>{user.email || 'No especificado'}</span></p>
                      <p><span className="text-gray-500">Nombre:</span> <span>{[user.first_name, user.last_name].filter(Boolean).join(' ') || 'No especificado'}</span></p>
                      <p><span className="text-gray-500">Teléfono:</span> <span>{user.telefono || 'No especificado'}</span></p>
                      {user.rol && <p><span className="text-gray-500">Rol:</span> <span className="capitalize">{user.rol}</span></p>}
                    </div>
                    <Button variant="outline" onClick={() => setEditing(true)} className="ml-4">
                      Editar
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Nombre"
                      value={form.first_name}
                      onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                      placeholder="Tu nombre"
                    />
                    <Input
                      label="Apellido"
                      value={form.last_name}
                      onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                      placeholder="Tu apellido"
                    />
                  </div>
                  <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@ejemplo.com"
                  />
                  <Input
                    label="Teléfono"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    placeholder="+1234567890"
                  />
                  <div className="flex gap-3">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Guardando…' : 'Guardar cambios'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setEditing(false)
                        setForm({
                          first_name: user?.first_name || '',
                          last_name: user?.last_name || '',
                          email: user?.email || '',
                          telefono: user?.telefono || '',
                        })
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <p className="text-gray-600">No hay información de usuario.</p>
          )}
        </div>
      </div>
    </div>
  )
}

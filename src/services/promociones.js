import api from './apiClient'

export async function getPromociones(vigentes = true) {
  const params = vigentes ? { vigentes: 'true' } : {}
  const { data } = await api.get('/promociones/promociones/', { params })
  return data
}

export async function validarPromocion(codigo, monto) {
  // Según la documentación del backend, el endpoint es /validar_codigo/ con params
  const { data } = await api.get('/promociones/promociones/validar_codigo/', {
    params: {
      codigo: codigo.toUpperCase(),
      monto
    }
  })
  return data
}

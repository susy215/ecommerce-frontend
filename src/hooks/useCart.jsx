import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart_items')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items))
  }, [items])

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === product.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + qty }
        return next
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.nombre || product.name,
          price: Number(product.precio ?? product.price ?? 0),
          image: product.imagen || product.image,
          qty,
        },
      ]
    })
  }

  const removeItem = (id) => setItems((prev) => prev.filter((x) => x.id !== id))
  const updateQty = (id, qty) => setItems((prev) => prev.map((x) => (x.id === id ? { ...x, qty } : x)))
  const clear = () => setItems([])

  const { count, subtotal } = useMemo(() => {
    const count = items.reduce((s, x) => s + x.qty, 0)
    const subtotal = items.reduce((s, x) => s + x.qty * x.price, 0)
    return { count, subtotal }
  }, [items])

  const value = { items, addItem, removeItem, updateQty, clear, count, subtotal }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

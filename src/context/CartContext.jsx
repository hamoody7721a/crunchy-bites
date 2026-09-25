import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  // إضافة منتج للسلة
  function addItem(product) {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        // لو موجود، زيد الكمية
        return prev.map(i =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      // لو جديد، أضفه بكمية 1
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  // حذف منتج
  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  // تغيير الكمية
  function updateQuantity(id, quantity) {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, quantity } : i))
    )
  }

  // إفراغ السلة
  function clearCart() {
    setItems([])
  }

  // عدد الأطباق (مجموع الكميات)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  // السعر الإجمالي
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    count,
    total,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Custom Hook للاستخدام السهل
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
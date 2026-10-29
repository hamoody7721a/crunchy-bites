import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  // ➕ إضافة منتج للسلة
  // type: 'sandwich' أو 'meal' أو 'single'
  function addItem(product, type = 'single') {
    // معرف فريد لكل منتج + نوع (عشان السندويش والوجبة ما يتجمعوا)
    const uniqueId = `${product.id}-${type}`

    setItems(prev => {
      const existing = prev.find(i => i.uniqueId === uniqueId)

      if (existing) {
        return prev.map(i =>
          i.uniqueId === uniqueId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }

      // السعر يعتمد على النوع
      let price = product.price
      let typeLabel = ''

      if (type === 'sandwich') {
        price = product.priceSandwich
        typeLabel = 'سندويش'
      } else if (type === 'meal') {
        price = product.priceMeal
        typeLabel = 'وجبة'
      }

      return [
        ...prev,
        {
          ...product,
          price,
          type,
          typeLabel,
          uniqueId,
          quantity: 1,
        },
      ]
    })
  }

  // 🗑️ حذف منتج
  function removeItem(uniqueId) {
    setItems(prev => prev.filter(i => i.uniqueId !== uniqueId))
  }

  // 🔢 تغيير الكمية
  function updateQuantity(uniqueId, quantity) {
    if (quantity <= 0) {
      removeItem(uniqueId)
      return
    }
    setItems(prev =>
      prev.map(i => (i.uniqueId === uniqueId ? { ...i, quantity } : i))
    )
  }

  // 🧹 إفراغ السلة
  function clearCart() {
    setItems([])
  }

  // 🔢 عدد العناصر
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  // 💰 المجموع
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

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
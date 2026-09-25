import { useCart } from '../context/CartContext'

// ⚠️ غيّر هذا الرقم لرقم واتساب المطعم (بدون + وبدون 00)
// مثال: سوريا → 963xxxxxxxxx
const WHATSAPP_NUMBER = '963987415935'

function Cart() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart()

  // إنشاء رسالة الواتساب
  function sendOrder() {
    if (items.length === 0) {
      alert('السلة فارغة!')
      return
    }

    // بناء نص الرسالة
    let message = '🍔 *طلب جديد من Crunchy Bites*\n\n'
    message += '*الأصناف:*\n'

    items.forEach((item, index) => {
      message += `${index + 1}. ${item.emoji || '🍽️'} ${item.name} × ${item.quantity} = ${item.price * item.quantity} ل.س\n`
    })

    message += `\n*المجموع:* ${total} ل.س\n`
    message += '\nشكراً! 🙏'

    // فتح واتساب
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  // السلة فارغة
  if (items.length === 0) {
    return (
      <main className="main">
        <div className="empty-cart">
          <div className="empty-icon">🛒</div>
          <h2>السلة فارغة</h2>
          <p>لم تضف أي منتج بعد</p>
        </div>
      </main>
    )
  }

  return (
    <main className="main">
      <h1 className="page-title">🛒 سلة الطلبات</h1>

      <div className="cart-list">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-emoji">{item.emoji || '🍽️'}</div>

            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>{item.price} ل.س</p>
            </div>

            <div className="cart-item-qty">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>

            <div className="cart-item-total">
              {item.price * item.quantity} ل.س
            </div>

            <button
              className="cart-item-remove"
              onClick={() => removeItem(item.id)}
              title="حذف"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <span>المجموع:</span>
          <strong>{total} ل.س</strong>
        </div>

        <div className="cart-actions">
          <button className="btn-whatsapp" onClick={sendOrder}>
            📱 أرسل الطلب عبر واتساب
          </button>
          <button className="btn-clear" onClick={clearCart}>
            إفراغ السلة
          </button>
        </div>
      </div>
    </main>
  )
}

export default Cart
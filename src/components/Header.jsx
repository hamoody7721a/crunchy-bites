import { useCart } from '../context/CartContext'

function Header({ onCartClick }) {
  const { count } = useCart()

  return (
    <header className="header">
      <h1>Crunchy Bites 🍔</h1>
      <nav>
        <a href="#">الرئيسية</a>
        <a href="#">القائمة</a>
        <a href="#" className="cart-link" onClick={(e) => {
          e.preventDefault()
          onCartClick()
        }}>
          🛒 السلة
          {count > 0 && <span className="cart-badge">{count}</span>}
        </a>
      </nav>
    </header>
  )
}

export default Header
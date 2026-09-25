import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Header() {
  const { count } = useCart()

  return (
    <header className="header">
      <Link to="/" className="header-logo">
        <h1>Crunchy Bites 🍔</h1>
      </Link>
      <nav>
        <Link to="/">الرئيسية</Link>
        <Link to="/about">من نحن</Link>
        <Link to="/cart" className="cart-link">
          🛒 السلة
          {count > 0 && <span className="cart-badge">{count}</span>}
        </Link>
      </nav>
    </header>
  )
}

export default Header
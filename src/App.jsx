import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'

import Header from './components/Header'
import Footer from './components/Footer'
import CircularGallery from './components/CircularGallery'
import Admin from './pages/Admin'
import Cart from './pages/Cart'
import About from './pages/About'
import { useCart } from './context/CartContext'
import './App.css'

const CATEGORIES = [
  { key: 'meat', label: '🥩 لحم' },
  { key: 'chicken-grilled', label: '🍗 دجاج مشوي' },
  { key: 'chicken-fried', label: '🍗 دجاج مقلي' },
  { key: 'salads', label: '🥗 سلطات' },
  { key: 'cold-sandwiches', label: '🌯 سندويشات باردة' },
  { key: 'drinks', label: '🥤 مشاريب وحلويات' },
]

function HomePage() {
  const { addItem } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function fetchProducts() {
      try {
        const snapshot = await getDocs(collection(db, 'products'))
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        setProducts(data)
      } catch (error) {
        console.error('خطأ في جلب المنتجات:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = searchTerm.trim()
    ? products.filter(p => {
        const term = searchTerm.toLowerCase().trim()
        return (p.name || '').toLowerCase().includes(term) || (p.ingredients || '').toLowerCase().includes(term)
      })
    : products

  const hasResults = filteredProducts.length > 0

  return (
    <div>
      <Header />
      <main className="main">
        <h1 className="page-title">قائمة Crunchy Bites 🍔</h1>

        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="ابحث عن طبق أو مكون..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>جاري التحميل...</p>
        ) : products.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>لا توجد منتجات حالياً</p>
        ) : !hasResults ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>لا توجد نتائج</h3>
            <p>جرّب كلمة بحث مختلفة</p>
            <button onClick={() => setSearchTerm('')} className="btn-clear-search">مسح البحث</button>
          </div>
        ) : (
          <>
            {searchTerm && (
              <p className="search-results-info">
                نتائج البحث عن "<strong>{searchTerm}</strong>": {filteredProducts.length} طبق
              </p>
            )}

            {CATEGORIES.map(cat => {
              const catItems = filteredProducts.filter(p => p.category === cat.key)
              if (catItems.length === 0) return null
              return (
                <section key={cat.key} className="section">
                  <h2 className="section-title">{cat.label}</h2>
                  <CircularGallery items={catItems} addItem={addItem} />
                </section>
              )
            })}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/about" element={<About />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}

export default App
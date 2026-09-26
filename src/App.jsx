import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import Header from './components/Header'
import Card from './components/Card'
import Footer from './components/Footer'
import Admin from './pages/Admin'
import Cart from './pages/Cart'
import About from './pages/About'
import { useCart } from './context/CartContext'
import './App.css'

function Section({ title, items }) {
  const { addItem } = useCart()

  if (items.length === 0) return null

  return (
    <section className="section">
      <h2 className="section-title">{title}</h2>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          900: { slidesPerView: 3 },
          1200: { slidesPerView: 4 },
        }}
      >
        {items.map(item => (
          <SwiperSlide key={item.id}>
            <Card
              title={item.name}
              price={item.price}
              emoji={item.emoji}
              image={item.image}
              ingredients={item.ingredients}
              onAdd={() => addItem(item)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

// 🏠 الصفحة الرئيسية
function HomePage() {
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

  // 🔍 فلترة حسب البحث
  const filteredProducts = searchTerm.trim()
    ? products.filter(p => {
        const term = searchTerm.toLowerCase().trim()
        const name = (p.name || '').toLowerCase()
        const ingredients = (p.ingredients || '').toLowerCase()
        return name.includes(term) || ingredients.includes(term)
      })
    : products

  const foodItems = filteredProducts.filter(p => p.category === 'food')
  const sidesItems = filteredProducts.filter(p => p.category === 'sides')
  const drinksItems = filteredProducts.filter(p => p.category === 'drinks')

  const hasResults = filteredProducts.length > 0

  return (
    <div>
      <Header />

      <main className="main">
        <h1 className="page-title">قائمة Crunchy Bites 🍔</h1>

        {/* 🔍 حقل البحث */}
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
            <button
              className="search-clear"
              onClick={() => setSearchTerm('')}
              title="مسح"
            >
              ✕
            </button>
          )}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>
            جاري التحميل...
          </p>
        ) : products.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>
            لا توجد منتجات حالياً
          </p>
        ) : !hasResults ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>لا توجد نتائج</h3>
            <p>جرّب كلمة بحث مختلفة</p>
            <button
              onClick={() => setSearchTerm('')}
              className="btn-clear-search"
            >
              مسح البحث
            </button>
          </div>
        ) : (
          <>
            {searchTerm && (
              <p className="search-results-info">
                نتائج البحث عن "<strong>{searchTerm}</strong>": {filteredProducts.length} طبق
              </p>
            )}
            <Section title="🍽️ الأكل" items={foodItems} />
            <Section title="🥗 مقبلات وسلطات" items={sidesItems} />
            <Section title="🥤 مشاريب وحلويات" items={drinksItems} />
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

// 🚦 المسارات
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
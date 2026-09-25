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
import { useCart } from './context/CartContext'
import './App.css'

import About from './pages/About'

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

  const foodItems = products.filter(p => p.category === 'food')
  const sidesItems = products.filter(p => p.category === 'sides')
  const drinksItems = products.filter(p => p.category === 'drinks')

  return (
    <div>
      <Header />

      <main className="main">
        <h1 className="page-title">قائمة Crunchy Bites 🍔</h1>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>
            جاري التحميل...
          </p>
        ) : products.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>
            لا توجد منتجات حالياً
          </p>
        ) : (
          <>
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
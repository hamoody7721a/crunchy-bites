import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

function CircularGallery({ items, addItem }) {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [addedMessage, setAddedMessage] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  
  // لحالة السحب
  const dragStartX = useRef(null)

  // تحريك تلقائي (يتوقف عند التفاعل)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (items.length <= 1 || !isAutoPlaying) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [items.length, isAutoPlaying])

  if (items.length === 0) return null

  // دوال التنقل
  function next() {
    setActiveIndex((prev) => (prev + 1) % items.length)
    setIsAutoPlaying(false)
  }

  function prev() {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
    setIsAutoPlaying(false)
  }

  // دوال السحب (Drag)
  function handlePointerDown(e) {
    dragStartX.current = e.clientX
    setIsAutoPlaying(false)
  }

  function handlePointerUp(e) {
    if (dragStartX.current === null) return
    const dragDistance = e.clientX - dragStartX.current
    
    // إذا سحب مسافة كافية، نغير الكرت
    if (dragDistance > 50) {
      prev()
    } else if (dragDistance < -50) {
      next()
    }
    
    dragStartX.current = null
  }

  function handleAdd(product, type) {
    addItem(product, type)
    setSelectedProduct(null)
    setAddedMessage('تمت الإضافة للسلة بنجاح! ✅')
    setTimeout(() => setAddedMessage(''), 2000)
  }

  // حساب شكل الكرت
  function getCardStyle(index) {
    let diff = index - activeIndex
    if (diff > items.length / 2) diff -= items.length
    if (diff < -items.length / 2) diff += items.length

    // إخفاء الكروت البعيدة جداً
    const isHidden = Math.abs(diff) > 2

    return {
      zIndex: 10 - Math.abs(diff),
      transform: `translateX(${diff * 160}px) translateZ(${Math.abs(diff) * -120}px) rotateY(${diff * -30}deg) scale(${diff === 0 ? 1.05 : 0.85})`,
      opacity: isHidden ? 0 : 1,
      pointerEvents: isHidden ? 'none' : 'auto',
      display: isHidden ? 'none' : 'block',
    }
  }

  return (
    <>
      <AnimatePresence>
        {addedMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="toast-message"
          >
            {addedMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* السلايدر */}
      <div 
        className="custom-carousel-container"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="custom-carousel-stage">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className="custom-slide"
              style={getCardStyle(index)}
              initial={false}
              animate={getCardStyle(index)}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              onClick={() => {
                // نتأكد إنه ما كان في سحب
                if (dragStartX.current === null) {
                  setSelectedProduct(item)
                }
              }}
            >
              <div className="modern-card">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="modern-card-image" />
                ) : (
                  <div className="modern-card-emoji">{item.emoji || '🍽️'}</div>
                )}
                <div className="modern-card-overlay">
                  <h3>{item.name}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* أزرار التنقل */}
        <button className="carousel-nav-btn prev" onClick={prev}>◀</button>
        <button className="carousel-nav-btn next" onClick={next}>▶</button>
      </div>

      {/* النافذة المنبثقة (Modal) */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedProduct(null)}>✕</button>
              
              <div className="modal-image-wrapper">
                {selectedProduct.image ? (
                  <img src={selectedProduct.image} alt={selectedProduct.name} />
                ) : (
                  <div className="modal-emoji">{selectedProduct.emoji || '🍽️'}</div>
                )}
              </div>

              <div className="modal-details">
                <h2>{selectedProduct.name}</h2>
                <p className="modal-ingredients">
                  {selectedProduct.ingredients || 'لا توجد مكونات مضافة'}
                </p>

                {selectedProduct.hasTypes ? (
                  <div className="modal-actions">
                    <button type="button" className="modal-btn btn-sandwich" onClick={() => handleAdd(selectedProduct, 'sandwich')}>
                      <span>🌯 سندويش</span>
                      <span>{selectedProduct.priceSandwich} ل.س</span>
                    </button>
                    <button type="button" className="modal-btn btn-meal" onClick={() => handleAdd(selectedProduct, 'meal')}>
                      <span>🍱 وجبة</span>
                      <span>{selectedProduct.priceMeal} ل.س</span>
                    </button>
                  </div>
                ) : (
                  <div className="modal-actions">
                    <button type="button" className="modal-btn btn-single" onClick={() => handleAdd(selectedProduct, 'single')}>
                      أضف للسلة - {selectedProduct.price} ل.س
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default CircularGallery
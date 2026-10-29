import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

function CircularGallery({ items, addItem }) {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [addedMessage, setAddedMessage] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  
  // حالة السحب
  const dragStartX = useRef(null)
  const dragStartY = useRef(null)
  const isDragging = useRef(false)

  // تحريك تلقائي
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (items.length <= 1 || !isAutoPlaying) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [items.length, isAutoPlaying])

  if (items.length === 0) return null

  function next() {
    setActiveIndex((prev) => (prev + 1) % items.length)
    setIsAutoPlaying(false)
  }

  function prev() {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
    setIsAutoPlaying(false)
  }

  // 🖱️📱 دعم السحب (ماوس + لمس)
  function handleDragStart(clientX, clientY) {
    dragStartX.current = clientX
    dragStartY.current = clientY
    isDragging.current = false
    setIsAutoPlaying(false)
  }

  function handleDragMove(clientX, clientY) {
    if (dragStartX.current === null) return
    const diffX = Math.abs(clientX - dragStartX.current)
    const diffY = Math.abs(clientY - dragStartY.current)
    
    // إذا تحرك أكثر من 10 بكسل، نعتبره سحب
    if (diffX > 10 || diffY > 10) {
      isDragging.current = true
    }
  }

  function handleDragEnd(clientX) {
    if (dragStartX.current === null) return
    const dragDistance = clientX - dragStartX.current
    
    if (dragDistance > 50) {
      prev()
    } else if (dragDistance < -50) {
      next()
    }
    
    dragStartX.current = null
    dragStartY.current = null
  }

  function handleAdd(product, type) {
    addItem(product, type)
    setSelectedProduct(null)
    setAddedMessage('تمت الإضافة للسلة بنجاح! ✅')
    setTimeout(() => setAddedMessage(''), 2000)
  }

  function getCardStyle(index) {
    let diff = index - activeIndex
    if (diff > items.length / 2) diff -= items.length
    if (diff < -items.length / 2) diff += items.length
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

      <div 
        className="custom-carousel-container"
        // دعم الماوس
        onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
        onMouseUp={(e) => handleDragEnd(e.clientX)}
        onMouseLeave={() => { dragStartX.current = null; setIsAutoPlaying(true) }}
        // دعم اللمس
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
        onMouseEnter={() => setIsAutoPlaying(false)}
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
                // نفتح المودال فقط إذا ما كان المستخدم يسحب
                if (!isDragging.current) {
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

        <button className="carousel-nav-btn prev" onClick={(e) => { e.stopPropagation(); prev(); }}>◀</button>
        <button className="carousel-nav-btn next" onClick={(e) => { e.stopPropagation(); next(); }}>▶</button>
      </div>

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
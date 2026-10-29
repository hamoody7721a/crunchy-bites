import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

function CircularGallery({ items, addItem }) {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [addedMessage, setAddedMessage] = useState('')
  const [hoveredIndex, setHoveredIndex] = useState(null)

  if (items.length === 0) return null

  function handleAdd(product, type) {
    addItem(product, type)
    setSelectedProduct(null)
    setAddedMessage('تمت الإضافة للسلة بنجاح! ✅')
    setTimeout(() => setAddedMessage(''), 2000)
  }

  // حساب شكل الكرت (مروحة)
  function getCardStyle(index) {
    const center = (items.length - 1) / 2
    const offset = index - center
    
    // إذا كان الكرت هو اللي عليه الماوس، نبعده شوي
    const isHovered = hoveredIndex === index
    const isAnyHovered = hoveredIndex !== null

    // زاوية الكرت
    const rotate = offset * 12
    // مسافة الأفقية
    const translateX = offset * 80
    // مسافة العمق (البعيد شوي)
    const translateY = Math.abs(offset) * 20
    // رفع الكرت عند الهوفر
    const hoverTranslateY = isHovered ? -40 : 0
    const hoverScale = isHovered ? 1.08 : 1

    return {
      zIndex: isHovered ? 50 : index,
      transform: `
        translateX(${translateX}px) 
        translateY(${translateY + hoverTranslateY}px) 
        rotate(${rotate}deg) 
        scale(${hoverScale})
      `,
      // الكروت اللي مو الماوس عليها تظلم شوي
      opacity: isAnyHovered && !isHovered ? 0.7 : 1,
      filter: isAnyHovered && !isHovered ? 'brightness(0.7)' : 'brightness(1)',
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

      {/* السلايدر (مروحة الكروت) */}
      <div className="fan-carousel-container">
        <div className="fan-carousel-stage">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className="fan-card-wrapper"
              style={getCardStyle(index)}
              initial={false}
              animate={getCardStyle(index)}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedProduct(item)}
            >
              <div className="fan-card">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="fan-card-image" />
                ) : (
                  <div className="fan-card-emoji">{item.emoji || '🍽️'}</div>
                )}
                
                <div className="fan-card-overlay">
                  <h3>{item.name}</h3>
                  <span className="fan-card-price">
                    {item.hasTypes ? `يبدأ من ${item.priceSandwich} ل.س` : `${item.price} ل.س`}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* المودال */}
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
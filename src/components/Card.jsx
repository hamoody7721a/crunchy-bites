function Card({ product, onAdd }) {
  const {
    name,
    image,
    emoji,
    ingredients,
    price,
    priceSandwich,
    priceMeal,
    hasTypes, // true لو عنده سندويش ووجبة
  } = product

  // تحويل المكونات لنص منظم
  const ingredientsList = ingredients
    ? ingredients.split(',').map(i => i.trim()).filter(Boolean)
    : []

  return (
    <div className="card">
      {image ? (
        <img src={image} alt={name} className="card-image" />
      ) : (
        <div className="card-emoji">{emoji || '🍽️'}</div>
      )}

      <h3>{name}</h3>

      {ingredientsList.length > 0 && (
        <p className="card-ingredients">
          {ingredientsList.join(' • ')}
        </p>
      )}

      {/* 💰 السعر — حسب النوع */}
      {hasTypes ? (
        <div className="card-prices">
          <div className="price-option">
            <span className="price-label">🌯 سندويش</span>
            <span className="price-value">{priceSandwich} ل.س</span>
          </div>
          <div className="price-option">
            <span className="price-label">🍱 وجبة</span>
            <span className="price-value">{priceMeal} ل.س</span>
          </div>
        </div>
      ) : (
        <p className="card-price">{price} ل.س</p>
      )}

      {/* 🔘 الأزرار */}
      {hasTypes ? (
        <div className="card-buttons">
          <button
            className="card-btn btn-sandwich"
            onClick={() => onAdd('sandwich')}
          >
            🌯 سندويش
          </button>
          <button
            className="card-btn btn-meal"
            onClick={() => onAdd('meal')}
          >
            🍱 وجبة
          </button>
        </div>
      ) : (
        <button
          className="card-btn"
          onClick={() => onAdd('single')}
        >
          أضف للسلة
        </button>
      )}
    </div>
  )
}

export default Card
function Card({ title, price, image, emoji, ingredients, onAdd }) {
  const ingredientsList = ingredients
    ? ingredients.split(',').map(i => i.trim()).filter(Boolean)
    : []

  return (
    <div className="card">
      {image ? (
        <img src={image} alt={title} className="card-image" />
      ) : (
        <div className="card-emoji">{emoji || '🍽️'}</div>
      )}

      <h3>{title}</h3>

      {ingredientsList.length > 0 && (
        <p className="card-ingredients">
          {ingredientsList.join(' • ')}
        </p>
      )}

      <p className="card-price">{price} ل.س</p>

      <button className="card-btn" onClick={onAdd}>
        أضف للسلة
      </button>
    </div>
  )
}

export default Card
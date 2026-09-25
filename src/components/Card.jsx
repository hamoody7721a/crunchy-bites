function Card({ title, price, image, emoji, onAdd }) {
  return (
    <div className="card">
      {image ? (
        <img src={image} alt={title} className="card-image" />
      ) : (
        <div className="card-emoji">{emoji || '🍽️'}</div>
      )}
      <h3>{title}</h3>
      <p className="card-price">{price} ل.س</p>
      <button className="card-btn" onClick={onAdd}>
        أضف للسلة
      </button>
    </div>
  )
}

export default Card
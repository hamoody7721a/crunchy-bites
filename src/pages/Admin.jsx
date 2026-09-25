import { useState, useEffect } from 'react'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from 'firebase/firestore'
import { db } from '../firebase'

function Admin() {
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState('')

  // بيانات المنتج الجديد
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [emoji, setEmoji] = useState('')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('food')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')

  // قائمة المنتجات
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  // تعديل منتج
  const [editingId, setEditingId] = useState(null)
  const [editPrice, setEditPrice] = useState('')
  const [editName, setEditName] = useState('')

  // 📥 جلب المنتجات
  async function fetchProducts() {
    try {
      setLoadingProducts(true)
      const snapshot = await getDocs(collection(db, 'products'))
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      setProducts(data)
    } catch (err) {
      console.error(err)
      setError('خطأ في جلب المنتجات')
    } finally {
      setLoadingProducts(false)
    }
  }

  useEffect(() => {
    if (isLoggedIn) fetchProducts()
  }, [isLoggedIn])

  // 🔐 تسجيل الدخول
  function handleLogin(e) {
    e.preventDefault()
    if (password === 'crunchy123') {
      setIsLoggedIn(true)
      setError('')
    } else {
      setError('كلمة السر غير صحيحة')
    }
  }

  // 📷 تحويل الصورة لـ Base64 مع ضغطها
  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('الرجاء اختيار صورة صحيحة')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('الصورة كبيرة جداً (الحد الأقصى 5MB)')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX = 600
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX) {
            height *= MAX / width
            width = MAX
          }
        } else {
          if (height > MAX) {
            width *= MAX / height
            height = MAX
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        setImage(canvas.toDataURL('image/jpeg', 0.7))
        setError('')
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  // ➕ إضافة منتج
  async function handleAddProduct(e) {
    e.preventDefault()
    if (!name || !price) {
      setError('الرجاء ملء الاسم والسعر')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      await addDoc(collection(db, 'products'), {
        name: name.trim(),
        price: Number(price),
        emoji: emoji.trim() || '🍽️',
        image: image || '',
        category: category,
      })

      setSuccess('✅ تم إضافة المنتج بنجاح!')
      setName('')
      setPrice('')
      setEmoji('')
      setImage('')
      setCategory('food')

      fetchProducts()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error(err)
      setError('حدث خطأ أثناء الإضافة')
    } finally {
      setSaving(false)
    }
  }

  // 🗑️ حذف منتج
  async function handleDelete(id) {
    if (!confirm('هل أنت متأكد من الحذف؟')) return

    try {
      await deleteDoc(doc(db, 'products', id))
      fetchProducts()
    } catch (err) {
      console.error(err)
      setError('خطأ في الحذف')
    }
  }

  // ✏️ بدء تعديل منتج
  function startEdit(product) {
    setEditingId(product.id)
    setEditPrice(product.price)
    setEditName(product.name)
  }

  // ✏️ حفظ التعديل
  async function handleSaveEdit(id) {
    if (!editName || !editPrice) return

    try {
      await updateDoc(doc(db, 'products', id), {
        name: editName.trim(),
        price: Number(editPrice),
      })
      setEditingId(null)
      fetchProducts()
    } catch (err) {
      console.error(err)
      setError('خطأ في التعديل')
    }
  }

  // 🔐 شاشة الدخول
  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <div className="admin-login-box">
          <div className="admin-logo">🍔</div>
          <h1>Crunchy Bites</h1>
          <p className="admin-subtitle">لوحة التحكم</p>

          <form onSubmit={handleLogin} className="admin-form">
            <div className="admin-input-wrapper">
              <span className="admin-input-icon">🔒</span>
              <input
                type="password"
                placeholder="أدخل كلمة السر"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            <button type="submit">دخول</button>
          </form>

          {error && <div className="admin-error"><span>⚠️</span> {error}</div>}
          <a href="/" className="admin-back-link">← العودة للموقع</a>
        </div>
      </div>
    )
  }

  // 🛠️ لوحة التحكم
  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h1>🛠️ لوحة التحكم</h1>
          <p className="admin-panel-subtitle">
            {products.length} منتج في القائمة
          </p>
        </div>
        <button className="admin-logout" onClick={() => setIsLoggedIn(false)}>
          تسجيل خروج
        </button>
      </div>

      {/* 📋 قائمة المنتجات */}
      <div className="products-manager">
        <h2 className="manager-title">📋 منتجاتي</h2>

        {loadingProducts ? (
          <p className="loading-text">جاري التحميل...</p>
        ) : products.length === 0 ? (
          <p className="loading-text">لا توجد منتجات بعد</p>
        ) : (
          <div className="products-list">
            {products.map(p => (
              <div key={p.id} className="product-row">
                <div className="product-thumb">
                  {p.image ? (
                    <img src={p.image} alt={p.name} />
                  ) : (
                    <span>{p.emoji || '🍽️'}</span>
                  )}
                </div>

                {editingId === p.id ? (
                  // وضع التعديل
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="inline-input"
                      placeholder="الاسم"
                    />
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="inline-input inline-price"
                      placeholder="السعر"
                    />
                    <div className="row-actions">
                      <button
                        className="btn-mini btn-save-mini"
                        onClick={() => handleSaveEdit(p.id)}
                      >
                        ✓
                      </button>
                      <button
                        className="btn-mini btn-cancel-mini"
                        onClick={() => setEditingId(null)}
                      >
                        ✕
                      </button>
                    </div>
                  </>
                ) : (
                  // وضع العرض
                  <>
                    <div className="product-row-info">
                      <h4>{p.name}</h4>
                      <span className="row-category">
                        {p.category === 'food' && '🍽️ أكل'}
                        {p.category === 'sides' && '🥗 مقبلات'}
                        {p.category === 'drinks' && '🥤 مشاريب'}
                      </span>
                    </div>
                    <div className="row-price">{p.price} ل.س</div>
                    <div className="row-actions">
                      <button
                        className="btn-mini btn-edit-mini"
                        onClick={() => startEdit(p)}
                        title="تعديل"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-mini btn-delete-mini"
                        onClick={() => handleDelete(p.id)}
                        title="حذف"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ➕ إضافة منتج جديد */}
      <div className="add-product-section">
        <h2 className="manager-title">➕ إضافة منتج جديد</h2>

        <form onSubmit={handleAddProduct} className="product-form">
          <div className="form-group">
            <label>اسم المنتج *</label>
            <input
              type="text"
              placeholder="مثال: برغر كلاسيك"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>السعر (ل.س) *</label>
              <input
                type="number"
                placeholder="مثال: 50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>الإيموجي</label>
              <input
                type="text"
                placeholder="🍔"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={2}
              />
            </div>
          </div>

          <div className="form-group">
            <label>صورة المنتج (اختياري)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            <small className="form-hint">
              💡 اختر صورة من جهازك (سيتم ضغطها تلقائياً)
            </small>
          </div>

          {image && (
            <div className="image-preview">
              <img src={image} alt="معاينة" />
              <button
                type="button"
                className="btn-remove-image"
                onClick={() => setImage('')}
              >
                ✕ إزالة الصورة
              </button>
            </div>
          )}

          <div className="form-group">
            <label>التصنيف</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="food">🍽️ أكل</option>
              <option value="sides">🥗 مقبلات وسلطات</option>
              <option value="drinks">🥤 مشاريب وحلويات</option>
            </select>
          </div>

          {error && <div className="admin-error">⚠️ {error}</div>}
          {success && <div className="admin-success">{success}</div>}

          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'جاري الحفظ...' : '➕ إضافة المنتج'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Admin
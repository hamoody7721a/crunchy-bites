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

const CATEGORIES = [
  { value: 'meat', label: '🥩 لحم' },
  { value: 'chicken-grilled', label: '🍗 دجاج مشوي' },
  { value: 'chicken-fried', label: '🍗 دجاج مقلي' },
  { value: 'salads', label: '🥗 سلطات' },
  { value: 'cold-sandwiches', label: '🌯 سندويشات باردة' },
  { value: 'drinks', label: '🥤 مشاريب وحلويات' },
]

function Admin() {
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState('')

  // بيانات المنتج
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [hasTypes, setHasTypes] = useState(false)
  const [priceSandwich, setPriceSandwich] = useState('')
  const [priceMeal, setPriceMeal] = useState('')
  const [emoji, setEmoji] = useState('')
  const [image, setImage] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [category, setCategory] = useState('meat')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')

  // قائمة المنتجات + تعديل
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [editingId, setEditingId] = useState(null)

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
    if (password === 'CrunchyBites@2026') {
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

  // 🔄 تفريغ الحقول
  function resetForm() {
    setName('')
    setPrice('')
    setHasTypes(false)
    setPriceSandwich('')
    setPriceMeal('')
    setEmoji('')
    setImage('')
    setIngredients('')
    setCategory('meat')
    setEditingId(null)
  }

  // ✏️ بدء التعديل
  function startEdit(product) {
    setEditingId(product.id)
    setName(product.name || '')
    setPrice(product.price || '')
    setHasTypes(product.hasTypes || false)
    setPriceSandwich(product.priceSandwich || '')
    setPriceMeal(product.priceMeal || '')
    setEmoji(product.emoji || '')
    setImage(product.image || '')
    setIngredients(product.ingredients || '')
    setCategory(product.category || 'meat')
    setError('')
    setSuccess('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ➕ إضافة أو 💾 حفظ
  async function handleSubmit(e) {
    e.preventDefault()

    if (!name) {
      setError('الرجاء ملء الاسم')
      return
    }

    if (hasTypes) {
      if (!priceSandwich || !priceMeal) {
        setError('الرجاء ملء سعري السندويش والوجبة')
        return
      }
    } else {
      if (!price) {
        setError('الرجاء ملء السعر')
        return
      }
    }

    setSaving(true)
    setError('')
    setSuccess('')

    const productData = {
      name: name.trim(),
      hasTypes: hasTypes,
      price: hasTypes ? 0 : Number(price),
      priceSandwich: hasTypes ? Number(priceSandwich) : 0,
      priceMeal: hasTypes ? Number(priceMeal) : 0,
      emoji: emoji.trim() || '🍽️',
      image: image || '',
      ingredients: ingredients.trim(),
      category: category,
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), productData)
        setSuccess('✅ تم تحديث المنتج بنجاح!')
      } else {
        await addDoc(collection(db, 'products'), productData)
        setSuccess('✅ تم إضافة المنتج بنجاح!')
      }

      resetForm()
      fetchProducts()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error(err)
      setError(editingId ? 'حدث خطأ أثناء التعديل' : 'حدث خطأ أثناء الإضافة')
    } finally {
      setSaving(false)
    }
  }

  // 🗑️ حذف
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
            {products.map(p => {
              const catLabel = CATEGORIES.find(c => c.value === p.category)?.label || p.category
              return (
                <div
                  key={p.id}
                  className={`product-row ${editingId === p.id ? 'product-row-editing' : ''}`}
                >
                  <div className="product-thumb">
                    {p.image ? (
                      <img src={p.image} alt={p.name} />
                    ) : (
                      <span>{p.emoji || '🍽️'}</span>
                    )}
                  </div>

                  <div className="product-row-info">
                    <h4>{p.name}</h4>
                    <span className="row-category">{catLabel}</span>
                  </div>

                  <div className="row-price">
                    {p.hasTypes ? (
                      <>
                        🌯 {p.priceSandwich} | 🍱 {p.priceMeal}
                      </>
                    ) : (
                      <>{p.price} ل.س</>
                    )}
                  </div>

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
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ➕ / 💾 النموذج */}
      <div className="add-product-section">
        <h2 className="manager-title">
          {editingId ? '✏️ تعديل المنتج' : '➕ إضافة منتج جديد'}
        </h2>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>اسم المنتج *</label>
            <input
              type="text"
              placeholder="مثال: شاورما دجاج"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>التصنيف *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* 💰 خيار السندويش/الوجبة */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={hasTypes}
                onChange={(e) => setHasTypes(e.target.checked)}
              />
              <span>يدعم سندويش ووجبة (سعرين)</span>
            </label>
          </div>

          {/* الأسعار */}
          {hasTypes ? (
            <div className="form-row">
              <div className="form-group">
                <label>سعر السندويش (ل.س) *</label>
                <input
                  type="number"
                  placeholder="40"
                  value={priceSandwich}
                  onChange={(e) => setPriceSandwich(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>سعر الوجبة (ل.س) *</label>
                <input
                  type="number"
                  placeholder="70"
                  value={priceMeal}
                  onChange={(e) => setPriceMeal(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label>السعر (ل.س) *</label>
              <input
                type="number"
                placeholder="50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label>الإيموجي (اختياري)</label>
            <input
              type="text"
              placeholder="🍔"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              maxLength={2}
            />
          </div>

          <div className="form-group">
            <label>المكونات (اختياري)</label>
            <textarea
              placeholder="مثال: خبز، لحم، جبن، خس، طماطم"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              rows={3}
              className="form-textarea"
            />
            <small className="form-hint">
              💡 اكتب المكونات مفصولة بفاصلة (,)
            </small>
          </div>

          <div className="form-group">
            <label>صورة المنتج</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            <small className="form-hint">
              💡 اختر صورة جديدة لاستبدالها، أو اتركها فارغة لعدم التغيير
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

          {error && <div className="admin-error">⚠️ {error}</div>}
          {success && <div className="admin-success">{success}</div>}

          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={saving}>
              {saving
                ? 'جاري الحفظ...'
                : editingId
                ? '💾 حفظ التعديل'
                : '➕ إضافة المنتج'}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn-cancel-edit"
                onClick={resetForm}
              >
                ✕ إلغاء التعديل
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Admin
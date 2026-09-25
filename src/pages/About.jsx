import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const SITE_URL = 'https://crunchy-bites.pages.dev'

function About() {
  return (
    <div>
      <Header />

      <main className="main">
        <Link to="/" className="back-btn">← رجوع للقائمة</Link>

        <h1 className="page-title">من نحن</h1>

        <section className="about-section">
          <div className="about-card">
            <div className="about-icon">🍔</div>
            <h2>Crunchy Bites</h2>
            <p className="about-text">
              منذ افتتاحنا، ونحن في Crunchy Bites نؤمن بأن الطعام الجيد يجمع الناس.
              نقدم لكم قائمة متنوعة من الأطباق الشهية، محضّرة يومياً بمكونات طازجة وجودة عالية.
            </p>
          </div>
        </section>

        <section className="about-section">
          <h2 className="section-title">خدماتنا</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🚗</div>
              <h3>توصيل منزلي</h3>
              <p>نوصل طلبك لباب البيت</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🥡</div>
              <h3>سفري</h3>
              <p>اطلب واستلم من المطعم</p>
            </div>
            <div className="service-card">
              <div className="service-icon">📅</div>
              <h3>حجز طاولات</h3>
              <p>احجز طاولتك مسبقاً</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🎉</div>
              <h3>حفلات ومناسبات</h3>
              <p>ننظّم مناسباتكم</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2 className="section-title">معلومات الاتصال</h2>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">📍</div>
              <h3>العنوان</h3>
              <p>الصالحية - مصب القهوة<br />جانب فرن ميبر</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3>الهاتف</h3>
              <a href="tel:+963938831878" dir="ltr">+963 938 831 878</a>
            </div>

            <div className="contact-card">
              <div className="contact-icon">🕐</div>
              <h3>أوقات العمل</h3>
              <p>يومياً<br />12:00 ظهراً - 12:00 ليلاً</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">💬</div>
              <h3>واتساب</h3>
              <a
                href="https://wa.me/963938831878"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-link"
              >
                تواصل معنا
              </a>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2 className="section-title">امسح وشارك</h2>
          <div className="qr-card">
            <div className="qr-wrapper">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(SITE_URL)}`}
                alt="QR Code"
                width="200"
                height="200"
              />
            </div>
            <p className="qr-hint">
              📱 امسح الكود بكاميرا جوالك<br />
              لفتح موقع Crunchy Bites
            </p>
            <p className="qr-url" dir="ltr">{SITE_URL}</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default About
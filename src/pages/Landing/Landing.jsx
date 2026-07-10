import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiMail } from 'react-icons/fi'
import products from '../../data/products.json'
import categories from '../../data/categories.json'
import ProductCard from '../../components/ProductCard/ProductCard.jsx'
import CategoryCard from '../../components/CategoryCard/CategoryCard.jsx'
import Button from '../../components/Button/Button.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'
import styles from './Landing.module.css'

const TESTIMONIALS = [
  {
    id: 't1',
    quote: 'The cinnamon roll alone is worth the trip. Their oat latte has become a daily ritual for me.',
    name: 'Renz A.',
    role: 'Regular, 2 years',
  },
  {
    id: 't2',
    quote: 'Every pastry case rotates something new. Staff remember your order by the second visit.',
    name: 'Kat D.',
    role: 'Neighborhood regular',
  },
  {
    id: 't3',
    quote: 'Best cold brew in the city, and the croissants sell out for a reason.',
    name: 'Marco I.',
    role: 'Weekend regular',
  },
]

export default function Landing() {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')

  const bestSellers = useMemo(() => products.filter((p) => p.tags.includes('bestseller')).slice(0, 4), [])
  const featured = useMemo(() => products.slice(4, 8), [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.includes('@')) {
      showToast('Enter a valid email to subscribe', 'error')
      return
    }
    showToast('Subscribed! Check your inbox for a welcome offer.', 'success')
    setEmail('')
  }

  return (
    <>
      {/* ---- Hero ---- */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <motion.div
            className={styles.heroCopy}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="stamp" style={{ color: 'var(--color-copper)' }}>Now roasting — house blend no.7</span>
            <h1 className={styles.heroTitle}>
              Coffee poured slow.<br />Pastry baked <em>fresh</em>.
            </h1>
            <p className={styles.heroText}>
              Brew &amp; Crust is a neighborhood roastery and bakery — single-origin espresso,
              laminated pastry, and a counter that never stops moving before 7am.
            </p>
            <div className={styles.heroActions}>
              <Button as={Link} to="/shop" size="lg" icon={FiArrowRight} iconPosition="right">
                Order Online
              </Button>
              <Button as={Link} to="/shop?category=coffee" size="lg" variant="outline">
                View Coffee Menu
              </Button>
            </div>
          </motion.div>

          <motion.div
            className={styles.heroImageWrap}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&q=80"
              alt="Latte art in a warm ceramic cup"
              className={styles.heroImage}
            />
            <div className={styles.heroCard}>
              <span className={styles.heroCardStat}>4.8</span>
              <span className={styles.heroCardLabel}>average rating<br />across 1,200+ orders</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---- About ---- */}
      <section id="about" className={`container ${styles.about}`}>
        <div className={styles.aboutImage}>
          <img
            src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=900&q=80"
            alt="Barista preparing espresso behind the counter"
          />
        </div>
        <div className={styles.aboutCopy}>
          <span className={styles.eyebrow}>Our story</span>
          <h2 className={styles.aboutTitle}>Small batch, every batch.</h2>
          <p className={styles.aboutText}>
            We started Brew &amp; Crust with one rule: nothing sits longer than a day. Beans are
            roasted twice a week in small lots, pastry dough is laminated by hand before sunrise,
            and every recipe on the menu has been tasted by the whole team before it goes on the board.
          </p>
          <div className={styles.aboutStats}>
            <div><strong>2019</strong><span>Founded</span></div>
            <div><strong>7</strong><span>Origins rotated yearly</span></div>
            <div><strong>18hr</strong><span>Cold brew steep time</span></div>
          </div>
        </div>
      </section>

      {/* ---- Categories ---- */}
      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>Browse the menu</span>
          <h2>Shop by category</h2>
        </div>
        <div className={styles.categoryGrid}>
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      {/* ---- Best sellers ---- */}
      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>Fan favorites</span>
          <h2>Best sellers</h2>
          <Link to="/shop" className={styles.sectionLink}>
            View all <FiArrowRight />
          </Link>
        </div>
        <div className={styles.productGrid}>
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ---- Featured products ---- */}
      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>Fresh this week</span>
          <h2>Featured products</h2>
          <Link to="/shop" className={styles.sectionLink}>
            View all <FiArrowRight />
          </Link>
        </div>
        <div className={styles.productGrid}>
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ---- Testimonials ---- */}
      <section id="testimonials" className={styles.testimonialSection}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow} style={{ color: 'var(--color-cream)', opacity: 0.7 }}>What people say</span>
            <h2 style={{ color: 'var(--color-cream)' }}>Loved by regulars</h2>
          </div>
          <div className={styles.testimonialGrid}>
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className={styles.testimonialCard}>
                <p>&ldquo;{t.quote}&rdquo;</p>
                <div className={styles.testimonialAuthor}>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Newsletter ---- */}
      <section className={`container ${styles.newsletter}`}>
        <div className={styles.newsletterCard}>
          <div>
            <h2>Get first pour on new drops</h2>
            <p>Seasonal menu launches, roast notes, and the occasional free pastry. No spam, ever.</p>
          </div>
          <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
            <div className={styles.newsletterInput}>
              <FiMail />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
            </div>
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </>
  )
}

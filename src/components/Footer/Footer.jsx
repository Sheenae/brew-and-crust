import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <span className={styles.logoMark}>B&amp;C</span>
          <p className={styles.tagline}>
            Roasted, baked, and poured daily in the heart of the city.
          </p>
          <div className={styles.social}>
            <a href="#" aria-label="Instagram"><FiInstagram /></a>
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
            <a href="#" aria-label="Facebook"><FiFacebook /></a>
          </div>
        </div>

        <div>
          <h4 className={styles.heading}>Shop</h4>
          <ul>
            <li><Link to="/shop?category=coffee">Coffee</Link></li>
            <li><Link to="/shop?category=pastries">Pastries</Link></li>
            <li><Link to="/shop?category=bakery">Bakery</Link></li>
            <li><Link to="/shop">All products</Link></li>
          </ul>
        </div>

        <div>
          <h4 className={styles.heading}>Company</h4>
          <ul>
            <li><a href="#about">About</a></li>
            <li><Link to="/dashboard">My account</Link></li>
            <li><a href="#testimonials">Testimonials</a></li>
          </ul>
        </div>

        <div>
          <h4 className={styles.heading}>Visit</h4>
          <p className={styles.info}>128 Roastery Lane<br />Open daily, 7am – 7pm</p>
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <span>© {new Date().getFullYear()} Brew &amp; Crust. All rights reserved.</span>
        <span>Made with care, one cup at a time.</span>
      </div>
    </footer>
  )
}

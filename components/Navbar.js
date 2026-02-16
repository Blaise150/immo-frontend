import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🏠</span>
          <span className={styles.logoText}>ImmoApp</span>
        </Link>
        
        {/* Burger Menu Icon */}
        <button 
          className={styles.burger} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={isMenuOpen ? styles.burgerOpen : ''}></span>
          <span className={isMenuOpen ? styles.burgerOpen : ''}></span>
          <span className={isMenuOpen ? styles.burgerOpen : ''}></span>
        </button>

        {/* Navigation Links */}
        <ul className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ''}`}>
          <li><Link href="/" onClick={closeMenu}>Accueil</Link></li>
          <li><Link href="/properties" onClick={closeMenu}>Biens</Link></li>
          <li><Link href="/about" onClick={closeMenu}>À propos</Link></li>
          <li><Link href="/contact" onClick={closeMenu}>Contact</Link></li>
        </ul>

        {/* Auth Buttons */}
        <div className={`${styles.auth} ${isMenuOpen ? styles.authOpen : ''}`}>
          <Link href="/login" className={styles.loginBtn} onClick={closeMenu}>
            Connexion
          </Link>
          <Link href="/signup" className={styles.signupBtn} onClick={closeMenu}>
            Inscription
          </Link>
        </div>
      </div>
    </nav>
  );
}
import Link from 'next/link';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          ImmoApp
        </Link>
        
        <ul className={styles.menu}>
          <li><Link href="/">Accueil</Link></li>
          <li><Link href="/properties">Biens</Link></li>
          <li><Link href="/about">À propos</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>

        <div className={styles.auth}>
          <Link href="/login" className={styles.loginBtn}>
            Connexion
          </Link>
          <Link href="/signup" className={styles.signupBtn}>
            Inscription
          </Link>
        </div>
      </div>
    </nav>
  );
}
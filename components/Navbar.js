import Link from 'next/link';
import { FaHome, FaSearch, FaHeart } from 'react-icons/fa';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/">
          <div className={styles.logo}>
            <FaHome />
            <span>Immo<strong>App</strong></span>
          </div>
        </Link>

        <div className={styles.menu}>
          <Link href="/"><a>Accueil</a></Link>
          <Link href="/properties"><a><FaSearch /> Rechercher</a></Link>
          <Link href="/favorites"><a><FaHeart /> Favoris</a></Link>
        </div>

        <div className={styles.actions}>
          <Link href="/account/login"><a className={styles.loginBtn}>Connexion</a></Link>
        </div>
      </div>
    </nav>
  );
}
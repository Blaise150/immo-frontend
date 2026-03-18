import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));

    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    setIsLoggedIn(false);
    router.push('/');
  };

  const close = () => setMenuOpen(false);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/properties', label: 'Biens' },
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={close}>
          <span className={styles.logoIcon}>🏠</span>
          <span className={styles.logoText}>ImmoApp</span>
        </Link>

        <ul className={`${styles.menu} ${menuOpen ? styles.menuOpen : ''}`}>
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={close}
                className={router.pathname === href ? styles.active : ''}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={`${styles.auth} ${menuOpen ? styles.authOpen : ''}`}>
          {isLoggedIn ? (
            <>
              <Link href="/account" className={styles.loginBtn} onClick={close}>
                Mon compte
              </Link>
              <button className={styles.signupBtn} onClick={logout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.loginBtn} onClick={close}>
                Connexion
              </Link>
              <Link href="/signup" className={styles.signupBtn} onClick={close}>
                Inscription
              </Link>
            </>
          )}
        </div>

        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerActive : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}

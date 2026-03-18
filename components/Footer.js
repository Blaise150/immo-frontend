import Link from 'next/link';
import styles from '../styles/Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Section 1: À propos */}
        <div className={styles.section}>
          <h3 className={styles.logo}>
            <span className={styles.logoIcon}>🏠</span>
            ImmoApp
          </h3>
          <p className={styles.description}>
            Votre partenaire de confiance pour trouver le bien immobilier idéal à Paris, Monaco, Nice, Lyon et Marseille.
          </p>
          <div className={styles.social}>
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="LinkedIn">💼</a>
          </div>
        </div>

        {/* Section 2: Navigation rapide */}
        <div className={styles.section}>
          <h4>Navigation</h4>
          <ul className={styles.links}>
            <li><Link href="/">Accueil</Link></li>
            <li><Link href="/properties">Biens</Link></li>
            <li><Link href="/about">À propos</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Section 3: Services */}
        <div className={styles.section}>
          <h4>Services</h4>
          <ul className={styles.links}>
            <li><Link href="/acheter">Acheter</Link></li>
            <li><Link href="/louer">Louer</Link></li>
            <li><Link href="/vendre">Vendre</Link></li>
            <li><Link href="/estimation">Estimation gratuite</Link></li>
          </ul>
        </div>

        {/* Section 4: Contact */}
        <div className={styles.section}>
          <h4>Contact</h4>
          <ul className={styles.contact}>
            <li>📍 12 Avenue de Toulouse</li>
            <li> 31000 Toulouse, France</li>
            <li>📞 +33 5 23 45 67 89</li>
            <li>✉️ contact@immoapp.fr</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className={styles.bottom}>
        <div className={styles.container}>
          <p>&copy; {currentYear} ImmoApp. Tous droits réservés.</p>
          <div className={styles.legal}>
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/confidentialite">Confidentialité</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

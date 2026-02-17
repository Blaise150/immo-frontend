import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../styles/Auth.module.css';

export default function Signup() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password2: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.password2) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://immo-backend-production-deb8.up.railway.app/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.email,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Rediriger vers la page de connexion
        window.location.href = '/login';
      } else {
        setError(data.detail || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Inscription - ImmoApp</title>
      </Head>

      <Navbar />

      <main className={styles.authPage}>
        <div className={styles.container}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <h1>Créer un compte</h1>
              <p>Rejoignez ImmoApp dès aujourd'hui</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {error && (
                <div className={styles.errorMessage}>
                  ⚠️ {error}
                </div>
              )}

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="first_name">Prénom *</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    placeholder="Votre prénom"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="last_name">Nom *</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="votre@email.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Mot de passe *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  minLength="8"
                />
                <small>Au moins 8 caractères</small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password2">Confirmer le mot de passe *</label>
                <input
                  type="password"
                  id="password2"
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>

              <label className={styles.checkbox}>
                <input type="checkbox" required />
                <span>
                  J'accepte les{' '}
                  <Link href="/terms">conditions d'utilisation</Link>
                  {' '}et la{' '}
                  <Link href="/privacy">politique de confidentialité</Link>
                </span>
              </label>

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Inscription...' : 'Créer mon compte'}
              </button>
            </form>

            <div className={styles.divider}>
              <span>OU</span>
            </div>

            <div className={styles.socialLogin}>
              <button className={styles.socialBtn}>
                <span>📘</span> Continuer avec Facebook
              </button>
              <button className={styles.socialBtn}>
                <span>🔍</span> Continuer avec Google
              </button>
            </div>

            <div className={styles.authFooter}>
              <p>
                Vous avez déjà un compte ?{' '}
                <Link href="/login">Se connecter</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../styles/Auth.module.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    setLoading(true);

    try {
      const response = await fetch('https://immo-backend-production-deb8.up.railway.app/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker le token
        localStorage.setItem('token', data.access);
        localStorage.setItem('refresh', data.refresh);
        // Rediriger vers la page d'accueil
        window.location.href = '/';
      } else {
        setError(data.detail || 'Identifiants incorrects');
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
        <title>Connexion - ImmoApp</title>
      </Head>

      <Navbar />

      <main className={styles.authPage}>
        <div className={styles.container}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <h1>Connexion</h1>
              <p>Accédez à votre compte ImmoApp</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {error && (
                <div className={styles.errorMessage}>
                  ⚠️ {error}
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
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
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>

              <div className={styles.formOptions}>
                <label className={styles.checkbox}>
                  <input type="checkbox" />
                  <span>Se souvenir de moi</span>
                </label>
                <Link href="/forgot-password" className={styles.forgotLink}>
                  Mot de passe oublié ?
                </Link>
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
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
                Vous n'avez pas de compte ?{' '}
                <Link href="/signup">Créer un compte</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { login as apiLogin } from '../lib/api';
import styles from '../styles/Auth.module.css';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiLogin(form.email, form.password);
      localStorage.setItem('token', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Connexion — ImmoApp</title>
      </Head>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1>Connexion</h1>
            <p>Accédez à votre espace ImmoApp</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorBanner}>{error}</div>}

            <div className={styles.field}>
              <label htmlFor="email">Adresse e-mail</label>
              <input
                id="email" name="email" type="email"
                value={form.email} onChange={handleChange}
                placeholder="vous@exemple.fr" required autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password" name="password" type="password"
                value={form.password} onChange={handleChange}
                placeholder="••••••••" required autoComplete="current-password"
              />
            </div>

            <div className={styles.options}>
              <label className={styles.checkLabel}>
                <input type="checkbox" /> Se souvenir de moi
              </label>
              <Link href="/forgot-password" className={styles.forgotLink}>
                Mot de passe oublié ?
              </Link>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <p className={styles.switchLine}>
            Pas encore de compte ?{' '}
            <Link href="/signup">Créer un compte</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

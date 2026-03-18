import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { register as apiRegister } from '../lib/api';
import styles from '../styles/Auth.module.css';

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    phone: '', password: '', password2: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password2)
      return setError('Les mots de passe ne correspondent pas.');
    if (form.password.length < 8)
      return setError('Le mot de passe doit contenir au moins 8 caractères.');
    setLoading(true);
    try {
      await apiRegister({
        username: form.email,
        email: form.email,
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        password: form.password,
      });
      router.push('/login');
    } catch (err) {
      const data = err.response?.data;
      setError(data?.detail || data?.email?.[0] || 'Erreur lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Inscription — ImmoApp</title></Head>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1>Créer un compte</h1>
            <p>Rejoignez ImmoApp gratuitement</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorBanner}>{error}</div>}

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="first_name">Prénom</label>
                <input id="first_name" name="first_name" type="text"
                  value={form.first_name} onChange={handleChange}
                  placeholder="Jean" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="last_name">Nom</label>
                <input id="last_name" name="last_name" type="text"
                  value={form.last_name} onChange={handleChange}
                  placeholder="Dupont" required />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Adresse e-mail</label>
              <input id="email" name="email" type="email"
                value={form.email} onChange={handleChange}
                placeholder="vous@exemple.fr" required autoComplete="email" />
            </div>

            <div className={styles.field}>
              <label htmlFor="phone">Téléphone <span className={styles.optional}>(optionnel)</span></label>
              <input id="phone" name="phone" type="tel"
                value={form.phone} onChange={handleChange}
                placeholder="+33 6 12 34 56 78" />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Mot de passe</label>
              <input id="password" name="password" type="password"
                value={form.password} onChange={handleChange}
                placeholder="••••••••" required minLength="8" />
              <small>Au moins 8 caractères</small>
            </div>

            <div className={styles.field}>
              <label htmlFor="password2">Confirmer le mot de passe</label>
              <input id="password2" name="password2" type="password"
                value={form.password2} onChange={handleChange}
                placeholder="••••••••" required />
            </div>

            <label className={styles.checkLabel} style={{ marginBottom: '1rem' }}>
              <input type="checkbox" required />
              J'accepte les <Link href="/terms">conditions d'utilisation</Link>
            </label>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Création…' : 'Créer mon compte'}
            </button>
          </form>

          <p className={styles.switchLine}>
            Déjà un compte ? <Link href="/login">Se connecter</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { login as apiLogin, getProperties } from '../lib/api';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://immo-backend-production-deb8.up.railway.app';

export default function Admin() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ totalProperties: 0 });
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('is_admin');
    if (token && isAdmin === 'true') {
      setAuth(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiLogin(email, password);
      if (!res.data.is_staff) {
        setError('Accès refusé : compte non administrateur.');
        setLoading(false);
        return;
      }
      localStorage.setItem('token', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      localStorage.setItem('is_admin', 'true');
      setAuth(true);
      fetchData();
    } catch {
      setError('Identifiants incorrects.');
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getProperties({ page_size: 100 });
      const data = res.data.results || res.data;
      setProperties(data);
      setStats({ totalProperties: res.data.count || data.length });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('is_admin');
    setAuth(false);
  };

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!auth) return (
    <>
      <Head><title>Administration — ImmoApp</title></Head>
      <Navbar />
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '14px', padding: '2.5rem 2rem', maxWidth: '400px', width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid #edf2f7' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.4rem', color: '#1a202c' }}>Administration</h1>
          <p style={{ textAlign: 'center', color: '#718096', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Accès réservé aux administrateurs</p>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#2d3748' }}>E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@immoapp.fr" required style={{ width: '100%', padding: '0.65rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit' }} />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#2d3748' }}>Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ width: '100%', padding: '0.65rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit' }} />
            </div>
            {error && <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', borderRadius: '7px', padding: '0.65rem 0.9rem', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <>
      <Head><title>Dashboard Admin — ImmoApp</title></Head>
      <Navbar />
      <main style={{ background: '#f8f9fa', minHeight: '100vh', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.2rem' }}>Dashboard Admin</h1>
              <p style={{ color: '#718096', fontSize: '0.9rem' }}>Gestion de l'application ImmoApp</p>
            </div>
            <button onClick={logout} style={{ padding: '0.6rem 1.25rem', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Déconnexion
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#667eea', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : (
            <>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Biens publiés', value: stats.totalProperties, gradient: 'linear-gradient(135deg,#667eea,#764ba2)', icon: '🏠' },
                  { label: 'Utilisateurs', value: '—', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', icon: '👥' },
                  { label: 'Favoris', value: '—', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)', icon: '❤️' },
                  { label: 'Cette semaine', value: '—', gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)', icon: '📈' },
                ].map((s) => (
                  <div key={s.label} style={{ background: s.gradient, borderRadius: '12px', padding: '1.5rem', color: 'white' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>{s.value}</div>
                    <div style={{ fontSize: '0.88rem', opacity: 0.9 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #edf2f7', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1a202c' }}>Actions rapides</h2>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {[
                    { label: '🔧 Admin Django', action: () => window.open(`${API_URL}/admin/`, '_blank'), color: '#667eea' },
                    { label: '🏠 Voir les biens', action: () => router.push('/properties'), color: '#38a169' },
                    { label: '🔄 Actualiser', action: fetchData, color: '#3182ce' },
                  ].map((b) => (
                    <button key={b.label} onClick={b.action} style={{ padding: '0.7rem 1.25rem', background: b.color, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Liste biens */}
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #edf2f7', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #edf2f7' }}>
                  <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1a202c' }}>Derniers biens ({properties.length})</h2>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: '#f8f9fa' }}>
                        {['Titre', 'Ville', 'Type', 'Prix', 'Statut'].map((h) => (
                          <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#718096', borderBottom: '1px solid #edf2f7' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {properties.slice(0, 10).map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #f7fafc' }}>
                          <td style={{ padding: '0.75rem 1rem', color: '#1a202c', fontWeight: 500 }}>{p.title}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#718096' }}>{p.city}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#718096', textTransform: 'capitalize' }}>{p.property_type}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#667eea', fontWeight: 700 }}>{Number(p.price).toLocaleString('fr-FR')} €</td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: p.transaction_type === 'vente' ? '#ebf4ff' : '#f0fff4', color: p.transaction_type === 'vente' ? '#3182ce' : '#276749' }}>
                              {p.transaction_type === 'vente' ? 'Vente' : 'Location'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

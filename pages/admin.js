import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://immo-backend-production-deb8.up.railway.app';

export default function AdminDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalFavorites: 0,
    newUsersThisWeek: 0
  });
  const [properties, setProperties] = useState([]);

  const ADMIN_PASSWORD = 'admin123';

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated');
    if (isAuth === 'true') {
      setAuthenticated(true);
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true');
      setAuthenticated(true);
      setError('');
      fetchAdminData();
    } else {
      setError('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setAuthenticated(false);
    setPassword('');
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/properties/?page_size=100`);
      const data = await response.json();
      setProperties(data.results || data);
      setStats({
        totalUsers: 0,
        totalProperties: data.count || data.length,
        totalFavorites: 0,
        newUsersThisWeek: 0
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <>
        <Head><title>Admin - ImmoApp</title></Head>
        <Navbar />
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: '20px' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '10px', color: '#2c3e50' }}>🔐 Admin Dashboard</h1>
            <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '30px' }}>Connexion requise</p>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>Mot de passe Admin</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Entrez le mot de passe" required style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '16px' }} />
              </div>
              {error && <div style={{ padding: '10px', background: '#fee', color: '#dc3545', borderRadius: '6px', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
              <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>Se connecter</button>
            </form>
            <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', fontSize: '13px', color: '#7f8c8d' }}><strong>💡 Mot de passe par défaut :</strong> admin123</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head><title>Dashboard Admin - ImmoApp</title></Head>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#f8f9fa', padding: '30px 20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h1 style={{ fontSize: '32px', color: '#2c3e50', marginBottom: '5px' }}>📊 Dashboard Admin</h1>
              <p style={{ color: '#7f8c8d' }}>Gérez votre application</p>
            </div>
            <button onClick={handleLogout} style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>🚪 Déconnexion</button>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}><p>Chargement...</p></div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', padding: '25px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>👥</div>
                  <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '5px' }}>{stats.totalUsers}</div>
                  <div>Utilisateurs inscrits</div>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)', color: 'white', padding: '25px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>🏠</div>
                  <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '5px' }}>{stats.totalProperties}</div>
                  <div>Biens disponibles</div>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)', color: 'white', padding: '25px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>❤️</div>
                  <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '5px' }}>{stats.totalFavorites}</div>
                  <div>Favoris</div>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #43e97b, #38f9d7)', color: 'white', padding: '25px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>📈</div>
                  <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '5px' }}>{stats.newUsersThisWeek}</div>
                  <div>Nouveaux cette semaine</div>
                </div>
              </div>
              <div style={{ background: 'white', padding: '30px', borderRadius: '12px', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#2c3e50' }}>⚡ Actions Rapides</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <button onClick={() => window.open(`${API_URL}/admin/`, '_blank')} style={{ padding: '15px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>🔧 Admin Django</button>
                  <button onClick={() => router.push('/properties')} style={{ padding: '15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>🏠 Voir les Biens</button>
                  <button onClick={fetchAdminData} style={{ padding: '15px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>🔄 Actualiser</button>
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
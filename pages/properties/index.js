import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://immo-backend-production-deb8.up.railway.app';

export default function Properties() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Filtres
  const [filters, setFilters] = useState({
    city: '',
    transaction_type: '',
    property_type: '',
    zip_code: '',
  });

  useEffect(() => {
    // Lire les paramètres URL (ex: /properties?city=Paris)
    if (router.isReady) {
      const { city, transaction_type, property_type, zip_code } = router.query;
      setFilters({
        city: city || '',
        transaction_type: transaction_type || '',
        property_type: property_type || '',
        zip_code: zip_code || '',
      });
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      // Construire l'URL avec les filtres
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.transaction_type) params.append('transaction_type', filters.transaction_type);
      if (filters.property_type) params.append('property_type', filters.property_type);
      if (filters.zip_code) params.append('zip_code', filters.zip_code);
      params.append('page_size', '20');

      const url = `${API_URL}/api/properties/?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error(`Erreur: ${response.status}`);

      const data = await response.json();
      setProperties(data.results || data);
      setTotal(data.count || 0);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les biens.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    // Mettre à jour l'URL
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key]) params.append(key, newFilters[key]);
    });
    router.push(`/properties?${params.toString()}`, undefined, { shallow: true });
  };

  const resetFilters = () => {
    setFilters({ city: '', transaction_type: '', property_type: '', zip_code: '' });
    router.push('/properties', undefined, { shallow: true });
  };

  return (
    <>
      <Head>
        <title>Tous les Biens - ImmoApp</title>
        <meta name="description" content="Recherchez parmi nos biens immobiliers" />
      </Head>

      <Navbar />

      <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>

        {/* HEADER */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>
            Tous les Biens
          </h1>
          <p style={{ opacity: 0.9, fontSize: '18px' }}>
            {total > 0 ? `${total} biens disponibles` : 'Recherchez votre bien idéal'}
          </p>
        </div>

        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '30px 20px' }}>

          {/* FILTRES */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            alignItems: 'flex-end'
          }}>
            {/* Ville */}
            <div style={{ flex: '1', minWidth: '150px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#555', fontSize: '14px' }}>
                🏙️ Ville
              </label>
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  color: '#333'
                }}
              >
                <option value="">Toutes les villes</option>
                <option value="Paris">Paris</option>
                <option value="Monaco">Monaco</option>
                <option value="Nice">Nice</option>
                <option value="Lyon">Lyon</option>
                <option value="Marseille">Marseille</option>
              </select>
            </div>

            {/* Code postal */}
            <div style={{ flex: '1', minWidth: '150px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#555', fontSize: '14px' }}>
                📮 Code postal
              </label>
              <input
                type="text"
                name="zip_code"
                value={filters.zip_code}
                onChange={handleFilterChange}
                placeholder="Ex: 75001"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  color: '#333'
                }}
              />
            </div>

            {/* Transaction */}
            <div style={{ flex: '1', minWidth: '150px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#555', fontSize: '14px' }}>
                💰 Type
              </label>
              <select
                name="transaction_type"
                value={filters.transaction_type}
                onChange={handleFilterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  color: '#333'
                }}
              >
                <option value="">Vente & Location</option>
                <option value="vente">Vente</option>
                <option value="location">Location</option>
              </select>
            </div>

            {/* Type de bien */}
            <div style={{ flex: '1', minWidth: '150px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#555', fontSize: '14px' }}>
                🏠 Type de bien
              </label>
              <select
                name="property_type"
                value={filters.property_type}
                onChange={handleFilterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  color: '#333'
                }}
              >
                <option value="">Tous les types</option>
                <option value="appartement">Appartement</option>
                <option value="maison">Maison</option>
                <option value="studio">Studio</option>
                <option value="villa">Villa</option>
              </select>
            </div>

            {/* Bouton reset */}
            <button
              onClick={resetFilters}
              style={{
                padding: '10px 20px',
                background: '#f8f9fa',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#555',
                fontSize: '15px'
              }}
            >
              🔄 Réinitialiser
            </button>
          </div>

          {/* CONTENU */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '80px' }}>
              <div style={{
                width: '50px', height: '50px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #667eea',
                borderRadius: '50%',
                margin: '0 auto 20px',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ color: '#7f8c8d', fontSize: '16px' }}>Chargement des biens...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {error && !loading && (
            <div style={{
              textAlign: 'center', padding: '60px',
              background: '#fee', borderRadius: '12px', color: '#dc3545'
            }}>
              <p style={{ fontSize: '18px', marginBottom: '15px' }}>❌ {error}</p>
              <button onClick={fetchProperties} style={{
                padding: '10px 24px', background: '#667eea', color: 'white',
                border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
              }}>Réessayer</button>
            </div>
          )}

          {!loading && !error && properties.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '12px' }}>
              <p style={{ fontSize: '24px', marginBottom: '10px' }}>🔍</p>
              <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>Aucun bien trouvé</h2>
              <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>Essayez de modifier vos filtres</p>
              <button onClick={resetFilters} style={{
                padding: '12px 28px', background: '#667eea', color: 'white',
                border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '16px'
              }}>Voir tous les biens</button>
            </div>
          )}

          {!loading && !error && properties.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '25px'
            }}>
              {properties.map((property) => (
                <Link key={property.id} href={`/properties/${property.id}`}>
                  <a style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div
                      style={{
                        background: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        transition: 'all 0.3s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                      }}
                    >
                      {/* IMAGE */}
                      <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                        <img
                          src={`https://picsum.photos/seed/${property.id}/400/300`}
                          alt={property.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <span style={{
                          position: 'absolute', bottom: '15px', left: '15px',
                          background: property.transaction_type === 'vente' ? 'rgba(102,126,234,0.95)' : 'rgba(40,167,69,0.95)',
                          color: 'white', padding: '5px 12px', borderRadius: '6px',
                          fontSize: '12px', fontWeight: '700'
                        }}>
                          {property.transaction_type === 'vente' ? '🏠 À Vendre' : '🔑 À Louer'}
                        </span>
                        {property.featured && (
                          <span style={{
                            position: 'absolute', top: '12px', right: '12px',
                            background: 'rgba(255,193,7,0.95)', color: '#333',
                            padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700'
                          }}>⭐ À la Une</span>
                        )}
                      </div>

                      {/* INFOS */}
                      <div style={{ padding: '18px' }}>
                        <h3 style={{
                          fontSize: '17px', fontWeight: '600', marginBottom: '8px',
                          color: '#2c3e50', whiteSpace: 'nowrap',
                          overflow: 'hidden', textOverflow: 'ellipsis'
                        }}>
                          {property.title}
                        </h3>
                        <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '12px' }}>
                          📍 {property.city} ({property.zip_code})
                        </p>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#555', marginBottom: '15px' }}>
                          <span>🛏️ {property.bedrooms} ch.</span>
                          <span>🚿 {property.bathrooms} sdb</span>
                          <span>📏 {property.surface} m²</span>
                        </div>
                        <div style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          paddingTop: '12px', borderTop: '1px solid #eee'
                        }}>
                          <span style={{ fontSize: '20px', fontWeight: '700', color: '#667eea' }}>
                            {Number(property.price).toLocaleString('fr-FR')} €
                            {property.transaction_type === 'location' && (
                              <span style={{ fontSize: '12px', fontWeight: '400', color: '#7f8c8d' }}>/mois</span>
                            )}
                          </span>
                          <span style={{
                            padding: '4px 10px', borderRadius: '6px', fontSize: '11px',
                            fontWeight: '600', background: '#d4edda', color: '#28a745'
                          }}>
                            ✓ {property.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
        <Footer />
    </>
  );
}
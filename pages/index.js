import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://immo-backend-production-deb8.up.railway.app';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${API_URL}/api/properties/?page_size=6`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setProperties(data.results || data);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les biens. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const cities = [
    { name: 'Paris', emoji: '🗼' },
    { name: 'Monaco', emoji: '🎰' },
    { name: 'Nice', emoji: '🌊' },
    { name: 'Lyon', emoji: '🦁' },
    { name: 'Marseille', emoji: '⚓' },
  ];

  return (
    <>
      <Head>
        <title>ImmoApp - Trouvez votre bien idéal</title>
        <meta name="description" content="Trouvez votre bien immobilier idéal" />
      </Head>

      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section className={styles.hero}>
          <h1>Trouvez votre bien idéal</h1>
          <p>Plus de 100 biens disponibles à Paris, Monaco, Nice, Lyon et Marseille</p>

          {/* Boutons de recherche rapide */}
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            marginTop: '30px',
            flexWrap: 'wrap'
          }}>
            <Link href="/properties">
              <a style={{
                padding: '14px 32px',
                background: 'white',
                color: '#667eea',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '16px',
                textDecoration: 'none',
                transition: 'all 0.3s'
              }}>
                🔍 Voir tous les biens
              </a>
            </Link>
          </div>
        </section>

        {/* FILTRES RAPIDES PAR VILLE */}
        <section style={{
          padding: '30px 20px',
          background: '#f8f9fa',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {cities.map(city => (
              <Link key={city.name} href={`/properties?city=${city.name}`}>
                <a style={{
                  padding: '10px 20px',
                  background: 'white',
                  border: '2px solid #667eea',
                  borderRadius: '25px',
                  color: '#667eea',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.3s'
                }}>
                  {city.emoji} {city.name}
                </a>
              </Link>
            ))}
          </div>
        </section>

        {/* BIENS DISPONIBLES */}
        <section style={{ padding: '60px 20px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              textAlign: 'center',
              fontSize: '36px',
              marginBottom: '10px',
              color: '#2c3e50'
            }}>
              Biens à la Une
            </h2>
            <p style={{
              textAlign: 'center',
              color: '#7f8c8d',
              marginBottom: '40px',
              fontSize: '18px'
            }}>
              Découvrez notre sélection de biens
            </p>

            {/* LOADING */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #667eea',
                  borderRadius: '50%',
                  margin: '0 auto 20px',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ color: '#7f8c8d' }}>Chargement des biens...</p>
              </div>
            )}

            {/* ERREUR */}
            {error && !loading && (
              <div style={{
                textAlign: 'center',
                padding: '60px',
                background: '#fee',
                borderRadius: '12px',
                color: '#dc3545'
              }}>
                <p style={{ fontSize: '18px' }}>❌ {error}</p>
                <button
                  onClick={fetchProperties}
                  style={{
                    marginTop: '15px',
                    padding: '10px 24px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Réessayer
                </button>
              </div>
            )}

            {/* AUCUN BIEN */}
            {!loading && !error && properties.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '60px',
                background: 'white',
                borderRadius: '12px'
              }}>
                <p style={{ fontSize: '18px', color: '#7f8c8d' }}>
                  Aucun bien disponible pour le moment.
                </p>
              </div>
            )}

            {/* GRILLE DES BIENS */}
            {!loading && !error && properties.length > 0 && (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                  gap: '30px',
                  marginBottom: '40px'
                }}>
                  {properties.map((property) => (
                    <Link key={property.id} href={`/properties/${property.id}`}>
                      <a style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{
                          background: 'white',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                        >
                          {/* IMAGE */}
                          <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                            <img
                              src={`https://picsum.photos/seed/${property.id}/400/300`}
                              alt={property.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = `https://picsum.photos/400/300?random=${property.id}`;
                              }}
                            />
                            {/* BADGE TRANSACTION */}
                            <span style={{
                              position: 'absolute',
                              bottom: '15px',
                              left: '15px',
                              background: property.transaction_type === 'vente'
                                ? 'rgba(102, 126, 234, 0.95)'
                                : 'rgba(40, 167, 69, 0.95)',
                              color: 'white',
                              padding: '6px 14px',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: '700'
                            }}>
                              {property.transaction_type === 'vente' ? '🏠 À Vendre' : '🔑 À Louer'}
                            </span>

                            {/* BADGE FEATURED */}
                            {property.featured && (
                              <span style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                background: 'rgba(255, 193, 7, 0.95)',
                                color: '#333',
                                padding: '5px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '700'
                              }}>
                                ⭐ À la Une
                              </span>
                            )}
                          </div>

                          {/* CONTENU */}
                          <div style={{ padding: '20px' }}>
                            <h3 style={{
                              fontSize: '18px',
                              fontWeight: '600',
                              marginBottom: '8px',
                              color: '#2c3e50',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {property.title}
                            </h3>

                            <p style={{
                              color: '#7f8c8d',
                              fontSize: '14px',
                              marginBottom: '15px'
                            }}>
                              📍 {property.city} ({property.zip_code})
                            </p>

                            <div style={{
                              display: 'flex',
                              gap: '15px',
                              fontSize: '14px',
                              color: '#555',
                              marginBottom: '15px'
                            }}>
                              <span>🛏️ {property.bedrooms} ch.</span>
                              <span>🚿 {property.bathrooms} sdb</span>
                              <span>📏 {property.surface} m²</span>
                            </div>

                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              paddingTop: '15px',
                              borderTop: '1px solid #eee'
                            }}>
                              <span style={{
                                fontSize: '22px',
                                fontWeight: '700',
                                color: '#667eea'
                              }}>
                                {Number(property.price).toLocaleString('fr-FR')} €
                                {property.transaction_type === 'location' && (
                                  <span style={{ fontSize: '13px', fontWeight: '400', color: '#7f8c8d' }}>
                                    /mois
                                  </span>
                                )}
                              </span>
                              <span style={{
                                padding: '5px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                background: '#d4edda',
                                color: '#28a745'
                              }}>
                                {property.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    </Link>
                  ))}
                </div>

                {/* BOUTON VOIR PLUS */}
                <div style={{ textAlign: 'center' }}>
                  <Link href="/properties">
                    <a style={{
                      padding: '14px 40px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '16px',
                      textDecoration: 'none',
                      display: 'inline-block'
                    }}>
                      Voir tous les biens →
                    </a>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{
        background: '#2c3e50',
        color: 'white',
        padding: '30px 20px',
        textAlign: 'center'
      }}>
        <p>© 2026 ImmoApp - Tous droits réservés</p>
      </footer>
    </>
  );
}

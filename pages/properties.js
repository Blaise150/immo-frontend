import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('https://immo-backend-production-deb8.up.railway.app/api/properties/?page_size=100');
      const data = await response.json();
      setProperties(data.results || data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Tous les biens - ImmoApp</title>
      </Head>

      <Navbar />

      <main>
        <section className={styles.hero}>
          <h1>Tous nos biens</h1>
          <p>Découvrez l'ensemble de notre catalogue immobilier</p>
        </section>

        <section className={styles.properties}>
          <div className={styles.container}>
            <h2>
              {loading ? 'Chargement...' : `${properties.length} bien${properties.length > 1 ? 's' : ''} disponible${properties.length > 1 ? 's' : ''}`}
            </h2>
            
            {loading ? (
              <div className={styles.loading}>
                <p>Chargement des propriétés...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className={styles.empty}>
                <p>Aucun bien disponible pour le moment.</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {properties.map((property) => (
                  <Link key={property.id} href={`/property/${property.id}`}>
                    <a style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className={styles.card}>
                        <div className={styles.cardImage}>
                          <img
                            src={`https://picsum.photos/seed/${property.id}/400/300`}
                            alt={property.title}
                          />
                          <span className={styles.badge}>
                            {property.transaction_type === 'vente' ? 'À Vendre' : 'À Louer'}
                          </span>
                        </div>
                        <div className={styles.cardContent}>
                          <h3>{property.title}</h3>
                          <p className={styles.location}>
                            📍 {property.city} ({property.zip_code})
                          </p>
                          <div className={styles.features}>
                            <span>🛏️ {property.bedrooms} ch.</span>
                            <span>📐 {property.surface} m²</span>
                          </div>
                          <div className={styles.price}>
                            {property.price.toLocaleString('fr-FR')} €
                            {property.transaction_type === 'location' && '/mois'}
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

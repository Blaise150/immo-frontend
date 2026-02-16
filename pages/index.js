import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import api from '../lib/api';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties/?page_size=6');
      setProperties(response.data.results || response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>ImmoApp - Trouvez votre bien idéal</title>
      </Head>

      <Navbar />

      <main>
        <section className={styles.hero}>
          <h1>Trouvez votre bien idéal</h1>
          <p>Plus de 100 biens disponibles à Paris, Monaco, Nice, Lyon et Marseille</p>
        </section>

        <section className={styles.properties}>
          <div className="container">
            <h2>Biens Disponibles</h2>
            
            {loading ? (
              <p>Chargement...</p>
            ) : (
              <div className={styles.grid}>
                {properties.map((property) => (
                  <div key={property.id} className={styles.card}>
                    <div className={styles.cardImage}>
                      <img 
                        src={`https://source.unsplash.com/400x300/?${property.property_type},${property.city}`}
                        alt={property.title}
                      />
                      <span className={styles.badge}>
                        {property.transaction_type === 'vente' ? 'À Vendre' : 'À Louer'}
                      </span>
                    </div>
                    <div className={styles.cardContent}>
                      <h3>{property.title}</h3>
                      <p>📍 {property.city} ({property.zip_code})</p>
                      <div className={styles.features}>
                        <span>🛏️ {property.bedrooms} ch.</span>
                        <span>📏 {property.surface} m²</span>
                      </div>
                      <div className={styles.price}>
                        {property.price.toLocaleString('fr-FR')} €
                        {property.transaction_type === 'location' && '/mois'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
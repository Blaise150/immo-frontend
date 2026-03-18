import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getProperties } from '../lib/api';
import styles from '../styles/Home.module.css';

const CITIES = [
  { name: 'Paris', emoji: '🗼' },
  { name: 'Monaco', emoji: '🎰' },
  { name: 'Nice', emoji: '🌊' },
  { name: 'Lyon', emoji: '🦁' },
  { name: 'Marseille', emoji: '⚓' },
];

function PropertyCard({ property }) {
  return (
    <Link href={`/property/${property.id}`} className={styles.cardLink}>
      <article className={styles.card}>
        <div className={styles.cardImage}>
          <img
            src={`https://picsum.photos/seed/${property.id}/400/300`}
            alt={property.title}
            loading="lazy"
            onError={(e) => {
              e.target.src = `https://picsum.photos/400/300?random=${property.id}`;
            }}
          />
          <span className={`${styles.badge} ${property.transaction_type === 'vente' ? styles.badgeSale : styles.badgeRent}`}>
            {property.transaction_type === 'vente' ? 'À Vendre' : 'À Louer'}
          </span>
          {property.featured && (
            <span className={styles.badgeFeatured}>⭐ À la Une</span>
          )}
        </div>

        <div className={styles.cardBody}>
          <h3 className={styles.cardTitle}>{property.title}</h3>
          <p className={styles.cardLocation}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {property.city} · {property.zip_code}
          </p>
          <div className={styles.cardFeatures}>
            <span>{property.bedrooms} ch.</span>
            <span>{property.bathrooms} sdb</span>
            <span>{property.surface} m²</span>
          </div>
          <div className={styles.cardFooter}>
            <strong className={styles.cardPrice}>
              {Number(property.price).toLocaleString('fr-FR')} €
              {property.transaction_type === 'location' && <small>/mois</small>}
            </strong>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchProperties(); }, []);

  const fetchProperties = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await getProperties({ page_size: 6 });
      setProperties(res.data.results || res.data);
    } catch {
      setError('Impossible de charger les biens. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>ImmoApp — Trouvez votre bien idéal</title>
        <meta name="description" content="Découvrez notre sélection de biens immobiliers à Paris, Monaco, Nice, Lyon et Marseille." />
      </Head>

      <Navbar />

      <main>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Trouvez votre bien idéal</h1>
            <p>Plus de 100 biens disponibles dans les plus belles villes de France</p>
            <Link href="/properties" className={styles.heroBtn}>
              Voir tous les biens
            </Link>
          </div>
        </section>

        {/* VILLES */}
        <section className={styles.citiesSection}>
          <div className={styles.container}>
            <p className={styles.citiesLabel}>Rechercher par ville</p>
            <div className={styles.citiesList}>
              {CITIES.map((city) => (
                <Link key={city.name} href={`/properties?city=${city.name}`} className={styles.cityTag}>
                  <span>{city.emoji}</span> {city.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* BIENS */}
        <section className={styles.propertiesSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Biens à la une</h2>
            <p className={styles.sectionSubtitle}>Notre sélection du moment</p>

            {loading && (
              <div className={styles.stateBox}>
                <div className={styles.spinner} />
                <p>Chargement des biens…</p>
              </div>
            )}

            {error && !loading && (
              <div className={`${styles.stateBox} ${styles.stateError}`}>
                <p>{error}</p>
                <button onClick={fetchProperties} className={styles.retryBtn}>
                  Réessayer
                </button>
              </div>
            )}

            {!loading && !error && properties.length === 0 && (
              <div className={styles.stateBox}>
                <p>Aucun bien disponible pour le moment.</p>
              </div>
            )}

            {!loading && !error && properties.length > 0 && (
              <>
                <div className={styles.grid}>
                  {properties.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
                <div className={styles.seeMore}>
                  <Link href="/properties" className={styles.seeMoreBtn}>
                    Voir tous les biens →
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getProperties } from '../lib/api';
import styles from '../styles/Properties.module.css';

export default function Properties() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    type: '',     // vente | location
    minPrice: '',
    maxPrice: '',
  });

  // Récupère les biens
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProperties({ page_size: 100 });
      const data = res.data.results || res.data;
      setProperties(data);
      setFiltered(data);
    } catch {
      setError('Impossible de charger les biens.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  // Applique les filtres depuis l'URL au premier chargement
  useEffect(() => {
    if (router.query.city) {
      setFilters((f) => ({ ...f, city: router.query.city }));
    }
  }, [router.query.city]);

  // Filtre côté client
  useEffect(() => {
    let result = [...properties];
    if (filters.city)
      result = result.filter((p) =>
        p.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    if (filters.type)
      result = result.filter((p) => p.transaction_type === filters.type);
    if (filters.minPrice)
      result = result.filter((p) => Number(p.price) >= Number(filters.minPrice));
    if (filters.maxPrice)
      result = result.filter((p) => Number(p.price) <= Number(filters.maxPrice));
    setFiltered(result);
  }, [filters, properties]);

  const handleFilter = (key, value) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const clearFilters = () =>
    setFilters({ city: '', type: '', minPrice: '', maxPrice: '' });

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <>
      <Head>
        <title>Tous les biens — ImmoApp</title>
        <meta name="description" content="Parcourez notre catalogue de biens immobiliers." />
      </Head>

      <Navbar />

      <main className={styles.page}>
        {/* En-tête */}
        <section className={styles.header}>
          <div className={styles.container}>
            <h1>Nos biens immobiliers</h1>
            <p>Trouvez le bien qui vous correspond parmi notre catalogue</p>
          </div>
        </section>

        <div className={styles.container}>
          {/* Filtres */}
          <div className={styles.filtersBar}>
            <input
              type="text"
              placeholder="Ville…"
              value={filters.city}
              onChange={(e) => handleFilter('city', e.target.value)}
              className={styles.filterInput}
            />
            <select
              value={filters.type}
              onChange={(e) => handleFilter('type', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Achat &amp; Location</option>
              <option value="vente">À Vendre</option>
              <option value="location">À Louer</option>
            </select>
            <input
              type="number"
              placeholder="Prix min €"
              value={filters.minPrice}
              onChange={(e) => handleFilter('minPrice', e.target.value)}
              className={styles.filterInput}
            />
            <input
              type="number"
              placeholder="Prix max €"
              value={filters.maxPrice}
              onChange={(e) => handleFilter('maxPrice', e.target.value)}
              className={styles.filterInput}
            />
            {hasFilters && (
              <button onClick={clearFilters} className={styles.clearBtn}>
                Effacer
              </button>
            )}
          </div>

          {/* Résultats */}
          <p className={styles.count}>
            {loading
              ? 'Chargement…'
              : `${filtered.length} bien${filtered.length !== 1 ? 's' : ''} trouvé${filtered.length !== 1 ? 's' : ''}`}
          </p>

          {loading && (
            <div className={styles.stateBox}>
              <div className={styles.spinner} />
            </div>
          )}

          {error && !loading && (
            <div className={`${styles.stateBox} ${styles.stateError}`}>
              <p>{error}</p>
              <button onClick={fetchProperties} className={styles.retryBtn}>Réessayer</button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className={styles.stateBox}>
              <p>Aucun bien ne correspond à vos critères.</p>
              {hasFilters && (
                <button onClick={clearFilters} className={styles.retryBtn}>Voir tous les biens</button>
              )}
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className={styles.grid}>
              {filtered.map((property) => (
                <Link key={property.id} href={`/property/${property.id}`} className={styles.cardLink}>
                  <article className={styles.card}>
                    <div className={styles.cardImage}>
                      <img
                        src={`https://picsum.photos/seed/${property.id}/400/300`}
                        alt={property.title}
                        loading="lazy"
                      />
                      <span className={`${styles.badge} ${property.transaction_type === 'vente' ? styles.badgeSale : styles.badgeRent}`}>
                        {property.transaction_type === 'vente' ? 'Vente' : 'Location'}
                      </span>
                    </div>
                    <div className={styles.cardBody}>
                      <h3>{property.title}</h3>
                      <p className={styles.loc}>📍 {property.city} · {property.zip_code}</p>
                      <div className={styles.feats}>
                        <span>🛏 {property.bedrooms} ch.</span>
                        <span>📐 {property.surface} m²</span>
                      </div>
                      <strong className={styles.price}>
                        {Number(property.price).toLocaleString('fr-FR')} €
                        {property.transaction_type === 'location' && <small>/mois</small>}
                      </strong>
                    </div>
                  </article>
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

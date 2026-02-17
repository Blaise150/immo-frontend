import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from '../../styles/PropertyDetail.module.css';

export default function PropertyDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`https://immo-backend-production-deb8.up.railway.app/api/properties/${id}/`);
      if (!response.ok) throw new Error('Property not found');
      const data = await response.json();
      setProperty(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const images = property ? Array.from({ length: 6 }, (_, i) => 
    `https://picsum.photos/seed/${property.id}-${i}/800/600`
  ) : [];

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p>Chargement...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h1>Propriété introuvable</h1>
          <Link href="/properties">
            <a style={{ color: '#667eea' }}>← Retour aux biens</a>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{property.title} - ImmoApp</title>
      </Head>

      <Navbar />

      <main className={styles.detailPage}>
        <div className={styles.breadcrumb}>
          <div className={styles.container}>
            <Link href="/">Accueil</Link>
            <span> › </span>
            <Link href="/properties">Biens</Link>
            <span> › </span>
            <span>{property.city}</span>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.mainContent}>
            <div className={styles.imageGallery}>
              <div className={styles.mainImage}>
                <img src={images[currentImage]} alt={property.title} />
                <span className={styles.badge}>
                  {property.transaction_type === 'vente' ? 'À Vendre' : 'À Louer'}
                </span>
                <button 
                  className={styles.prevBtn}
                  onClick={() => setCurrentImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                >
                  ‹
                </button>
                <button 
                  className={styles.nextBtn}
                  onClick={() => setCurrentImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                >
                  ›
                </button>
                <div className={styles.imageCounter}>
                  {currentImage + 1} / {images.length}
                </div>
              </div>
              <div className={styles.thumbnails}>
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Photo ${index + 1}`}
                    className={currentImage === index ? styles.activeThumbnail : ''}
                    onClick={() => setCurrentImage(index)}
                  />
                ))}
              </div>
            </div>

            <div className={styles.propertyInfo}>
              <h1>{property.title}</h1>
              <p className={styles.location}>
                📍 {property.address}, {property.city} ({property.zip_code})
              </p>

              <div className={styles.price}>
                {property.price.toLocaleString('fr-FR')} €
                {property.transaction_type === 'location' && '/mois'}
              </div>

              <div className={styles.features}>
                <div className={styles.feature}>
                  <span className={styles.icon}>🏠</span>
                  <div>
                    <strong>{property.surface} m²</strong>
                    <p>Surface</p>
                  </div>
                </div>
                <div className={styles.feature}>
                  <span className={styles.icon}>🛏️</span>
                  <div>
                    <strong>{property.bedrooms}</strong>
                    <p>Chambres</p>
                  </div>
                </div>
                <div className={styles.feature}>
                  <span className={styles.icon}>🚿</span>
                  <div>
                    <strong>{property.bathrooms}</strong>
                    <p>Salles de bain</p>
                  </div>
                </div>
                <div className={styles.feature}>
                  <span className={styles.icon}>📦</span>
                  <div>
                    <strong>{property.property_type}</strong>
                    <p>Type</p>
                  </div>
                </div>
              </div>

              <div className={styles.description}>
                <h2>Description</h2>
                <p>{property.description}</p>
              </div>

              <div className={styles.characteristics}>
                <h2>Caractéristiques</h2>
                <div className={styles.charGrid}>
                  <div className={styles.charItem}>
                    <span>Type de bien</span>
                    <strong>{property.property_type}</strong>
                  </div>
                  <div className={styles.charItem}>
                    <span>Surface</span>
                    <strong>{property.surface} m²</strong>
                  </div>
                  <div className={styles.charItem}>
                    <span>Chambres</span>
                    <strong>{property.bedrooms}</strong>
                  </div>
                  <div className={styles.charItem}>
                    <span>Salles de bain</span>
                    <strong>{property.bathrooms}</strong>
                  </div>
                  <div className={styles.charItem}>
                    <span>Ville</span>
                    <strong>{property.city}</strong>
                  </div>
                  <div className={styles.charItem}>
                    <span>Code postal</span>
                    <strong>{property.zip_code}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.contactCard}>
              <div className={styles.agencyInfo}>
                <div className={styles.agencyLogo}>🏢</div>
                <div>
                  <h3>ImmoApp</h3>
                  <p>Agence immobilière</p>
                </div>
              </div>

              <button className={styles.contactBtn}>
                📞 Afficher le numéro
              </button>

              <form className={styles.contactForm} onSubmit={(e) => e.preventDefault()}>
                <h4>Contactez l'agence</h4>
                <input type="text" placeholder="Prénom *" required />
                <input type="text" placeholder="Nom *" required />
                <input type="email" placeholder="Email *" required />
                <input type="tel" placeholder="Téléphone *" required />
                <textarea placeholder="Votre message..." rows="4"></textarea>
                <button type="submit" className={styles.submitBtn}>
                  ✉️ Envoyer
                </button>
              </form>
            </div>

            <div className={styles.priceInfo}>
              <h4>Prix au m²</h4>
              <div className={styles.pricePerSqm}>
                {Math.round(property.price / property.surface).toLocaleString('fr-FR')} €/m²
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
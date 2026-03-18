import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getProperty, sendContactMessage } from '../../lib/api';
import styles from '../../styles/PropertyDetail.module.css';

const TYPE_LABELS = {
  appartement: 'Appartement',
  maison: 'Maison',
  studio: 'Studio',
  villa: 'Villa',
  terrain: 'Terrain',
};

export default function PropertyDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', message: '' });
  const [contactStatus, setContactStatus] = useState('idle'); // idle | sending | success | error
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await getProperty(id);
        setProperty(res.data);
      } catch {
        setProperty(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const images = property
    ? Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/${property.id}-${i}/800/600`)
    : [];

  const handleFormChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus('sending');
    try {
      await sendContactMessage({ ...form, property: id });
      setContactStatus('success');
      setForm({ first_name: '', last_name: '', email: '', phone: '', message: '' });
    } catch {
      setContactStatus('error');
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className={styles.loadingPage}><div className={styles.spinner} /></div>
      <Footer />
    </>
  );

  if (!property) return (
    <>
      <Navbar />
      <div className={styles.notFound}>
        <h1>Bien introuvable</h1>
        <p>Ce bien n'existe pas ou a été retiré.</p>
        <Link href="/properties" className={styles.backLink}>← Retour aux biens</Link>
      </div>
      <Footer />
    </>
  );

  const pricePerSqm = Math.round(property.price / property.surface);

  return (
    <>
      <Head>
        <title>{property.title} — ImmoApp</title>
        <meta name="description" content={property.description?.slice(0, 160)} />
      </Head>

      <Navbar />

      <main className={styles.page}>
        {/* Fil d'Ariane */}
        <div className={styles.breadcrumb}>
          <div className={styles.container}>
            <Link href="/">Accueil</Link>
            <span> / </span>
            <Link href="/properties">Biens</Link>
            <span> / </span>
            <span>{property.title}</span>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.layout}>
            {/* Colonne principale */}
            <div className={styles.main}>
              {/* Galerie */}
              <div className={styles.gallery}>
                <div className={styles.galleryMain}>
                  <img src={images[currentImage]} alt={`Photo ${currentImage + 1}`} />
                  <span className={`${styles.galleryBadge} ${property.transaction_type === 'vente' ? styles.badgeSale : styles.badgeRent}`}>
                    {property.transaction_type === 'vente' ? 'À Vendre' : 'À Louer'}
                  </span>
                  <button className={styles.navBtn} style={{ left: '12px' }}
                    onClick={() => setCurrentImage((i) => (i - 1 + images.length) % images.length)}>
                    ‹
                  </button>
                  <button className={styles.navBtn} style={{ right: '12px' }}
                    onClick={() => setCurrentImage((i) => (i + 1) % images.length)}>
                    ›
                  </button>
                  <span className={styles.counter}>{currentImage + 1} / {images.length}</span>
                </div>
                <div className={styles.thumbs}>
                  {images.map((img, i) => (
                    <img key={i} src={img} alt=""
                      className={i === currentImage ? styles.thumbActive : ''}
                      onClick={() => setCurrentImage(i)} />
                  ))}
                </div>
              </div>

              {/* Infos */}
              <div className={styles.info}>
                <h1>{property.title}</h1>
                <p className={styles.address}>
                  📍 {property.address}, {property.city} {property.zip_code}
                </p>
                <div className={styles.price}>
                  {Number(property.price).toLocaleString('fr-FR')} €
                  {property.transaction_type === 'location' && <small>/mois</small>}
                </div>

                <div className={styles.features}>
                  <div className={styles.feat}><span>📐</span><strong>{property.surface} m²</strong><p>Surface</p></div>
                  <div className={styles.feat}><span>🛏</span><strong>{property.bedrooms}</strong><p>Chambres</p></div>
                  <div className={styles.feat}><span>🚿</span><strong>{property.bathrooms}</strong><p>Sdb</p></div>
                  <div className={styles.feat}><span>🏠</span><strong>{TYPE_LABELS[property.property_type] || property.property_type}</strong><p>Type</p></div>
                </div>

                {property.description && (
                  <div className={styles.section}>
                    <h2>Description</h2>
                    <p>{property.description}</p>
                  </div>
                )}

                <div className={styles.section}>
                  <h2>Caractéristiques</h2>
                  <dl className={styles.specs}>
                    <div><dt>Type de bien</dt><dd>{TYPE_LABELS[property.property_type] || property.property_type}</dd></div>
                    <div><dt>Surface habitable</dt><dd>{property.surface} m²</dd></div>
                    <div><dt>Nombre de chambres</dt><dd>{property.bedrooms}</dd></div>
                    <div><dt>Salles de bain</dt><dd>{property.bathrooms}</dd></div>
                    <div><dt>Ville</dt><dd>{property.city}</dd></div>
                    <div><dt>Code postal</dt><dd>{property.zip_code}</dd></div>
                    <div><dt>Prix au m²</dt><dd>{pricePerSqm.toLocaleString('fr-FR')} €</dd></div>
                    <div><dt>Transaction</dt><dd>{property.transaction_type === 'vente' ? 'Vente' : 'Location'}</dd></div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className={styles.sidebar}>
              <div className={styles.contactCard}>
                <div className={styles.agency}>
                  <div className={styles.agencyIcon}>🏢</div>
                  <div>
                    <strong>ImmoApp</strong>
                    <p>Agence immobilière</p>
                  </div>
                </div>

                <button
                  className={styles.phoneBtn}
                  onClick={() => setShowPhone(!showPhone)}
                >
                  {showPhone ? '📞 +33 5 23 45 67 89' : '📞 Afficher le numéro'}
                </button>

                <form onSubmit={handleContactSubmit} className={styles.contactForm}>
                  <h3>Envoyer un message</h3>

                  {contactStatus === 'success' && (
                    <div className={styles.successMsg}>✅ Message envoyé ! Nous vous répondrons rapidement.</div>
                  )}
                  {contactStatus === 'error' && (
                    <div className={styles.errorMsg}>❌ Une erreur est survenue. Veuillez réessayer.</div>
                  )}

                  <div className={styles.formRow}>
                    <input name="first_name" type="text" placeholder="Prénom *" value={form.first_name} onChange={handleFormChange} required />
                    <input name="last_name" type="text" placeholder="Nom *" value={form.last_name} onChange={handleFormChange} required />
                  </div>
                  <input name="email" type="email" placeholder="Email *" value={form.email} onChange={handleFormChange} required />
                  <input name="phone" type="tel" placeholder="Téléphone *" value={form.phone} onChange={handleFormChange} required />
                  <textarea name="message" rows="3" placeholder="Votre message…" value={form.message} onChange={handleFormChange} />
                  <button type="submit" disabled={contactStatus === 'sending'}>
                    {contactStatus === 'sending' ? 'Envoi…' : 'Envoyer'}
                  </button>
                </form>
              </div>

              <div className={styles.priceBox}>
                <p>Prix au m²</p>
                <strong>{pricePerSqm.toLocaleString('fr-FR')} €/m²</strong>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

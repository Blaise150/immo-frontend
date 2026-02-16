import { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../styles/Contact.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    // Simuler l'envoi (à connecter avec votre backend plus tard)
    setTimeout(() => {
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setTimeout(() => setStatus(''), 3000);
    }, 1500);
  };

  return (
    <>
      <Head>
        <title>Contact - ImmoApp</title>
        <meta name="description" content="Contactez-nous pour toute question" />
      </Head>

      <Navbar />

      <main className={styles.contactPage}>
        <section className={styles.hero}>
          <h1>Contactez-nous</h1>
          <p>Notre équipe est à votre écoute pour répondre à toutes vos questions</p>
        </section>

        <section className={styles.contactSection}>
          <div className={styles.container}>
            <div className={styles.grid}>
              {/* Formulaire */}
              <div className={styles.formContainer}>
                <h2>Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Nom complet *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Votre nom"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone">Téléphone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="subject">Sujet *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="achat">Achat d'un bien</option>
                      <option value="vente">Vente d'un bien</option>
                      <option value="location">Location</option>
                      <option value="estimation">Estimation gratuite</option>
                      <option value="autre">Autre question</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      placeholder="Décrivez votre demande..."
                    />
                  </div>

                  <button 
                    type="submit" 
                    className={styles.submitBtn}
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
                  </button>

                  {status === 'success' && (
                    <div className={styles.successMessage}>
                      ✅ Message envoyé avec succès ! Nous vous répondrons rapidement.
                    </div>
                  )}
                </form>
              </div>

              {/* Informations de contact */}
              <div className={styles.infoContainer}>
                <h2>Nos coordonnées</h2>
                
                <div className={styles.infoCard}>
                  <div className={styles.icon}>📍</div>
                  <div>
                    <h3>Adresse</h3>
                    <p>123 Avenue de l'Immobilier<br />75001 Paris, France</p>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.icon}>📞</div>
                  <div>
                    <h3>Téléphone</h3>
                    <p>+33 1 23 45 67 89</p>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.icon}>✉️</div>
                  <div>
                    <h3>Email</h3>
                    <p>contact@immoapp.fr</p>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.icon}>🕐</div>
                  <div>
                    <h3>Horaires</h3>
                    <p>Lun - Ven : 9h - 19h<br />Sam : 10h - 17h</p>
                  </div>
                </div>

                <div className={styles.socialLinks}>
                  <h3>Suivez-nous</h3>
                  <div className={styles.social}>
                    <a href="#" aria-label="Facebook">📘</a>
                    <a href="#" aria-label="Twitter">🐦</a>
                    <a href="#" aria-label="Instagram">📷</a>
                    <a href="#" aria-label="LinkedIn">💼</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
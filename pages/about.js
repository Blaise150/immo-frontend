import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../styles/About.module.css';

export default function About() {
  return (
    <>
      <Head>
        <title>À propos - ImmoApp</title>
      </Head>

      <Navbar />

      <main className={styles.aboutPage}>
        <section className={styles.hero}>
          <h1>À propos d'ImmoApp</h1>
          <p>Votre partenaire de confiance dans l'immobilier depuis 2020</p>
        </section>

        <section className={styles.content}>
          <div className={styles.container}>
            <div className={styles.mission}>
              <h2>Notre Mission</h2>
              <p>
                ImmoApp a pour mission de simplifier votre recherche immobilière en vous offrant 
                un accès facile aux meilleurs biens disponibles à Paris, Monaco, Nice, Lyon et Marseille. 
                Nous nous engageons à vous accompagner à chaque étape de votre projet immobilier.
              </p>
            </div>

            <div className={styles.values}>
              <h2>Nos Valeurs</h2>
              <div className={styles.valueGrid}>
                <div className={styles.valueCard}>
                  <div className={styles.valueIcon}>🎯</div>
                  <h3>Excellence</h3>
                  <p>Nous visons l'excellence dans chaque service que nous offrons</p>
                </div>
                <div className={styles.valueCard}>
                  <div className={styles.valueIcon}>🤝</div>
                  <h3>Confiance</h3>
                  <p>La transparence et l'honnêteté sont au cœur de nos relations</p>
                </div>
                <div className={styles.valueCard}>
                  <div className={styles.valueIcon}>💡</div>
                  <h3>Innovation</h3>
                  <p>Nous utilisons les dernières technologies pour vous servir</p>
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

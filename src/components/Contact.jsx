import styles from './Contact.module.css'

export default function Contact() {
  return (
    <section className={styles.section} id="contact">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>05</span>
          <h2 className={styles.title}>Contact</h2>
        </div>
        <div className={styles.content}>
          <p className={styles.greeting}>
            Hi! I don't bite{' '}
            <span className={styles.wave}>👋</span>
          </p>
          <a href="mailto:mmadhurakavi@college.harvard.edu" className={styles.email}>
            mmadhurakavi@college.harvard.edu
          </a>
          <div className={styles.availability}>
            <span className={styles.dot} />
            {/* TODO: Update availability status manually here */}
            <span>open to opportunities</span>
          </div>
        </div>
      </div>
    </section>
  )
}

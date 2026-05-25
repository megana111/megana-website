import { useEffect, useRef } from 'react'
import styles from './Honors.module.css'

const honors = [
  {
    year: '2026',
    title: 'Coca-Cola Scholar',
    detail: '0.14% acceptance rate',
  },
  {
    year: '2025',
    title: 'Emerging Innovator of the Year',
    detail: 'Horn Entrepreneurship · 1 out of 360 international applications',
  },
  {
    year: '2024',
    title: '2nd Place — Princeton IgniteSTEM Challenge',
    detail: 'Smart trash can automating food composting via CAD',
  },
  {
    year: '2023',
    title: 'Sustainability Impact for UNSDGs — Excellence Award',
    detail: 'Youngest awardee. International recognition.',
  },
  {
    year: '2023',
    title: 'Global Youth Ambassador of SDG & Carbon Neutrality',
    detail: 'Judged by UN & UNIDO professionals. International competition with 5M+ viewers.',
  },
]

export default function Honors() {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add(styles.revealed), i * 150)
        }
      }),
      { threshold: 0.15 }
    )
    ref.current?.querySelectorAll(`.${styles.item}`).forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.section} id="honors">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>04</span>
          <h2 className={styles.title}>Honors</h2>
        </div>
        <div className={styles.timeline} ref={ref}>
          <div className={styles.line} />
          {honors.map((h, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.dot} />
              <div className={styles.year}>{h.year}</div>
              <div className={styles.card}>
                <div className={styles.honorTitle}>{h.title}</div>
                <div className={styles.honorDetail}>{h.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

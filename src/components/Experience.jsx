import { useEffect, useRef } from 'react'
import styles from './Experience.module.css'

const experiences = [
  {
    num: '01',
    title: 'Liila',
    tagline: 'Founder & CEO · sustainable fashion from bamboo, banana & upcycled fabric',
    tag: 'Entrepreneurship',
    back: 'Founded at age 15. Two collections. International supply chain. 600k+ social media reach. 500+ handmade pieces sold. 50+ sustainability workshops & pop-ups.',
    learned: 'supply chains, storytelling, grit',
    link: 'https://shopliila.com',
  },
  {
    num: '02',
    title: 'FEMA Youth Preparedness Council',
    tagline: '1 of 15 selected globally · Equity & Access Team Lead',
    tag: 'Public Service',
    back: 'Project development at the intersection of finance, AI & sustainability. Ensuring underserved communities receive equitable emergency support. Funded trip to Washington, D.C.',
    learned: 'policy, emergency tech, equity',
    link: null,
  },
  {
    num: '03',
    title: 'Kuchipudi Classical Dance',
    tagline: '13 years · hundreds of performances & competitions',
    tag: 'Arts & Culture',
    back: 'Trained in classical Indian dance since childhood. Performed and competed in hundreds of shows. Raised $10,000 through dance for visually challenged and tribal schools.',
    learned: 'discipline, stage presence, giving back',
    link: null,
  },
  {
    num: '04',
    title: 'CITYarts, Inc.',
    tagline: 'Finance & PR · NYC public art nonprofit',
    tag: 'Finance',
    back: 'NYC nonprofit creating public art in underserved communities. Supported finance operations and public relations strategy.',
    learned: 'nonprofits, finance, community art',
    link: null,
  },
]

function Card({ exp }) {
  const inner = (
    <div className={styles.cardInner}>
      <div className={styles.cardFront}>
        <div>
          <div className={styles.cardNum}>{exp.num}</div>
          <div className={styles.cardTitle}>{exp.title}</div>
          <div className={styles.cardTagline}>{exp.tagline}</div>
        </div>
        <div className={styles.cardBottom}>
          <span className={styles.tag}>{exp.tag}</span>
          {exp.link && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
            </svg>
          )}
          <span className={styles.hoverHint}>hover ↻</span>
        </div>
      </div>
      <div className={styles.cardBack}>
        <div className={styles.backTitle}>{exp.title}</div>
        <p className={styles.backDesc}>{exp.back}</p>
        <span className={styles.learned}>picked up: {exp.learned}</span>
      </div>
    </div>
  )

  if (exp.link) {
    return (
      <a href={exp.link} target="_blank" rel="noreferrer" className={styles.cardOuter}>
        {inner}
      </a>
    )
  }
  return <div className={styles.cardOuter}>{inner}</div>
}

export default function Experience() {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add(styles.revealed), i * 120)
        }
      }),
      { threshold: 0.1 }
    )
    ref.current?.querySelectorAll(`.${styles.cardOuter}`).forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.section} id="experience">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>03</span>
          <h2 className={styles.title}>Experience</h2>
        </div>
        <div className={styles.grid} ref={ref}>
          {experiences.map(exp => <Card key={exp.num} exp={exp} />)}
        </div>
      </div>
    </section>
  )
}

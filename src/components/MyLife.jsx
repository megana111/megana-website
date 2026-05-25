import { useEffect, useRef } from 'react'
import styles from './MyLife.module.css'

const photos = [
  { id: 1, label: 'coca-cola scholars summit',      src: '/photos/coke-scholars.jpg',      pos: 'center 15%',    gridArea: '1 / 1 / 3 / 2' },
  { id: 2, label: 'emerging innovator of the year', src: '/photos/emerging-innovator.jpg', pos: 'center 30%',    gridArea: '1 / 2 / 2 / 3' },
  { id: 3, label: 'somewhere out there',             src: '/photos/vacation.jpg',          pos: 'center 20%',    gridArea: '1 / 3 / 3 / 4' },
  { id: 4, label: 'harvard gang',                    src: '/photos/harvard-gang.jpg',       pos: 'center 65%', gridArea: '4 / 1 / 5 / 3' },
  { id: 5, label: 'liila sustainability workshop',   src: '/photos/liila-workshop.jpg',     pos: 'center 55%',    gridArea: '3 / 1 / 4 / 2' },
  { id: 6, label: 'kuchipudi rangapravesham',        src: '/photos/rangapravesham.jpg',     pos: 'center top',    gridArea: '3 / 2 / 4 / 3' },
  { id: 7, label: 'green difference award',          src: '/photos/green-schools.jpg',      pos: 'center 25%',    gridArea: '3 / 3 / 5 / 4' },
  { id: 8, label: 'building in the community',       src: '/photos/school-award.jpg',       pos: 'center center', gridArea: '2 / 2 / 3 / 3' },
]

export default function MyLife() {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add(styles.revealed), i * 100)
        }
      }),
      { threshold: 0.1 }
    )
    ref.current?.querySelectorAll(`.${styles.photoItem}`).forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.section} id="life">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>02</span>
          <h2 className={styles.title}>My Life</h2>
        </div>
        <div className={styles.grid} ref={ref}>
          {photos.map(photo => (
            <div key={photo.id} className={styles.photoItem} style={{ gridArea: photo.gridArea }}>
              <img src={photo.src} alt={photo.label} className={styles.img} style={{ objectPosition: photo.pos }} />
              <div className={styles.caption}>{photo.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

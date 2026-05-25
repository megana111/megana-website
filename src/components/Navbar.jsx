import { useEffect, useState } from 'react'
import styles from './Navbar.module.css'

export default function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <span className={`${styles.logoName} ${scrolled ? styles.logoVisible : ''}`}>Megana</span>
      </div>
      <div className={styles.links}>
        {['experience', 'honors', 'life', 'contact'].map(id => (
          <button key={id} className={styles.link} onClick={() => scrollTo(id)}>
            {id === 'life' ? 'my life' : id}
          </button>
        ))}
        <button className={styles.themeBtn} onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? '☀' : '☽'}
        </button>
      </div>
    </nav>
  )
}

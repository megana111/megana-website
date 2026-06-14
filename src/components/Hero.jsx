import { useEffect, useState } from 'react'
import styles from './Hero.module.css'

const phrases = [
  'dabbling in tech.',
  'chasing social impact.',
  'building things that matter.',
  'figuring it all out.',
  "open to what's next.",
]

export default function Hero() {
  const [displayed, setDisplayed] = useState('')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [typing, setTyping] = useState(true)
  const [charIdx, setCharIdx] = useState(0)
  const [showName, setShowName] = useState(false)
  const [showSub, setShowSub] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowName(true), 300)
    const t2 = setTimeout(() => setShowSub(true), 1200)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    if (!showSub) return
    const phrase = phrases[phraseIdx]
    if (typing) {
      if (charIdx < phrase.length) {
        const t = setTimeout(() => {
          setDisplayed(phrase.slice(0, charIdx + 1))
          setCharIdx(c => c + 1)
        }, 55)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setTyping(false), 1800)
        return () => clearTimeout(t)
      }
    } else {
      if (charIdx > 0) {
        const t = setTimeout(() => {
          setDisplayed(phrase.slice(0, charIdx - 1))
          setCharIdx(c => c - 1)
        }, 30)
        return () => clearTimeout(t)
      } else {
        setPhraseIdx(i => (i + 1) % phrases.length)
        setTyping(true)
      }
    }
  }, [charIdx, typing, phraseIdx, showSub])

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.content}>
        <h1 className={`${styles.name} ${showName ? styles.visible : ''}`}>
          hi! i'm megana.
        </h1>
        <div className={`${styles.typewriterWrap} ${showSub ? styles.visible : ''}`}>
          <span className={styles.typewriter}>{displayed}</span>
          <span className={styles.cursor}>|</span>
        </div>
        <div className={`${styles.meta} ${showSub ? styles.visible : ''}`}>
          <a href="mailto:mmadhurakavi@college.harvard.edu" className={styles.email}>
            mmadhurakavi@college.harvard.edu
          </a>
          <div className={styles.socials}>
            <a href="http://www.linkedin.com/in/megana-madhurakavi" target="_blank" rel="noreferrer" className={styles.socialLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>LinkedIn</span>
            </a>
            <a href="https://github.com/megana111" target="_blank" rel="noreferrer" className={styles.socialLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
      <div className={styles.scrollHint}>
        <span>scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  )
}

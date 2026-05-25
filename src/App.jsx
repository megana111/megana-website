import { useState, useEffect } from 'react'
import './index.css'
import ScrollProgress from './components/ScrollProgress'
import CustomCursor from './components/CustomCursor'
import CursorTrail from './components/CursorTrail'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MyLife from './components/MyLife'
import Experience from './components/Experience'
import Honors from './components/Honors'
import Contact from './components/Contact'
import MeganaBot from './components/MeganaBot'
import Confetti from './components/Confetti'
import useEasterEgg from './hooks/useEasterEgg'

export default function App() {
  const [theme, setTheme] = useState('dark')
  const easterEgg = useEasterEgg()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    <div>
      <ScrollProgress />
      <CustomCursor />
      <CursorTrail />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <MyLife />
        <Experience />
        <Honors />
        <Contact />
      </main>
      <MeganaBot />
      <Confetti active={easterEgg} />
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        fontSize: '0.75rem',
        color: 'var(--gray-400)',
        borderTop: '0.5px solid var(--gray-200)',
        background: 'var(--white)',
      }}>
        © 2025 Megana Madhurakavi — made with ♡
      </footer>
    </div>
  )
}

import { useEffect, useState } from 'react'

export default function useEasterEgg() {
  const [triggered, setTriggered] = useState(false)
  const [typed, setTyped] = useState('')

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      const next = (typed + e.key).slice(-4).toLowerCase()
      setTyped(next)
      if (next.includes('hi') || next.includes('hey')) {
        setTriggered(true)
        setTimeout(() => setTriggered(false), 3000)
        setTyped('')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [typed])

  return triggered
}

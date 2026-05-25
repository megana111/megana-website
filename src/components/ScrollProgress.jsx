import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: '2px', zIndex: 10000,
      background: 'var(--gray-200)',
    }}>
      <div style={{
        height: '100%',
        width: `${progress}%`,
        background: 'var(--pastel-blue-mid)',
        transition: 'width 0.1s linear',
      }} />
    </div>
  )
}

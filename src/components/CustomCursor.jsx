import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const animRef = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', onMove)

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12
      ring.current.y += (pos.current.y - ring.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px'
        ringRef.current.style.top = ring.current.y + 'px'
      }
      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    const onEnter = () => {
      dotRef.current?.classList.add('hover')
      ringRef.current?.classList.add('hover')
    }
    const onLeave = () => {
      dotRef.current?.classList.remove('hover')
      ringRef.current?.classList.remove('hover')
    }

    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <>
      <style>{`
        .cursor-dot {
          position: fixed; pointer-events: none; z-index: 99999;
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--gray-900);
          transform: translate(-50%, -50%);
          transition: width 0.2s, height 0.2s, background 0.2s;
        }
        .cursor-ring {
          position: fixed; pointer-events: none; z-index: 99998;
          width: 28px; height: 28px; border-radius: 50%;
          border: 1px solid rgba(168,200,232,0.7);
          transform: translate(-50%, -50%);
          transition: width 0.3s, height 0.3s, border-color 0.3s;
        }
        .cursor-dot.hover { width: 10px; height: 10px; background: var(--pastel-blue-dark); }
        .cursor-ring.hover { width: 40px; height: 40px; border-color: var(--pastel-blue); }
        [data-theme="dark"] .cursor-dot { background: var(--gray-900); }
      `}</style>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}

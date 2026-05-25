import { useEffect, useRef } from 'react'

export default function Confetti({ active }) {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const animRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ['#A8C8E8', '#6AAED6', '#E4F0F9', '#FFD6E0', '#C3E6CB', '#FFF3CD']

    for (let i = 0; i < 80; i++) {
      particles.current.push({
        x: Math.random() * canvas.width,
        y: -10,
        w: Math.random() * 8 + 4,
        h: Math.random() * 4 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 4 + 2,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        opacity: 1,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.current = particles.current.filter(p => p.opacity > 0.05 && p.y < canvas.height + 20)
      particles.current.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotSpeed
        p.vy += 0.05
        if (p.y > canvas.height * 0.7) p.opacity -= 0.02
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation * Math.PI / 180)
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      })
      if (particles.current.length > 0) animRef.current = requestAnimationFrame(animate)
      else ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    animate()

    return () => {
      cancelAnimationFrame(animRef.current)
      particles.current = []
    }
  }, [active])

  if (!active) return null

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9998 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'var(--white)',
        border: '0.5px solid var(--pastel-blue)',
        borderRadius: '20px',
        padding: '1rem 2rem',
        fontFamily: 'var(--font-display)',
        fontSize: '1.3rem',
        color: 'var(--gray-900)',
        zIndex: 9999,
        pointerEvents: 'none',
        boxShadow: '0 8px 40px rgba(168,200,232,0.3)',
        animation: 'popIn 0.3s ease',
      }}>
        hey!! 👋 glad you're here
        <style>{`@keyframes popIn{from{opacity:0;transform:translate(-50%,-50%) scale(0.8)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}`}</style>
      </div>
    </>
  )
}

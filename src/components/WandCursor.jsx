import { useEffect, useRef } from 'react'

export default function WandCursor() {
  const canvasRef = useRef(null)
  const wandRef = useRef(null)
  const particles = useRef([])
  const mouse = useRef({ x: -200, y: -200 })
  const idRef = useRef(0)
  const frameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wand = wandRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const colors = [
      '#7ec8e3', '#4a90d9', '#85b7eb', '#5f9ea0',
      '#6dbf8b', '#90ee90', '#a8d8a8', '#b0c4de', '#aec6cf',
    ]

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      wand.style.left = e.clientX + 'px'
      wand.style.top = e.clientY + 'px'

      const count = Math.floor(Math.random() * 3) + 1
      for (let i = 0; i < count; i++) {
        particles.current.push({
          id: idRef.current++,
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 4 + 1.5,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5 - 0.8,
          life: 1,
          decay: Math.random() * 0.025 + 0.015,
        })
      }

      if (particles.current.length > 120) {
        particles.current = particles.current.slice(-120)
      }
    }

    window.addEventListener('mousemove', onMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= p.decay
        p.size *= 0.97

        if (p.life <= 0) {
          particles.current.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = p.life * 0.85
        ctx.shadowBlur = p.size * 3
        ctx.shadowColor = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
        ctx.restore()
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 99999,
        }}
      />

      <div
        ref={wandRef}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 100000,
          transform: 'rotate(-35deg)',
          transformOrigin: '4px 4px',
          left: -200,
          top: -200,
        }}
      >
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="5" cy="5" r="4" fill="#e8f4ff" opacity="0.95" />
          <circle cx="5" cy="5" r="7" fill="#7ec8e3" opacity="0.25" />
          <rect x="2.5" y="3.5" width="5.5" height="32" rx="2.8" transform="rotate(-4 2.5 3.5)" fill="url(#wg)" />
          <rect x="2.8" y="26" width="5.5" height="6" rx="1.2" transform="rotate(-4 2.8 26)" fill="#8b6914" opacity="0.9" />
          <defs>
            <linearGradient id="wg" x1="5" y1="0" x2="5" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f0f8ff" />
              <stop offset="25%" stopColor="#d4b896" />
              <stop offset="100%" stopColor="#4a2e0e" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  )
}
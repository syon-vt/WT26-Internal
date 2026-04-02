import { useEffect, useRef } from 'react'

export default function SlideTransition({ onDone }) {
  const canvasRef = useRef(null)
  const frameRef = useRef(null)
  const startTime = useRef(null)
  const particles = useRef([])
  const DURATION = 1100

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = [
      '#ffd700', '#fbbf24', '#f0c040',
      '#7ec8e3', '#6dbf8b', '#c0a0ff',
      '#ffffff', '#ffe680',
    ]

    for (let i = 0; i < 100; i++) {
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3 - 0.8,
        life: Math.random(),
        decay: Math.random() * 0.022 + 0.01,
        twinkle: Math.random() * Math.PI * 2,
      })
    }

    const animate = (ts) => {
      if (!startTime.current) startTime.current = ts
      const elapsed = ts - startTime.current
      const progress = Math.min(elapsed / DURATION, 1)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const overlayAlpha = progress < 0.4
        ? progress / 0.4
        : progress < 0.7
          ? 1
          : 1 - (progress - 0.7) / 0.3

      ctx.fillStyle = `rgba(0,0,0,${overlayAlpha * 0.6})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.shadowBlur = 0

      particles.current.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.life += p.decay
        p.twinkle += 0.1

        if (p.life > 1) {
          p.x = Math.random() * canvas.width
          p.y = Math.random() * canvas.height
          p.life = 0
          p.vx = (Math.random() - 0.5) * 3
          p.vy = (Math.random() - 0.5) * 3 - 0.8
        }

        const alpha = Math.sin(p.life * Math.PI) * (0.5 + 0.5 * Math.sin(p.twinkle)) * overlayAlpha
        if (alpha < 0.01) return

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.translate(p.x, p.y)
        ctx.rotate(p.twinkle)
        ctx.fillStyle = p.color

        const s = p.size
        ctx.beginPath()
        ctx.moveTo(0, -s * 2)
        ctx.lineTo(s * 0.4, -s * 0.4)
        ctx.lineTo(s * 2, 0)
        ctx.lineTo(s * 0.4, s * 0.4)
        ctx.lineTo(0, s * 2)
        ctx.lineTo(-s * 0.4, s * 0.4)
        ctx.lineTo(-s * 2, 0)
        ctx.lineTo(-s * 0.4, -s * 0.4)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      })

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        cancelAnimationFrame(frameRef.current)
        onDone && onDone()
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99998,
        pointerEvents: 'none',
      }}
    />
  )
}
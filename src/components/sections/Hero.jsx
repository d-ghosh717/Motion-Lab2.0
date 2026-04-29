import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useMagneticEffect } from '../../hooks/useMagneticEffect'
import { useStore } from '../../store/useStore'
import { getLenis } from '../../hooks/useLenis'

function initGalaxy(canvas) {
  const ctx = canvas.getContext('2d')
  let W = (canvas.width = window.innerWidth)
  let H = (canvas.height = window.innerHeight)
  let animId
  let time = 0

  const makeStar = (layer) => {
    const armCount = 3
    const armIndex = Math.floor(Math.random() * armCount)
    const armAngle = (armIndex / armCount) * Math.PI * 2
    const raw = Math.pow(Math.random(), 0.45)
    const radius = raw * Math.min(W, H) * 0.44
    const curl = radius * 0.0025
    const spread = (Math.random() - 0.5) * (0.6 + raw * 1.2)
    const angle = armAngle + curl + spread

    return {
      baseX: Math.cos(angle) * radius,
      baseY: Math.sin(angle) * radius,
      radius,
      r: layer === 0 ? Math.random() * 1.5 + 0.4
        : layer === 1 ? Math.random() * 0.9 + 0.2
          : Math.random() * 0.5 + 0.1,
      opacity: layer === 0 ? Math.random() * 0.9 + 0.1
        : layer === 1 ? Math.random() * 0.55 + 0.05
          : Math.random() * 0.35 + 0.05,
      speed: layer === 0 ? 0.00014 + Math.random() * 0.00008
        : layer === 1 ? 0.00009 + Math.random() * 0.00005
          : 0.00004 + Math.random() * 0.00003,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.01 + Math.random() * 0.025,
      layer,
      hue: [195, 210, 220, 40, 0, 185][Math.floor(Math.random() * 6)],
      sat: layer === 0 ? Math.random() * 70 : Math.random() * 30,
    }
  }

  const COUNTS = [280, 550, 900]
  const stars = [
    ...Array.from({ length: COUNTS[0] }, () => makeStar(0)),
    ...Array.from({ length: COUNTS[1] }, () => makeStar(1)),
    ...Array.from({ length: COUNTS[2] }, () => makeStar(2)),
  ]

  const nebulae = Array.from({ length: 7 }, (_, i) => ({
    angle: (i / 7) * Math.PI * 2 + Math.random() * 0.8,
    radius: (0.08 + Math.random() * 0.3) * Math.min(W, H) * 0.44,
    size: 55 + Math.random() * 130,
    hue: [170, 200, 220, 260, 190, 240, 180][i],
    opacity: 0.022 + Math.random() * 0.035,
    speed: 0.00005 + Math.random() * 0.00004,
  }))

  const mouse = { x: 0, y: 0 }
  const onMove = (e) => {
    mouse.x = (e.clientX / W - 0.5) * 2
    mouse.y = (e.clientY / H - 0.5) * 2
  }
  window.addEventListener('mousemove', onMove)

  const draw = () => {
    time += 1
    ctx.clearRect(0, 0, W, H)

    const cx = W / 2 + mouse.x * 16
    const cy = H / 2 + mouse.y * 16

    // Deep space bg
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H))
    bg.addColorStop(0, 'rgba(6,8,22,0)')
    bg.addColorStop(0.5, 'rgba(3,5,15,0.5)')
    bg.addColorStop(1, 'rgba(0,0,8,0.95)')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // Nebulae
    nebulae.forEach((n) => {
      const a = n.angle + time * n.speed
      const nx = cx + Math.cos(a) * n.radius + mouse.x * 6
      const ny = cy + Math.sin(a) * n.radius + mouse.y * 6
      const grd = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.size)
      grd.addColorStop(0, `hsla(${n.hue},70%,60%,${n.opacity * 2.2})`)
      grd.addColorStop(0.4, `hsla(${n.hue},60%,50%,${n.opacity})`)
      grd.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.arc(nx, ny, n.size, 0, Math.PI * 2)
      ctx.fillStyle = grd
      ctx.fill()
    })

    // Galactic core
    const coreR = Math.min(W, H) * 0.13
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR)
    core.addColorStop(0, 'rgba(210,225,255,0.2)')
    core.addColorStop(0.25, 'rgba(140,190,255,0.1)')
    core.addColorStop(0.6, 'rgba(80,140,220,0.04)')
    core.addColorStop(1, 'transparent')
    ctx.beginPath()
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2)
    ctx.fillStyle = core
    ctx.fill()

    // Stars
    stars.forEach((s) => {
      const rot = time * s.speed
      const cosR = Math.cos(rot)
      const sinR = Math.sin(rot)
      const px = cosR * s.baseX - sinR * s.baseY
      const py = sinR * s.baseX + cosR * s.baseY

      const ps = s.layer === 0 ? 22 : s.layer === 1 ? 11 : 5
      const x = cx + px + mouse.x * ps
      const y = cy + py + mouse.y * ps

      if (x < -12 || x > W + 12 || y < -12 || y > H + 12) return

      const twinkle = 0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinklePhase)
      const op = s.opacity * (0.55 + 0.45 * twinkle)
      const lum = 68 + twinkle * 32

      ctx.beginPath()
      ctx.arc(x, y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${s.hue},${s.sat}%,${lum}%,${op})`
      ctx.fill()

      if (s.layer === 0 && s.r > 0.85) {
        const glowR = s.r * (3.5 + twinkle * 5)
        const glow = ctx.createRadialGradient(x, y, 0, x, y, glowR)
        glow.addColorStop(0, `hsla(${s.hue},${s.sat}%,92%,${op * 0.28})`)
        glow.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(x, y, glowR, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        if (s.r > 1.1 && twinkle > 0.75) {
          ctx.save()
          ctx.strokeStyle = `hsla(${s.hue},40%,90%,${op * 0.14})`
          ctx.lineWidth = 0.6
          const sLen = s.r * 7
          ctx.beginPath(); ctx.moveTo(x - sLen, y); ctx.lineTo(x + sLen, y); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(x, y - sLen); ctx.lineTo(x, y + sLen); ctx.stroke()
          ctx.restore()
        }
      }
    })

    // Vignette
    const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.28, W / 2, H / 2, H * 0.9)
    vig.addColorStop(0, 'transparent')
    vig.addColorStop(1, 'rgba(0,0,10,0.75)')
    ctx.fillStyle = vig
    ctx.fillRect(0, 0, W, H)

    animId = requestAnimationFrame(draw)
  }
  draw()

  const onResize = () => {
    W = canvas.width = window.innerWidth
    H = canvas.height = window.innerHeight
  }
  window.addEventListener('resize', onResize)

  return () => {
    cancelAnimationFrame(animId)
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('resize', onResize)
  }
}

const words = ['CRAFT', 'CODE', 'MOTION', 'DEPTH']

export default function Hero() {
  const canvasRef = useRef(null)
  const ctaRef = useMagneticEffect(0.5)
  const wordIndex = useRef(0)
  const wordRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    return initGalaxy(canvasRef.current)
  }, [])

  useEffect(() => {
    const el = wordRef.current
    if (!el) return
    const cycle = () => {
      wordIndex.current = (wordIndex.current + 1) % words.length
      el.style.transform = 'translateY(-16px)'
      el.style.opacity = '0'
      el.style.filter = 'blur(10px)'
      setTimeout(() => {
        el.textContent = words[wordIndex.current]
        el.style.transform = 'translateY(0)'
        el.style.opacity = '1'
        el.style.filter = 'blur(0px)'
      }, 340)
    }
    const id = setInterval(cycle, 2300)
    return () => clearInterval(id)
  }, [])

  const scrollToGallery = () => {
    const lenis = getLenis()
    const el = document.getElementById('gallery')
    if (lenis && el) lenis.scrollTo(el, { duration: 1.4 })
  }

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.13, delayChildren: 0.4 } },
  }

  const fadeUp = {
    hidden: { y: 60, opacity: 0, filter: 'blur(12px)' },
    show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#02040e' }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,255,178,0.03) 0%, transparent 70%)' }} />

      <motion.div className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        variants={containerVariants} initial="hidden" animate="show">

        <motion.div variants={fadeUp} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs tracking-widest uppercase"
            style={{ background: 'rgba(0,255,178,0.06)', border: '1px solid rgba(0,255,178,0.22)', color: '#00FFB2', backdropFilter: 'blur(12px)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FFB2] animate-ping" />
            UI Motion Playground
          </span>
        </motion.div>

        <motion.div variants={fadeUp} className="mb-2">
          <h1 className="font-display leading-none tracking-wider" style={{ fontSize: 'clamp(52px,11vw,150px)', color: 'rgba(235,240,255,0.9)' }}>
            THE ART OF
          </h1>
        </motion.div>

        <motion.div variants={fadeUp} className="mb-10">
          <h1
            ref={wordRef}
            className="font-display leading-none tracking-wider"
            style={{
              fontSize: 'clamp(52px,11vw,150px)',
              background: 'linear-gradient(135deg, #00FFB2 0%, #00D4FF 55%, #00FFB2 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 4s ease infinite',
              filter: 'drop-shadow(0 0 50px rgba(0,255,178,0.4))',
              transition: 'transform 0.34s cubic-bezier(0.16,1,0.3,1), opacity 0.34s, filter 0.34s',
            }}
          >
            {words[0]}
          </h1>
        </motion.div>

        <motion.p variants={fadeUp} className="text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed"
          style={{ color: 'rgba(190,205,230,0.58)' }}>
          A living lab of hover states, glassmorphism, scroll choreography,
          and micro-interactions — built without compromise.
        </motion.p>

        <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 flex-wrap">
          <div ref={ctaRef}>
            <button onClick={scrollToGallery}
              className="group relative px-8 py-4 rounded-full font-body font-medium text-sm tracking-wide overflow-hidden"
              style={{ background: '#00FFB2', color: '#000' }}>
              <span className="relative z-10 flex items-center gap-2">
                Explore Effects
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:translate-x-1 transition-transform">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </button>
          </div>

          <button
            onClick={() => { const lenis = getLenis(); const el = document.getElementById('dev-tools'); if (lenis && el) lenis.scrollTo(el, { duration: 1.4 }) }}
            className="px-8 py-4 rounded-full font-body font-medium text-sm tracking-wide transition-all duration-300"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(190,205,230,0.65)', backdropFilter: 'blur(12px)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,178,0.4)'; e.currentTarget.style.color = '#00FFB2' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(190,205,230,0.65)' }}>
            ⟨/⟩ Dev Tools
          </button>
        </motion.div>

        <motion.div variants={fadeUp} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: 'rgba(0,255,178,0.38)' }}>Scroll</span>
          <motion.div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, #00FFB2, transparent)' }}
            animate={{ scaleY: [0, 1, 0], y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} />
        </motion.div>
      </motion.div>
    </section>
  )
}
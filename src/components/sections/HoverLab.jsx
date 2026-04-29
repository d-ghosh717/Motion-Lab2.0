import { useRef, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { useMagneticEffect } from '../../hooks/useMagneticEffect'
import { useTiltEffect } from '../../hooks/useTiltEffect'
import { createRipple } from '../../utils/ripple'
import SectionLabel from '../ui/SectionLabel'

// ── Ripple Button ──
function RippleButton() {
  const ref = useRef(null)
  const handleClick = (e) => createRipple(e, ref.current)
  return (
    <button
      ref={ref}
      onClick={handleClick}
      className="ripple-btn px-8 py-4 rounded-full glass border border-[var(--border)] text-[var(--text-primary)] font-body font-medium text-sm tracking-wide hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300 relative overflow-hidden"
    >
      Ripple Effect
    </button>
  )
}

// ── Magnetic Button ──
function MagneticButton() {
  const ref = useMagneticEffect(0.6)
  return (
    <div ref={ref}>
      <button className="px-8 py-4 rounded-full font-body font-medium text-sm tracking-wide text-black"
        style={{ background: 'var(--accent)' }}
      >
        Magnetic Pull ✦
      </button>
    </div>
  )
}

// ── Liquid Button ──
function LiquidButton() {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative px-8 py-4 rounded-full font-body font-medium text-sm tracking-wide overflow-hidden"
      style={{ border: '1.5px solid var(--accent)', color: hovered ? '#000' : 'var(--accent)' }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: 'var(--accent)', originY: '100%' }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
      <span className="relative z-10">Liquid Fill</span>
    </button>
  )
}

// ── Gradient Shift Button ──
function GradientButton() {
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }
  return (
    <button
      onMouseMove={onMove}
      className="px-8 py-4 rounded-full font-body font-medium text-sm tracking-wide text-white relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, #FF4D00, #A855F7, #00FFB2)`,
        transition: 'background 0.1s',
      }}
    >
      Gradient Shift
    </button>
  )
}

// ── Tooltip ──
function TooltipCard({ label, tip, children }) {
  const [show, setShow] = useState(false)
  const y = useSpring(show ? 0 : 6, { stiffness: 300, damping: 20 })
  const opacity = useSpring(show ? 1 : 0, { stiffness: 300, damping: 20 })

  return (
    <div
      className="tooltip-wrap"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <motion.div
        className="tooltip-content"
        style={{ y, opacity }}
      >
        {tip}
      </motion.div>
    </div>
  )
}

// ── Depth Card ──
function DepthCard({ title, description, index }) {
  const tiltRef = useTiltEffect({ maxTilt: 20, scale: 1.05, glare: true })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={tiltRef}
      className="relative glass rounded-2xl p-6 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Depth layers */}
      <motion.div
        className="absolute -inset-1 rounded-2xl -z-10"
        style={{
          background: 'var(--surface)',
          transform: hovered ? 'translateZ(-15px) scale(0.97)' : 'translateZ(0)',
          transition: 'transform 0.4s var(--ease-spring)',
        }}
      />
      <motion.div
        className="absolute -inset-2 rounded-2xl -z-20"
        style={{
          background: 'var(--surface)',
          opacity: 0.5,
          transform: hovered ? 'translateZ(-30px) scale(0.94)' : 'translateZ(0)',
          transition: 'transform 0.4s var(--ease-spring)',
        }}
      />

      <div className="relative" style={{ transform: hovered ? 'translateZ(20px)' : 'none', transition: 'transform 0.4s var(--ease-spring)' }}>
        <div className="font-mono text-xs text-[var(--accent)] mb-2">0{index + 1}</div>
        <h4 className="font-display text-xl tracking-wide text-[var(--text-primary)] mb-2">{title}</h4>
        <p className="text-sm text-[var(--text-secondary)]">{description}</p>
        <motion.div
          className="mt-4 h-px"
          style={{
            background: `linear-gradient(90deg, var(--accent), transparent)`,
            scaleX: hovered ? 1 : 0.3,
            transformOrigin: 'left',
            transition: 'transform 0.4s var(--ease-out-expo)',
          }}
        />
      </div>
    </motion.div>
  )
}

const depthCards = [
  { title: 'Tilt + Shadow', description: 'Mouse position drives rotateX/Y in real time with layered shadow depth.' },
  { title: 'Spring Physics', description: 'React spring values create natural deceleration — like a real object.' },
  { title: 'Glare Overlay', description: 'A pseudo-element gradient tracks cursor angle, simulating light.' },
]

export default function HoverLab() {
  return (
    <section id="hover-lab" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionLabel number={3} label="Hover Lab" />

        <motion.h2
          className="font-display text-[clamp(48px,8vw,100px)] leading-none tracking-wider text-[var(--text-primary)] mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          HOVER<br />
          <span className="gradient-text">STATES</span>
        </motion.h2>

        {/* Button Row */}
        <div className="mb-20">
          <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-8">
            — Button Interactions
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <RippleButton />
            <MagneticButton />
            <LiquidButton />
            <GradientButton />

            <TooltipCard tip="Spring-animated tooltip with physics easing">
              <button className="px-8 py-4 rounded-full glass border border-[var(--border)] text-[var(--text-secondary)] font-body text-sm hover:text-[var(--text-primary)] transition-colors">
                Hover for Tip
              </button>
            </TooltipCard>
          </div>
        </div>

        {/* Depth Cards */}
        <div className="mb-20">
          <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-8">
            — Card Depth
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {depthCards.map((card, i) => (
              <DepthCard key={card.title} {...card} index={i} />
            ))}
          </div>
        </div>

        {/* Interactive Hover Area */}
        <HoverTrailArea />
      </div>
    </section>
  )
}

// ── Mouse Trail Demo ──
function HoverTrailArea() {
  const containerRef = useRef(null)
  const trailsRef = useRef([])
  const [trails, setTrails] = useState([])
  const counterRef = useRef(0)

  const onMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const id = ++counterRef.current
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setTrails(prev => [...prev.slice(-20), { id, x, y }])
    setTimeout(() => {
      setTrails(prev => prev.filter(t => t.id !== id))
    }, 800)
  }

  return (
    <div>
      <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-8">
        — Mouse Trail Canvas
      </p>
      <div
        ref={containerRef}
        onMouseMove={onMove}
        className="relative glass rounded-2xl h-56 overflow-hidden flex items-center justify-center cursor-none"
      >
        <p className="font-mono text-xs text-[var(--text-muted)] pointer-events-none select-none">
          Move your mouse here
        </p>
        {trails.map((t, i) => (
          <motion.div
            key={t.id}
            className="absolute w-3 h-3 rounded-full pointer-events-none"
            style={{
              left: t.x,
              top: t.y,
              background: `hsl(${(i * 15) % 360}, 80%, 60%)`,
              x: '-50%',
              y: '-50%',
            }}
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ))}
      </div>
    </div>
  )
}
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { getLenis } from '../../hooks/useLenis'

const socials = [
  { label: 'GitHub', icon: 'GH', href: '#' },
  { label: 'Twitter', icon: 'TW', href: '#' },
  { label: 'Dribbble', icon: 'DR', href: '#' },
  { label: 'LinkedIn', icon: 'LI', href: '#' },
]

function SocialLink({ social }) {
  const [hovered, setHovered] = useState(false)
  const [trails, setTrails] = useState([])
  const counter = useRef(0)
  const ref = useRef(null)

  const onMove = (e) => {
    if (!hovered) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const id = ++counter.current
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setTrails(prev => [...prev.slice(-8), { id, x, y }])
    setTimeout(() => setTrails(prev => prev.filter(t => t.id !== id)), 600)
  }

  return (
    <a
      ref={ref}
      href={social.href}
      className="relative inline-flex items-center gap-3 px-5 py-3 rounded-full glass border border-[var(--border)] group overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTrails([]) }}
      onMouseMove={onMove}
      style={{
        transition: 'border-color 0.3s, color 0.3s',
        borderColor: hovered ? 'var(--border-accent)' : 'var(--border)',
      }}
    >
      {trails.map(t => (
        <motion.div
          key={t.id}
          className="absolute w-4 h-4 rounded-full pointer-events-none"
          style={{ left: t.x, top: t.y, x: '-50%', y: '-50%', background: 'var(--accent)' }}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
      <span className="relative font-mono text-xs text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors z-10">
        {social.icon}
      </span>
      <span className="relative text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors z-10">
        {social.label}
      </span>
    </a>
  )
}

function BackToTop() {
  const scrollToTop = () => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { duration: 2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.button
      onClick={scrollToTop}
      className="flex flex-col items-center gap-2 group"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <div
        className="w-12 h-12 rounded-full glass border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] transition-all duration-300"
      >
        <motion.svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          className="text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M8 13V3M3 8l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </div>
      <span className="font-mono text-xs text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors uppercase tracking-widest">
        Top
      </span>
    </motion.button>
  )
}

export default function Footer() {
  return (
    <footer className="py-24 px-6 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
          <div>
            <h2 className="font-display text-6xl tracking-widest text-[var(--text-primary)] mb-3">
              MOTION<span className="gradient-text">LAB</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xs">
              A living showcase of modern UI craft. Build fearlessly.
            </p>
          </div>
          <BackToTop />
        </div>

        {/* Socials */}
        <div className="flex flex-wrap gap-3 mb-16">
          {socials.map(s => <SocialLink key={s.label} social={s} />)}
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--border)] mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-[var(--text-muted)]">
            Built with React, GSAP, Framer Motion, Lenis, Three.js, Zustand
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
              <span className="font-mono text-xs text-[var(--accent)]">Live</span>
            </div>
            <p className="font-mono text-xs text-[var(--text-muted)]">
              {new Date().getFullYear()} — Motion Lab
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
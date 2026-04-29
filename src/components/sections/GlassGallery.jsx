import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTiltEffect } from '../../hooks/useTiltEffect'
import SectionLabel from '../ui/SectionLabel'

const cards = [
  {
    id: 1,
    title: 'Glassmorphism',
    tag: 'UI Layer',
    desc: 'Backdrop blur with layered transparency creates depth without weight. Light bends, glass reveals.',
    icon: '◈',
    accent: '#00FFB2',
    gradient: 'from-emerald-500/10 to-cyan-500/5',
  },
  {
    id: 2,
    title: 'Perspective Tilt',
    tag: '3D Transform',
    desc: 'CSS perspective combined with rotateX/Y creates tactile depth. Your cursor becomes a light source.',
    icon: '⬡',
    accent: '#00B4D8',
    gradient: 'from-blue-500/10 to-violet-500/5',
  },
  {
    id: 3,
    title: 'Micro Motion',
    tag: 'Interaction',
    desc: 'Sub-200ms responses that feel instant. Spring physics make interfaces feel alive and physical.',
    icon: '◎',
    accent: '#FF4D00',
    gradient: 'from-orange-500/10 to-rose-500/5',
  },
  {
    id: 4,
    title: 'Scroll Theater',
    tag: 'GSAP / Lenis',
    desc: 'ScrollTrigger timelines tied to scroll position. Every pixel of movement is choreographed.',
    icon: '▣',
    accent: '#A855F7',
    gradient: 'from-purple-500/10 to-pink-500/5',
  },
  {
    id: 5,
    title: 'Fluid Layout',
    tag: 'FLIP Technique',
    desc: 'Calculate First, Last, Invert, Play. Animate layout changes that CSS alone cannot handle.',
    icon: '◇',
    accent: '#F59E0B',
    gradient: 'from-amber-500/10 to-yellow-500/5',
  },
  {
    id: 6,
    title: 'State Machine',
    tag: 'Zustand',
    desc: 'Global UI state drives every toggle, theme shift, and effect control from a single source of truth.',
    icon: '◉',
    accent: '#10B981',
    gradient: 'from-green-500/10 to-teal-500/5',
  },
]

function GlassCard({ card, onClick }) {
  const tiltRef = useTiltEffect({ maxTilt: 18, scale: 1.04, glare: true })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={tiltRef}
      onClick={() => onClick(card)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl cursor-pointer group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Glow border on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: `0 0 0 1px ${card.accent}40, 0 20px 60px ${card.accent}15`,
        }}
      />

      {/* Glass surface */}
      <div
        className="relative glass rounded-2xl p-6 h-full flex flex-col gap-4 overflow-hidden"
        style={{
          backdropFilter: hovered ? 'blur(32px) saturate(200%)' : 'blur(20px) saturate(180%)',
          transition: 'backdrop-filter 0.4s',
        }}
      >
        {/* Top row */}
        <div className="flex items-start justify-between">
          <motion.div
            className="text-3xl"
            style={{ color: card.accent }}
            animate={hovered ? { scale: 1.2, rotate: 15 } : { scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            {card.icon}
          </motion.div>
          <span
            className="font-mono text-xs px-3 py-1 rounded-full"
            style={{
              background: card.accent + '18',
              color: card.accent,
              border: `1px solid ${card.accent}30`,
            }}
          >
            {card.tag}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-display text-2xl tracking-wide text-[var(--text-primary)] mb-2">
            {card.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {card.desc}
          </p>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="flex items-center gap-2 font-mono text-xs"
          style={{ color: card.accent }}
          animate={hovered ? { x: 4 } : { x: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          Click to expand
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>

        {/* Shimmer sweep on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)',
            backgroundSize: '200% 100%',
          }}
          animate={hovered ? { backgroundPosition: ['200% 0', '-200% 0'] } : { backgroundPosition: '200% 0' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}

function Modal({ card, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <motion.div
        className="relative glass-strong rounded-3xl p-8 max-w-lg w-full"
        initial={{ scale: 0.85, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        style={{ border: `1px solid ${card.accent}40` }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-all"
        >
          ✕
        </button>

        <div className="text-5xl mb-4" style={{ color: card.accent }}>{card.icon}</div>

        <span
          className="font-mono text-xs px-3 py-1 rounded-full mb-4 inline-block"
          style={{ background: card.accent + '18', color: card.accent, border: `1px solid ${card.accent}30` }}
        >
          {card.tag}
        </span>

        <h2 className="font-display text-4xl tracking-wide text-[var(--text-primary)] mt-3 mb-3">
          {card.title}
        </h2>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
          {card.desc}
        </p>

        {/* Fake code snippet */}
        <div className="bg-black/40 rounded-xl p-4 font-mono text-xs text-[var(--text-secondary)] border border-[var(--border)]">
          <span style={{ color: card.accent }}>const</span>{' '}
          <span className="text-blue-400">effect</span>{' = '}
          <span className="text-orange-400">'{card.tag.toLowerCase()}'</span>
          <br />
          <span style={{ color: card.accent }}>apply</span>
          {'(effect, { blur: 32, scale: 1.04 })'}
        </div>

        <motion.div
          className="mt-6 h-1 rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: 'left', background: `linear-gradient(90deg, ${card.accent}, transparent)` }}
        />
      </motion.div>
    </motion.div>
  )
}

export default function GlassGallery() {
  const [activeCard, setActiveCard] = useState(null)

  return (
    <section id="gallery" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionLabel number={2} label="Glass Gallery" />

        <motion.h2
          className="font-display text-[clamp(48px,8vw,100px)] leading-none tracking-wider text-[var(--text-primary)] mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          GLASS &amp;<br />
          <span className="gradient-text">DEPTH</span>
        </motion.h2>

        <motion.p
          className="text-[var(--text-secondary)] max-w-md mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Hover for tilt + glow. Click to expand into modal. Each card uses
          real backdrop-filter with perspective transform.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card) => (
            <GlassCard key={card.id} card={card} onClick={setActiveCard} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeCard && (
          <Modal card={activeCard} onClose={() => setActiveCard(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
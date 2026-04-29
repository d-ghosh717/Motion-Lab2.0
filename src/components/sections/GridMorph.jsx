import { useState, useRef, useLayoutEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'

const ITEMS = [
  { id: 1, title: 'Fluid Grid', tag: 'Layout', size: 'tall', color: '#00FFB2' },
  { id: 2, title: 'FLIP Animation', tag: 'Technique', size: 'wide', color: '#00B4D8' },
  { id: 3, title: 'Masonry Flow', tag: 'CSS', size: 'normal', color: '#FF4D00' },
  { id: 4, title: 'Morph Shape', tag: 'SVG', size: 'normal', color: '#A855F7' },
  { id: 5, title: 'Reflow', tag: 'GSAP', size: 'tall', color: '#F59E0B' },
  { id: 6, title: 'Grid Areas', tag: 'CSS Grid', size: 'wide', color: '#10B981' },
  { id: 7, title: 'Clip Path', tag: 'CSS', size: 'normal', color: '#EC4899' },
  { id: 8, title: 'Transform', tag: '3D', size: 'normal', color: '#06B6D4' },
  { id: 9, title: 'Origin Point', tag: 'Motion', size: 'normal', color: '#8B5CF6' },
]

const LAYOUTS = ['masonry', 'grid', 'featured', 'list']

function MasonryItem({ item, onClick, hovered, onHover }) {
  const heightMap = { tall: 280, wide: 160, normal: 200 }

  return (
    <motion.div
      layout
      layoutId={`item-${item.id}`}
      onClick={() => onClick(item)}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
      className="relative rounded-2xl glass cursor-pointer overflow-hidden group"
      style={{
        height: heightMap[item.size],
        border: hovered === item.id ? `1px solid ${item.color}50` : '1px solid var(--border)',
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 }, scale: { duration: 0.2 } }}
    >
      {/* BG color flood */}
      <motion.div
        className="absolute inset-0"
        style={{ background: item.color }}
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered === item.id ? 0.08 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Animated shape */}
      <motion.div
        className="absolute right-4 top-4 opacity-20"
        style={{ color: item.color }}
        animate={hovered === item.id
          ? { rotate: 45, scale: 1.5 }
          : { rotate: 0, scale: 1 }
        }
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40">
          <rect x="5" y="5" width="30" height="30" rx="8" fill="currentColor" />
        </svg>
      </motion.div>

      <div className="relative p-5 h-full flex flex-col justify-between">
        <div>
          <span
            className="font-mono text-xs px-2 py-1 rounded-full"
            style={{ background: item.color + '20', color: item.color }}
          >
            {item.tag}
          </span>
        </div>
        <div>
          <h4 className="font-display text-xl tracking-wide text-[var(--text-primary)]">
            {item.title}
          </h4>
          <motion.div
            className="mt-2 h-px"
            style={{ background: item.color, transformOrigin: 'left' }}
            animate={{ scaleX: hovered === item.id ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function GridMorph() {
  const [layout, setLayout] = useState('masonry')
  const [hovered, setHovered] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [items, setItems] = useState(ITEMS)

  const shuffle = () => {
    setItems(prev => [...prev].sort(() => Math.random() - 0.5))
  }

  const getGridClass = () => {
    switch (layout) {
      case 'masonry': return 'columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5'
      case 'grid': return 'grid grid-cols-2 md:grid-cols-3 gap-4'
      case 'featured': return 'grid grid-cols-2 md:grid-cols-4 gap-4'
      case 'list': return 'flex flex-col gap-3'
      default: return 'grid grid-cols-3 gap-4'
    }
  }

  return (
    <section id="grid" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionLabel number={5} label="Grid Morph" />

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.h2
            className="font-display text-[clamp(48px,8vw,100px)] leading-none tracking-wider text-[var(--text-primary)]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            GRID<br />
            <span className="gradient-text">MORPH</span>
          </motion.h2>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center glass rounded-full p-1">
              {LAYOUTS.map(l => (
                <button
                  key={l}
                  onClick={() => setLayout(l)}
                  className="relative px-4 py-2 rounded-full font-mono text-xs capitalize transition-colors"
                  style={{
                    color: layout === l ? '#000' : 'var(--text-secondary)',
                  }}
                >
                  {layout === l && (
                    <motion.div
                      layoutId="layout-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'var(--accent)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{l}</span>
                </button>
              ))}
            </div>

            <button
              onClick={shuffle}
              className="px-4 py-2 glass rounded-full font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] border border-[var(--border)] transition-all"
            >
              ⟳ Shuffle
            </button>
          </div>
        </div>

        {/* Grid */}
        <motion.div
          layout
          className={layout === 'masonry' ? '' : getGridClass()}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {layout === 'masonry' ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-5">
              {items.map(item => (
                <div key={item.id} className="break-inside-avoid mb-5">
                  <MasonryItem
                    item={item}
                    onClick={setExpanded}
                    hovered={hovered}
                    onHover={setHovered}
                  />
                </div>
              ))}
            </div>
          ) : (
            items.map(item => (
              <MasonryItem
                key={item.id}
                item={item}
                onClick={setExpanded}
                hovered={hovered}
                onHover={setHovered}
              />
            ))
          )}
        </motion.div>
      </div>

      {/* Expanded modal */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpanded(null)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" />
            <motion.div
              layoutId={`item-${expanded.id}`}
              className="relative glass-strong rounded-3xl p-10 max-w-md w-full"
              onClick={e => e.stopPropagation()}
              style={{ border: `1px solid ${expanded.color}40` }}
            >
              <button
                onClick={() => setExpanded(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-[var(--text-muted)]"
              >✕</button>
              <span className="font-mono text-xs px-3 py-1 rounded-full" style={{ background: expanded.color + '20', color: expanded.color }}>
                {expanded.tag}
              </span>
              <h3 className="font-display text-5xl tracking-wide text-[var(--text-primary)] mt-4 mb-4">
                {expanded.title}
              </h3>
              <p className="text-[var(--text-secondary)]">
                This card used Framer Motion's layoutId to animate seamlessly between list and expanded states — the FLIP technique in action.
              </p>
              <motion.div
                className="mt-6 h-1 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                layoutId={undefined}
                style={{ transformOrigin: 'left', background: `linear-gradient(90deg, ${expanded.color}, transparent)` }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
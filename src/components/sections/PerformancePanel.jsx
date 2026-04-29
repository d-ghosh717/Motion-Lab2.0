import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import SectionLabel from '../ui/SectionLabel'

function useFPS() {
  const [fps, setFps] = useState(60)
  const frames = useRef([])
  const rafRef = useRef(null)

  useEffect(() => {
    let last = performance.now()
    const measure = (now) => {
      frames.current.push(now - last)
      last = now
      if (frames.current.length > 30) frames.current.shift()
      const avg = frames.current.reduce((a, b) => a + b, 0) / frames.current.length
      setFps(Math.round(1000 / avg))
      rafRef.current = requestAnimationFrame(measure)
    }
    rafRef.current = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return fps
}

function FPSGauge({ fps }) {
  const color = fps >= 55 ? '#00FFB2' : fps >= 30 ? '#F59E0B' : '#FF4D00'
  const pct = Math.min(fps / 60, 1)
  const angle = -140 + pct * 280 // -140deg to +140deg arc

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-40 h-24 overflow-hidden">
        {/* Gauge background */}
        <svg className="absolute inset-0" viewBox="0 0 160 96" fill="none">
          <path d="M16 88 A72 72 0 0 1 144 88" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round" />
          <motion.path
            d="M16 88 A72 72 0 0 1 144 88"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="226"
            animate={{ strokeDashoffset: 226 * (1 - pct) }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </svg>

        {/* Needle */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-0.5 h-16 origin-bottom rounded-full"
          style={{ background: color, marginLeft: '-1px' }}
          animate={{ rotate: -140 + pct * 280 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
        <div className="absolute bottom-0 left-1/2 w-3 h-3 -translate-x-1/2 translate-y-1/2 rounded-full" style={{ background: color }} />
      </div>

      <div className="text-center">
        <motion.p
          className="font-display text-5xl tracking-wide"
          style={{ color }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.2 }}
          key={fps}
        >
          {fps}
        </motion.p>
        <p className="font-mono text-xs text-[var(--text-muted)]">FPS</p>
      </div>
    </div>
  )
}

const EFFECT_LABELS = {
  particles: { label: 'Hero Particles', desc: 'Canvas-based particle system', icon: '✦' },
  blur: { label: 'Backdrop Blur', desc: 'Glassmorphism effects', icon: '◈' },
  animations: { label: 'Animations', desc: 'All CSS + JS animations', icon: '▷' },
  cursor: { label: 'Custom Cursor', desc: 'Dot + ring cursor', icon: '◎' },
  parallax: { label: 'Parallax', desc: 'Mouse-tracked depth', icon: '⬡' },
}

function EffectToggle({ effectKey, value, onToggle }) {
  const meta = EFFECT_LABELS[effectKey]
  return (
    <motion.div
      className="glass rounded-xl px-5 py-4 flex items-center justify-between"
      animate={{ opacity: value ? 1 : 0.6 }}
    >
      <div className="flex items-center gap-4">
        <span className="text-xl" style={{ color: value ? 'var(--accent)' : 'var(--text-muted)' }}>
          {meta.icon}
        </span>
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">{meta.label}</p>
          <p className="text-xs text-[var(--text-muted)]">{meta.desc}</p>
        </div>
      </div>

      <button
        onClick={() => onToggle(effectKey)}
        className="relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0"
        style={{ background: value ? 'var(--accent)' : 'var(--border)' }}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
          animate={{ x: value ? 24 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </motion.div>
  )
}

function MemoryMeter() {
  const [mem, setMem] = useState(null)

  useEffect(() => {
    const update = () => {
      if (performance.memory) {
        setMem({
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
        })
      }
    }
    update()
    const id = setInterval(update, 2000)
    return () => clearInterval(id)
  }, [])

  if (!mem) return (
    <div className="glass rounded-xl px-5 py-4">
      <p className="font-mono text-xs text-[var(--text-muted)]">Memory: unavailable in this browser</p>
    </div>
  )

  const pct = (mem.used / mem.total) * 100

  return (
    <div className="glass rounded-xl px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-[var(--text-secondary)]">JS Heap Memory</p>
        <span className="font-mono text-xs text-[var(--accent)]">{mem.used}MB / {mem.total}MB</span>
      </div>
      <div className="h-1.5 bg-[var(--border)] rounded-full">
        <motion.div
          className="h-full rounded-full"
          style={{ background: pct > 75 ? '#FF4D00' : 'linear-gradient(90deg, var(--accent), #00B4D8)' }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export default function PerformancePanel() {
  const fps = useFPS()
  const { effects, toggleEffect, reduceMotion, setReduceMotion } = useStore()

  return (
    <section id="perf" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionLabel number={9} label="Performance Panel" />

        <motion.h2
          className="font-display text-[clamp(48px,8vw,100px)] leading-none tracking-wider text-[var(--text-primary)] mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          PERF<br />
          <span className="gradient-text">PANEL</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FPS Gauge */}
          <div>
            <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-6">
              — Live FPS
            </p>
            <div className="glass rounded-2xl p-8 flex flex-col items-center gap-4">
              <FPSGauge fps={fps} />

              {/* Mini sparkline */}
              <div className="w-full h-12 flex items-end gap-0.5">
                {Array.from({ length: 32 }, (_, i) => {
                  const h = 20 + Math.random() * 80
                  const color = fps > 55 ? 'var(--accent)' : fps > 30 ? '#F59E0B' : '#FF4D00'
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm opacity-40"
                      style={{ height: `${h}%`, background: color }}
                    />
                  )
                })}
              </div>

              <div className="grid grid-cols-3 gap-3 w-full text-center">
                {[
                  { label: 'Target', val: '60fps' },
                  { label: 'Current', val: `${fps}fps` },
                  { label: 'Status', val: fps > 55 ? 'Good' : fps > 30 ? 'Fair' : 'Poor' },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-[var(--surface)] rounded-lg p-2">
                    <p className="font-mono text-xs text-[var(--text-muted)]">{label}</p>
                    <p className="font-mono text-sm text-[var(--text-primary)] mt-1">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Effect Toggles */}
          <div className="lg:col-span-2">
            <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-6">
              — Effect Controls
            </p>
            <div className="space-y-3">
              {Object.keys(effects).map(key => (
                <EffectToggle key={key} effectKey={key} value={effects[key]} onToggle={toggleEffect} />
              ))}

              {/* Reduce motion */}
              <div className="glass rounded-xl px-5 py-4 flex items-center justify-between border border-[var(--border-accent)]">
                <div className="flex items-center gap-4">
                  <span className="text-xl text-[var(--accent)]">⚡</span>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Reduce Motion</p>
                    <p className="text-xs text-[var(--text-muted)]">Cuts all transitions to 1ms globally</p>
                  </div>
                </div>
                <button
                  onClick={() => setReduceMotion(!reduceMotion)}
                  className="relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0"
                  style={{ background: reduceMotion ? '#FF4D00' : 'var(--border)' }}
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                    animate={{ x: reduceMotion ? 24 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <MemoryMeter />
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Tech Stack', val: 'React + Vite' },
            { label: 'Animation', val: 'GSAP + Framer' },
            { label: 'Scroll', val: 'Lenis + ST' },
            { label: 'State', val: 'Zustand' },
          ].map(({ label, val }) => (
            <div key={label} className="glass rounded-xl p-4 text-center">
              <p className="font-mono text-xs text-[var(--text-muted)] mb-1">{label}</p>
              <p className="font-mono text-sm text-[var(--accent)]">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
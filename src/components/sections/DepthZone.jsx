import { useRef, useState, useEffect } from 'react'
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion'
import { useMouseParallax } from '../../hooks/useMouseParallax'
import SectionLabel from '../ui/SectionLabel'

// ── 3D Scene Card ──
function Scene3DCard() {
  const cardRef = useRef(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springConfig = { stiffness: 200, damping: 30 }
  const rx = useSpring(rotateX, springConfig)
  const ry = useSpring(rotateY, springConfig)

  const glareX = useTransform(ry, [-25, 25], ['0%', '100%'])
  const glareY = useTransform(rx, [-25, 25], ['0%', '100%'])

  const onMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    rotateY.set(x * 30)
    rotateX.set(-y * 30)
  }

  const onLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  const layers = [
    { z: 0, label: 'Base Layer', opacity: 1 },
    { z: 20, label: 'Mid Layer', opacity: 0.8 },
    { z: 40, label: 'Top Layer', opacity: 0.6 },
  ]

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative w-full max-w-sm mx-auto"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        className="relative rounded-3xl overflow-hidden"
        style={{
          rotateX: rx,
          rotateY: ry,
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(135deg, rgba(0,255,178,0.05), rgba(0,180,216,0.05))',
          border: '1px solid var(--border-accent)',
          minHeight: '320px',
        }}
      >
        {/* Glare overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.15), transparent 60%)`,
          }}
        />

        {/* 3D depth layers */}
        <div className="p-8" style={{ transformStyle: 'preserve-3d' }}>
          <div className="font-mono text-xs text-[var(--accent)] mb-6 tracking-widest">
            CSS 3D DEPTH
          </div>

          {layers.map((layer, i) => (
            <motion.div
              key={i}
              className="mb-4 p-4 rounded-xl"
              style={{
                background: `rgba(0,255,178,${0.04 * (i + 1)})`,
                border: `1px solid rgba(0,255,178,${0.1 * (i + 1)})`,
                transform: `translateZ(${layer.z}px)`,
                opacity: layer.opacity,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]" style={{ opacity: layer.opacity }} />
                <span className="font-mono text-sm text-[var(--text-secondary)]">
                  {layer.label} — translateZ({layer.z}px)
                </span>
              </div>
            </motion.div>
          ))}

          <motion.div
            className="mt-6 font-display text-4xl tracking-wide text-[var(--text-primary)]"
            style={{ transform: 'translateZ(60px)' }}
          >
            DEPTH
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Stacked Cards ──
function StackedCards() {
  const [stack, setStack] = useState([0, 1, 2, 3])

  const colors = ['#00FFB2', '#00B4D8', '#FF4D00', '#A855F7']
  const labels = ['Hover States', 'Animations', 'Glass UI', 'Motion Lang']

  const cycleTop = () => {
    setStack(prev => [...prev.slice(1), prev[0]])
  }

  return (
    <div className="relative h-64 w-full max-w-sm mx-auto">
      {stack.map((idx, pos) => (
        <motion.div
          key={idx}
          layout
          onClick={pos === stack.length - 1 ? cycleTop : undefined}
          className="absolute inset-0 rounded-2xl glass cursor-pointer flex items-end p-6"
          style={{
            border: `1px solid ${colors[idx]}30`,
            background: `linear-gradient(135deg, ${colors[idx]}08, transparent)`,
            zIndex: pos,
          }}
          animate={{
            y: (stack.length - 1 - pos) * -12,
            scale: 1 - (stack.length - 1 - pos) * 0.04,
            rotateZ: (stack.length - 1 - pos) * -1.5,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          whileHover={pos === stack.length - 1 ? { y: -8 } : {}}
        >
          {pos === stack.length - 1 && (
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="font-mono text-xs mb-1" style={{ color: colors[idx] }}>
                  Card {idx + 1} / 4
                </div>
                <div className="font-display text-xl tracking-wide text-[var(--text-primary)]">
                  {labels[idx]}
                </div>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: colors[idx] + '20', border: `1px solid ${colors[idx]}40` }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8l5 5 5-5" stroke={colors[idx]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}
        </motion.div>
      ))}
      <p className="absolute -bottom-8 left-0 right-0 text-center font-mono text-xs text-[var(--text-muted)]">
        Click top card to cycle
      </p>
    </div>
  )
}

// ── Parallax Float Objects ──
function ParallaxObjects() {
  const offset = useMouseParallax(0.03)

  const objects = [
    { x: '10%', y: '20%', size: 80, color: '#00FFB2', speed: 1 },
    { x: '75%', y: '15%', size: 50, color: '#00B4D8', speed: -1.5 },
    { x: '85%', y: '65%', size: 100, color: '#FF4D00', speed: 0.8 },
    { x: '20%', y: '70%', size: 60, color: '#A855F7', speed: -1 },
    { x: '50%', y: '45%', size: 40, color: '#F59E0B', speed: 2 },
  ]

  return (
    <div className="relative h-64 rounded-2xl glass overflow-hidden">
      <p className="absolute top-4 left-4 font-mono text-xs text-[var(--text-muted)]">
        Mouse-tracked parallax
      </p>
      {objects.map((obj, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-30 blur-sm"
          style={{
            left: obj.x, top: obj.y,
            width: obj.size, height: obj.size,
            background: `radial-gradient(circle, ${obj.color}, transparent)`,
            x: offset.x * obj.speed,
            y: offset.y * obj.speed,
            transition: 'x 0.1s, y 0.1s',
          }}
        />
      ))}
      <div
        className="absolute inset-0 flex items-center justify-center font-display text-6xl tracking-widest text-[var(--text-primary)] opacity-10"
        style={{
          transform: `translate(${offset.x * 0.5}px, ${offset.y * 0.5}px)`,
          transition: 'transform 0.1s',
        }}
      >
        PARALLAX
      </div>
    </div>
  )
}

export default function DepthZone() {
  return (
    <section id="depth" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionLabel number={6} label="3D Depth Zone" />

        <motion.h2
          className="font-display text-[clamp(48px,8vw,100px)] leading-none tracking-wider text-[var(--text-primary)] mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          DEPTH<br />
          <span className="gradient-text">ZONE</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-8">
              — Interactive 3D Card
            </p>
            <Scene3DCard />
          </div>
          <div>
            <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-8">
              — Card Stack Depth
            </p>
            <div className="pt-8">
              <StackedCards />
            </div>
          </div>
        </div>

        <div>
          <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-8">
            — Mouse Parallax Field
          </p>
          <ParallaxObjects />
        </div>
      </div>
    </section>
  )
}
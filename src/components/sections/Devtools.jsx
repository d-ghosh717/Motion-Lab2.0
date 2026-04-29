import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'

// ─── Effect snippets catalogue ───────────────────────────────────────────────
const EFFECTS = {
    glass: {
        label: 'Glassmorphism',
        icon: '◈',
        accent: '#00FFB2',
        category: 'CSS',
        description: 'Backdrop blur + layered transparency. Creates depth without weight.',
        tags: ['blur', 'glass', 'ui'],
        variants: [
            {
                name: 'Standard Glass',
                lang: 'css',
                code: `.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}`,
            },
            {
                name: 'Strong Glass',
                lang: 'css',
                code: `.glass-strong {
  background: rgba(255, 255, 255, 0.09);
  backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.1);
}`,
            },
            {
                name: 'React Component',
                lang: 'jsx',
                code: `function GlassCard({ children }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
    }}>
      {children}
    </div>
  )
}`,
            },
        ],
    },

    magnetic: {
        label: 'Magnetic Hover',
        icon: '✦',
        accent: '#00B4D8',
        category: 'JS Hook',
        description: 'Cursor attracts elements with spring-like force. Distance-based falloff.',
        tags: ['hover', 'cursor', 'interaction'],
        variants: [
            {
                name: 'React Hook',
                lang: 'jsx',
                code: `import { useRef, useEffect } from 'react'

export function useMagneticEffect(strength = 0.4) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxDist = Math.max(rect.width, rect.height) * 1.5

      if (dist < maxDist) {
        const force = (1 - dist / maxDist) * strength
        el.style.transform = \`translate(\${dx * force}px, \${dy * force}px)\`
      }
    }

    const onLeave = () => {
      el.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)'
      el.style.transform = 'translate(0,0)'
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])

  return ref
}

// Usage:
// const ref = useMagneticEffect(0.5)
// <div ref={ref}><button>Hover me</button></div>`,
            },
            {
                name: 'Vanilla JS',
                lang: 'js',
                code: `function makeMagnetic(el, strength = 0.4) {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    const dist = Math.hypot(dx, dy)
    const max = Math.max(rect.width, rect.height) * 1.5
    if (dist < max) {
      const f = (1 - dist / max) * strength
      el.style.transform = \`translate(\${dx*f}px,\${dy*f}px)\`
      el.style.transition = 'transform 0.1s linear'
    }
  })
  el.addEventListener('mouseleave', () => {
    el.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)'
    el.style.transform = 'translate(0,0)'
  })
}

makeMagnetic(document.querySelector('.btn'))`,
            },
        ],
    },

    tilt: {
        label: 'Perspective Tilt',
        icon: '⬡',
        accent: '#FF4D00',
        category: 'JS Hook',
        description: 'CSS perspective + rotateX/Y. Mouse becomes a light source. Glare overlay included.',
        tags: ['3d', 'hover', 'card'],
        variants: [
            {
                name: 'React Hook',
                lang: 'jsx',
                code: `import { useRef, useEffect } from 'react'

export function useTiltEffect({
  maxTilt = 15,
  perspective = 1000,
  scale = 1.03,
  speed = 400,
  glare = true,
} = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let glareEl = null

    if (glare) {
      glareEl = document.createElement('div')
      Object.assign(glareEl.style, {
        position: 'absolute', inset: 0,
        borderRadius: 'inherit',
        background: 'linear-gradient(135deg,rgba(255,255,255,.15) 0%,transparent 60%)',
        opacity: 0, pointerEvents: 'none', transition: 'opacity .3s',
      })
      el.style.position = 'relative'
      el.style.overflow = 'hidden'
      el.appendChild(glareEl)
    }

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.transition = \`transform \${speed * .25}ms linear\`
      el.style.transform = \`perspective(\${perspective}px) rotateX(\${-y*maxTilt*2}deg) rotateY(\${x*maxTilt*2}deg) scale3d(\${scale},\${scale},\${scale})\`
      if (glareEl) {
        glareEl.style.opacity = 1
        glareEl.style.background = \`linear-gradient(\${Math.atan2(y,x)*(180/Math.PI)}deg,rgba(255,255,255,.18) 0%,transparent 70%)\`
      }
    }
    const onLeave = () => {
      el.style.transition = \`transform \${speed}ms cubic-bezier(.34,1.56,.64,1)\`
      el.style.transform = \`perspective(\${perspective}px) rotateX(0) rotateY(0) scale3d(1,1,1)\`
      if (glareEl) glareEl.style.opacity = 0
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      if (glareEl?.parentNode === el) el.removeChild(glareEl)
    }
  }, [])

  return ref
}

// Usage:
// const ref = useTiltEffect({ maxTilt: 18, glare: true })
// <div ref={ref}>...</div>`,
            },
        ],
    },

    ripple: {
        label: 'Ripple Effect',
        icon: '◎',
        accent: '#A855F7',
        category: 'JS Util',
        description: 'Click-origin ripple wave that radiates outward. Pure CSS animation, JS trigger.',
        tags: ['click', 'button', 'interaction'],
        variants: [
            {
                name: 'CSS + JS',
                lang: 'js',
                code: `/* CSS */
.ripple-btn {
  position: relative;
  overflow: hidden;
}
.ripple-wave {
  position: absolute;
  border-radius: 50%;
  background: rgba(0, 255, 178, 0.3);
  transform: scale(0);
  animation: rippleAnim 0.6s linear forwards;
  pointer-events: none;
}
@keyframes rippleAnim {
  to { transform: scale(4); opacity: 0; }
}

/* JS */
function createRipple(e, element) {
  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2

  const ripple = document.createElement('span')
  ripple.className = 'ripple-wave'
  Object.assign(ripple.style, {
    width: size + 'px', height: size + 'px',
    left: x + 'px', top: y + 'px',
  })
  element.appendChild(ripple)
  setTimeout(() => ripple.remove(), 700)
}

// Usage:
// btn.addEventListener('click', e => createRipple(e, btn))`,
            },
            {
                name: 'React Component',
                lang: 'jsx',
                code: `import { useRef } from 'react'

function RippleButton({ children, onClick }) {
  const ref = useRef(null)

  const handleClick = (e) => {
    const el = ref.current
    const rect = el.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const wave = document.createElement('span')
    Object.assign(wave.style, {
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(0,255,178,0.3)',
      width: size + 'px', height: size + 'px',
      left: (e.clientX - rect.left - size/2) + 'px',
      top: (e.clientY - rect.top - size/2) + 'px',
      transform: 'scale(0)',
      animation: 'rippleAnim 0.6s linear forwards',
      pointerEvents: 'none',
    })
    el.appendChild(wave)
    setTimeout(() => wave.remove(), 700)
    onClick?.(e)
  }

  return (
    <button
      ref={ref}
      onClick={handleClick}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {children}
    </button>
  )
}`,
            },
        ],
    },

    scrolltrigger: {
        label: 'GSAP ScrollTrigger',
        icon: '▷',
        accent: '#10B981',
        category: 'GSAP',
        description: 'Scroll-bound timeline. Scrub controls playhead. Pin, parallax, stagger — all composable.',
        tags: ['scroll', 'gsap', 'animation'],
        variants: [
            {
                name: 'Basic ScrollTrigger',
                lang: 'js',
                code: `import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Reveal on scroll
gsap.from('.hero-title', {
  y: 80,
  opacity: 0,
  duration: 1,
  ease: 'power4.out',
  scrollTrigger: {
    trigger: '.hero-title',
    start: 'top 80%',      // when element top hits 80% of viewport
    end: 'top 30%',
    toggleActions: 'play none none reverse',
  },
})

// Scrubbed parallax
gsap.to('.bg-layer', {
  y: -200,
  ease: 'none',
  scrollTrigger: {
    trigger: '.section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1.5,           // lag in seconds
  },
})`,
            },
            {
                name: 'Pinned Horizontal',
                lang: 'js',
                code: `// Horizontal scroll with pin
const track = document.querySelector('.track')
const totalWidth = track.scrollWidth - window.innerWidth

gsap.to(track, {
  x: -totalWidth,
  ease: 'none',
  scrollTrigger: {
    trigger: '.wrapper',
    pin: true,
    scrub: 1.2,
    start: 'top top',
    end: \`+=\${totalWidth}\`,
    anticipatePin: 1,
    onUpdate: (self) => {
      // self.progress = 0..1
      console.log(self.progress)
    },
  },
})`,
            },
            {
                name: 'Timeline Stagger',
                lang: 'js',
                code: `const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.section',
    start: 'top 60%',
    toggleActions: 'play none none reverse',
  },
})

tl.from('.label',    { x: -30, opacity: 0, duration: 0.5, ease: 'power3.out' })
  .from('.headline', { y: 60,  opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
  .from('.body',     { y: 30,  opacity: 0, duration: 0.6 }, '-=0.4')
  .from('.bar',      { scaleX: 0, duration: 0.8, ease: 'expo.out', transformOrigin: 'left' }, '-=0.3')`,
            },
        ],
    },

    lenis: {
        label: 'Lenis Smooth Scroll',
        icon: '∿',
        accent: '#F59E0B',
        category: 'Library',
        description: 'Replaces native scroll with physics-based easing. Works transparently with GSAP ScrollTrigger.',
        tags: ['scroll', 'smooth', 'ux'],
        variants: [
            {
                name: 'Setup + GSAP Bridge',
                lang: 'js',
                code: `import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
})

// Bridge to ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

// Scroll to element
lenis.scrollTo('#hero', {
  duration: 1.6,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
})`,
            },
            {
                name: 'React Hook',
                lang: 'jsx',
                code: `import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    return () => lenis.destroy()
  }, [])
}

// In App.jsx:
// useLenis()`,
            },
        ],
    },

    cursor: {
        label: 'Custom Cursor',
        icon: '◉',
        accent: '#EC4899',
        category: 'Component',
        description: 'Dot + ring cursor. Ring lags behind with lerp. Scales on hoverable elements.',
        tags: ['cursor', 'ui', 'interaction'],
        variants: [
            {
                name: 'CSS',
                lang: 'css',
                code: `body { cursor: none; }

#cursor-dot {
  position: fixed; top: 0; left: 0;
  width: 6px; height: 6px;
  background: #00FFB2;
  border-radius: 50%;
  pointer-events: none;
  z-index: 99999;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px #00FFB2;
  transition: width .2s, height .2s;
}

#cursor-ring {
  position: fixed; top: 0; left: 0;
  width: 36px; height: 36px;
  border: 1.5px solid rgba(0,255,178,.5);
  border-radius: 50%;
  pointer-events: none;
  z-index: 99998;
  transform: translate(-50%, -50%);
  transition:
    width .4s cubic-bezier(.34,1.56,.64,1),
    height .4s cubic-bezier(.34,1.56,.64,1);
}

#cursor-dot.hovering { width: 10px; height: 10px; }
#cursor-ring.hovering { width: 60px; height: 60px; }`,
            },
            {
                name: 'JS (lerp ring)',
                lang: 'js',
                code: `const dot  = document.getElementById('cursor-dot')
const ring = document.getElementById('cursor-ring')
const pos  = { x: 0, y: 0 }
const ring_pos = { x: 0, y: 0 }

document.addEventListener('mousemove', (e) => {
  pos.x = e.clientX
  pos.y = e.clientY
  dot.style.left = pos.x + 'px'
  dot.style.top  = pos.y + 'px'
})

;(function lerp() {
  ring_pos.x += (pos.x - ring_pos.x) * 0.12
  ring_pos.y += (pos.y - ring_pos.y) * 0.12
  ring.style.left = ring_pos.x + 'px'
  ring.style.top  = ring_pos.y + 'px'
  requestAnimationFrame(lerp)
})()

document.querySelectorAll('a,button,[data-hover]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    dot.classList.add('hovering')
    ring.classList.add('hovering')
  })
  el.addEventListener('mouseleave', () => {
    dot.classList.remove('hovering')
    ring.classList.remove('hovering')
  })
})`,
            },
        ],
    },

    framer: {
        label: 'Framer Motion',
        icon: '◇',
        accent: '#00FFB2',
        category: 'React',
        description: 'Declarative spring animations for React. Layout animations, shared layout, exit animations.',
        tags: ['react', 'animation', 'spring'],
        variants: [
            {
                name: 'Stagger Reveal',
                lang: 'jsx',
                code: `import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
}

const item = {
  hidden: { y: 60, opacity: 0, filter: 'blur(10px)' },
  show: {
    y: 0, opacity: 1, filter: 'blur(0px)',
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
}

export function StaggerList({ items }) {
  return (
    <motion.ul variants={container} initial="hidden" animate="show">
      {items.map((item, i) => (
        <motion.li key={i} variants={item}>
          {item}
        </motion.li>
      ))}
    </motion.ul>
  )
}`,
            },
            {
                name: 'Layout Animation (FLIP)',
                lang: 'jsx',
                code: `import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

// Framer auto-calculates First/Last/Invert/Play
// Just add layoutId — the rest is automatic

function FlipDemo({ items }) {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <div className="grid">
        {items.map(item => (
          <motion.div
            key={item.id}
            layoutId={\`card-\${item.id}\`}
            onClick={() => setSelected(item)}
            className="card"
          >
            {item.title}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div layoutId={\`card-\${selected.id}\`} className="modal">
            {selected.title}
            <button onClick={() => setSelected(null)}>Close</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}`,
            },
            {
                name: 'Spring Gesture',
                lang: 'jsx',
                code: `import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

function SpringCard() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 200, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 200, damping: 30 })

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      Card content
    </motion.div>
  )
}`,
            },
        ],
    },

    confetti: {
        label: 'Confetti Burst',
        icon: '✧',
        accent: '#F59E0B',
        category: 'Utility',
        description: 'canvas-confetti triggered on success. Origin-aware so it bursts from the button.',
        tags: ['success', 'celebration', 'ux'],
        variants: [
            {
                name: 'Button Burst',
                lang: 'jsx',
                code: `import confetti from 'canvas-confetti'

function SuccessButton({ onSuccess }) {
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()

    confetti({
      particleCount: 120,
      spread: 80,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: rect.top / window.innerHeight,
      },
      colors: ['#00FFB2', '#00B4D8', '#ffffff', '#FF4D00'],
      ticks: 200,
    })

    onSuccess?.()
  }

  return <button onClick={handleClick}>Submit ✦</button>
}

// install: npm i canvas-confetti`,
            },
        ],
    },
}

const CATEGORIES = ['All', 'CSS', 'JS Hook', 'JS Util', 'GSAP', 'Library', 'React', 'Component', 'Utility']

// ── Syntax highlight (simple tokenizer) ──────────────────────────────────────
function highlight(code, lang) {
    const keywords = ['import', 'export', 'from', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'new', 'class', 'extends', 'default', 'async', 'await', 'of', 'in']
    const reactKeywords = ['useState', 'useEffect', 'useRef', 'useMemo', 'useCallback', 'useMotionValue', 'useSpring', 'useTransform']

    return code
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        // strings
        .replace(/(["'`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span style="color:#98c379">$1$2$3</span>')
        // comments
        .replace(/(\/\/[^\n]*)/g, '<span style="color:#5c6370;font-style:italic">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color:#5c6370;font-style:italic">$1</span>')
        // numbers
        .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#d19a66">$1</span>')
        // keywords
        .replace(new RegExp(`\\b(${keywords.join('|')})\\b`, 'g'), '<span style="color:#c678dd">$1</span>')
        .replace(new RegExp(`\\b(${reactKeywords.join('|')})\\b`, 'g'), '<span style="color:#61afef">$1</span>')
        // css properties
        .replace(/([a-zA-Z-]+)(?=\s*:(?!:))/g, (m) => `<span style="color:#e06c75">${m}</span>`)
        // jsx tags
        .replace(/(&lt;\/?)([\w.]+)/g, (_, bracket, name) =>
            `${bracket}<span style="color:#e06c75">${name}</span>`)
        // functions
        .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g, '<span style="color:#61afef">$1</span>')
}

// ── Copy button ──────────────────────────────────────────────────────────────
function CopyButton({ code }) {
    const [copied, setCopied] = useState(false)

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            const el = document.createElement('textarea')
            el.value = code
            document.body.appendChild(el)
            el.select()
            document.execCommand('copy')
            document.body.removeChild(el)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <button
            onClick={copy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs transition-all duration-200"
            style={{
                background: copied ? 'rgba(0,255,178,0.15)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${copied ? 'rgba(0,255,178,0.4)' : 'rgba(255,255,255,0.1)'}`,
                color: copied ? '#00FFB2' : 'rgba(200,210,230,0.6)',
            }}
        >
            <AnimatePresence mode="wait">
                {copied ? (
                    <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>✓</motion.span>
                ) : (
                    <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>⧉</motion.span>
                )}
            </AnimatePresence>
            {copied ? 'Copied!' : 'Copy'}
        </button>
    )
}

// ── Code block ───────────────────────────────────────────────────────────────
function CodeBlock({ variant }) {
    return (
        <div className="rounded-xl overflow-hidden" style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: '#FEBC2E' }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: '#28C840' }} />
                    </div>
                    <span className="font-mono text-xs" style={{ color: 'rgba(200,210,230,0.35)' }}>
                        {variant.name}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(200,210,230,0.4)' }}>
                        {variant.lang}
                    </span>
                    <CopyButton code={variant.code} />
                </div>
            </div>

            {/* Code */}
            <div className="overflow-x-auto">
                <pre className="p-5 text-xs leading-6 font-mono" style={{ color: '#abb2bf', margin: 0, minWidth: '100%', whiteSpace: 'pre' }}>
                    <code dangerouslySetInnerHTML={{ __html: highlight(variant.code, variant.lang) }} />
                </pre>
            </div>
        </div>
    )
}

// ── Effect Card (left panel) ─────────────────────────────────────────────────
function EffectCard({ effect, data, isActive, onClick }) {
    return (
        <motion.button
            onClick={() => onClick(effect)}
            className="w-full text-left rounded-xl px-4 py-4 transition-all duration-200 group"
            style={{
                background: isActive ? `${data.accent}12` : 'transparent',
                border: `1px solid ${isActive ? data.accent + '40' : 'transparent'}`,
            }}
            whileHover={{ x: 3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
            <div className="flex items-center gap-3">
                <span className="text-lg flex-shrink-0" style={{ color: isActive ? data.accent : 'var(--text-muted)' }}>
                    {data.icon}
                </span>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{data.label}</p>
                    <p className="font-mono text-xs" style={{ color: data.accent, opacity: 0.7 }}>{data.category}</p>
                </div>
                {isActive && (
                    <motion.div
                        className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: data.accent }}
                        layoutId="active-dot"
                    />
                )}
            </div>
        </motion.button>
    )
}

// ── Main DevTools section ─────────────────────────────────────────────────────
export default function DevTools() {
    const [activeEffect, setActiveEffect] = useState('glass')
    const [activeVariant, setActiveVariant] = useState(0)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')

    const data = EFFECTS[activeEffect]

    useEffect(() => {
        setActiveVariant(0)
    }, [activeEffect])

    const filteredEffects = Object.entries(EFFECTS).filter(([, d]) => {
        const matchCat = activeCategory === 'All' || d.category === activeCategory
        const matchSearch = !searchQuery ||
            d.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.tags.some(t => t.includes(searchQuery.toLowerCase()))
        return matchCat && matchSearch
    })

    return (
        <section id="dev-tools" className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <SectionLabel number={10} label="Dev Tools" />

                <motion.div
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div>
                        <h2 className="font-display text-[clamp(48px,8vw,100px)] leading-none tracking-wider text-[var(--text-primary)]">
                            DEV<br /><span className="gradient-text">TOOLS</span>
                        </h2>
                        <p className="text-[var(--text-secondary)] mt-3 max-w-md">
                            Pick any effect, grab the code. Copy-ready snippets for every technique in this playground.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 flex-shrink-0">
                        {[
                            { label: 'Effects', val: Object.keys(EFFECTS).length },
                            { label: 'Snippets', val: Object.values(EFFECTS).reduce((a, e) => a + e.variants.length, 0) },
                            { label: 'Categories', val: new Set(Object.values(EFFECTS).map(e => e.category)).size },
                        ].map(({ label, val }) => (
                            <div key={label} className="glass rounded-xl px-4 py-3 text-center">
                                <p className="font-display text-3xl text-[var(--accent)]">{val}</p>
                                <p className="font-mono text-xs text-[var(--text-muted)] mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6">

                    {/* ── Left sidebar ── */}
                    <motion.div
                        className="flex flex-col gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search effects…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl font-mono text-sm outline-none"
                                style={{
                                    background: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-primary)',
                                    paddingLeft: '2.5rem',
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = 'var(--border-accent)'}
                                onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">⌕</span>
                        </div>

                        {/* Category pills */}
                        <div className="flex flex-wrap gap-1.5">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className="px-2.5 py-1 rounded-full font-mono text-xs transition-all duration-200"
                                    style={{
                                        background: activeCategory === cat ? 'var(--accent)' : 'var(--surface)',
                                        color: activeCategory === cat ? '#000' : 'var(--text-muted)',
                                        border: `1px solid ${activeCategory === cat ? 'var(--accent)' : 'var(--border)'}`,
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Effect list */}
                        <div className="glass rounded-2xl p-3 flex flex-col gap-1">
                            {filteredEffects.length === 0 ? (
                                <p className="text-center font-mono text-xs text-[var(--text-muted)] py-8">No effects match</p>
                            ) : (
                                filteredEffects.map(([key, d]) => (
                                    <EffectCard
                                        key={key}
                                        effect={key}
                                        data={d}
                                        isActive={activeEffect === key}
                                        onClick={(k) => { setActiveEffect(k); setSearchQuery('') }}
                                    />
                                ))
                            )}
                        </div>
                    </motion.div>

                    {/* ── Right panel ── */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeEffect}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col gap-5"
                        >
                            {/* Effect header */}
                            <div className="glass rounded-2xl p-6"
                                style={{ borderColor: data.accent + '25' }}>
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                                            style={{ background: data.accent + '14', border: `1px solid ${data.accent}30` }}>
                                            {data.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-display text-2xl tracking-wide text-[var(--text-primary)]">{data.label}</h3>
                                                <span className="font-mono text-xs px-2 py-0.5 rounded-full"
                                                    style={{ background: data.accent + '18', color: data.accent, border: `1px solid ${data.accent}30` }}>
                                                    {data.category}
                                                </span>
                                            </div>
                                            <p className="text-sm text-[var(--text-secondary)]">{data.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {data.tags.map(tag => (
                                            <span key={tag} className="font-mono text-xs px-2 py-0.5 rounded"
                                                style={{ background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Variant tabs */}
                            {data.variants.length > 1 && (
                                <div className="flex gap-2 flex-wrap">
                                    {data.variants.map((v, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveVariant(i)}
                                            className="relative px-4 py-2 rounded-xl font-mono text-xs transition-colors duration-200"
                                            style={{
                                                background: activeVariant === i ? data.accent + '18' : 'var(--surface)',
                                                border: `1px solid ${activeVariant === i ? data.accent + '40' : 'var(--border)'}`,
                                                color: activeVariant === i ? data.accent : 'var(--text-secondary)',
                                            }}
                                        >
                                            {v.name}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Code block */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeVariant}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <CodeBlock variant={data.variants[activeVariant]} />
                                </motion.div>
                            </AnimatePresence>

                            {/* Copy all button */}
                            <div className="flex items-center justify-between">
                                <p className="font-mono text-xs text-[var(--text-muted)]">
                                    {data.variants[activeVariant].code.split('\n').length} lines · {data.variants[activeVariant].lang.toUpperCase()}
                                </p>
                                <CopyButton code={data.variants[activeVariant].code} />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}
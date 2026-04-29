import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'

gsap.registerPlugin(ScrollTrigger)

const chapters = [
  {
    id: 'enter',
    label: '01 / Enter',
    headline: 'EVERY PIXEL',
    sub: 'IS A FRAME',
    body: 'GSAP ScrollTrigger binds DOM transformations directly to scroll position. No timers. No jank. Pure choreography.',
    accent: '#00FFB2',
    bg: 'from-emerald-950/40 to-transparent',
    icon: '◈',
  },
  {
    id: 'drift',
    label: '02 / Drift',
    headline: 'PARALLAX',
    sub: 'IS CINEMA',
    body: 'Background, midground, foreground — each layer moves at its own rate. Depth emerges from relative motion, the same trick film has used since 1940.',
    accent: '#00B4D8',
    bg: 'from-cyan-950/40 to-transparent',
    icon: '⬡',
  },
  {
    id: 'reveal',
    label: '03 / Reveal',
    headline: 'WORDS',
    sub: 'ARRIVE ON CUE',
    body: 'Characters split into spans, staggered by milliseconds. The reader\'s eye and the text arrive together — it feels telepathic.',
    accent: '#FF4D00',
    bg: 'from-orange-950/40 to-transparent',
    icon: '◎',
  },
  {
    id: 'exit',
    label: '04 / Exit',
    headline: 'LEAVING IS',
    sub: 'CONSIDERED TOO',
    body: 'The reverse timeline fires on scroll-out. Exiting is as deliberate as entering. Consistent motion language throughout.',
    accent: '#A855F7',
    bg: 'from-purple-950/40 to-transparent',
    icon: '▣',
  },
]

// ── Pinned horizontal storytelling ──
function StickyScroll() {
  const wrapRef = useRef(null)
  const trackRef = useRef(null)
  const progressRef = useRef(null)
  const chapterLabelRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current
      const panels = track.querySelectorAll('.scroll-panel')
      const totalW = (panels.length - 1) * window.innerWidth

      // Chapter label updates
      const updateLabel = (index) => {
        if (chapterLabelRef.current) {
          chapterLabelRef.current.textContent = chapters[index]?.label || ''
        }
      }

      // Master horizontal scroll
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          pin: true,
          scrub: 1.2,
          start: 'top top',
          end: `+=${totalW}`,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Progress bar
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`
            }
            // Chapter label
            const idx = Math.floor(self.progress * chapters.length)
            updateLabel(Math.min(idx, chapters.length - 1))
          },
        },
      })

      masterTl.to(track, {
        x: -totalW,
        ease: 'none',
      })

      // Per-panel animations (scrubbed within their portion)
      panels.forEach((panel, i) => {
        const headline = panel.querySelector('.panel-headline')
        const sub = panel.querySelector('.panel-sub')
        const body = panel.querySelector('.panel-body')
        const icon = panel.querySelector('.panel-icon')
        const bg = panel.querySelector('.panel-bg')
        const num = panel.querySelector('.panel-num')
        const bar = panel.querySelector('.panel-bar')

        // Entry animations  
        const entryTl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapRef.current,
            scrub: 1,
            start: `top+=${i * window.innerWidth * 0.85} top`,
            end: `top+=${i * window.innerWidth * 0.85 + window.innerWidth * 0.6} top`,
          },
        })

        entryTl
          .from(icon, { scale: 0, opacity: 0, rotate: -90, duration: 1, ease: 'back.out(2)' }, 0)
          .from(num, { x: -40, opacity: 0, duration: 0.8 }, 0.1)
          .from(headline, { y: 80, opacity: 0, skewX: 4, duration: 1, ease: 'power4.out' }, 0.15)
          .from(sub, { y: 60, opacity: 0, skewX: 3, duration: 0.9 }, 0.3)
          .from(body, { y: 40, opacity: 0, duration: 0.8 }, 0.45)
          .from(bar, { scaleX: 0, duration: 1, ease: 'expo.out' }, 0.5)

        // Parallax bg per panel
        gsap.to(bg, {
          xPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapRef.current,
            scrub: 2,
            start: `top+=${i * window.innerWidth * 0.6} top`,
            end: `top+=${(i + 1) * window.innerWidth} top`,
          },
        })

        // Exit: panels fade as next arrives
        if (i < panels.length - 1) {
          gsap.to(panel, {
            opacity: 0.15,
            scale: 0.95,
            ease: 'none',
            scrollTrigger: {
              trigger: wrapRef.current,
              scrub: 1,
              start: `top+=${(i + 0.7) * window.innerWidth} top`,
              end: `top+=${(i + 1) * window.innerWidth} top`,
            },
          })
        }
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapRef} className="relative h-screen overflow-hidden">
      {/* Chapter label + Progress */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
        <span ref={chapterLabelRef} className="font-mono text-xs tracking-[0.25em] uppercase"
          style={{ color: 'var(--accent)' }}>
          {chapters[0].label}
        </span>
        <div className="w-48 h-px bg-[var(--border)] rounded-full overflow-hidden">
          <div ref={progressRef} className="h-full rounded-full transition-none"
            style={{ width: '0%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
        </div>
      </div>

      {/* Horizontal track */}
      <div ref={trackRef} className="flex h-full" style={{ width: `${chapters.length * 100}vw` }}>
        {chapters.map((ch, i) => (
          <div
            key={ch.id}
            className="scroll-panel relative flex-shrink-0 w-screen h-full flex items-center justify-center overflow-hidden"
          >
            {/* Animated background */}
            <div
              className={`panel-bg absolute inset-0 bg-gradient-to-r ${ch.bg}`}
              style={{ willChange: 'transform' }}
            />

            {/* Grid lines */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
                backgroundSize: '80px 80px',
              }}
            />

            {/* Floating number watermark */}
            <div className="panel-num absolute right-12 top-1/2 -translate-y-1/2 font-display text-[22vw] leading-none pointer-events-none select-none"
              style={{ color: ch.accent, opacity: 0.04 }}>
              {String(i + 1).padStart(2, '0')}
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl px-12 md:px-20">
              {/* Icon */}
              <div className="panel-icon text-6xl mb-8" style={{ color: ch.accent }}>
                {ch.icon}
              </div>

              {/* Headline */}
              <h3 className="panel-headline font-display leading-none tracking-wider mb-2"
                style={{
                  fontSize: 'clamp(52px, 9vw, 120px)',
                  color: 'var(--text-primary)',
                }}>
                {ch.headline}
              </h3>
              <h3 className="panel-sub font-display leading-none tracking-wider mb-8"
                style={{
                  fontSize: 'clamp(52px, 9vw, 120px)',
                  color: ch.accent,
                  textShadow: `0 0 60px ${ch.accent}40`,
                }}>
                {ch.sub}
              </h3>

              <p className="panel-body text-[var(--text-secondary)] text-lg leading-relaxed max-w-md mb-8">
                {ch.body}
              </p>

              {/* Animated bar */}
              <div className="panel-bar h-px w-full origin-left rounded-full"
                style={{ background: `linear-gradient(90deg, ${ch.accent}, transparent)` }} />
            </div>

            {/* Chapter dot indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
              {chapters.map((_, di) => (
                <div key={di} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    background: di === i ? ch.accent : 'var(--border)',
                    boxShadow: di === i ? `0 0 8px ${ch.accent}` : 'none',
                    transform: di === i ? 'scale(1.4)' : 'scale(1)',
                  }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Vertical parallax reveal panels ──
function ParallaxPanels() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = containerRef.current.querySelectorAll('.v-panel')

      panels.forEach((panel, i) => {
        const text = panel.querySelector('.v-text')
        const visual = panel.querySelector('.v-visual')
        const line = panel.querySelector('.v-line')

        // Text reveal from clip
        gsap.from(text, {
          y: 100,
          opacity: 0,
          clipPath: 'inset(0 0 100% 0)',
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        })

        // Visual parallax
        if (visual) {
          gsap.to(visual, {
            y: -80,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.8,
            },
          })
        }

        // Line draw
        gsap.from(line, {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        })
      })

      // Character-split headline
      const splitEl = containerRef.current.querySelector('.split-headline')
      if (splitEl) {
        const chars = splitEl.textContent.split('')
        splitEl.innerHTML = chars.map(c =>
          `<span class="inline-block overflow-hidden"><span class="inline-block split-char">${c === ' ' ? '&nbsp;' : c}</span></span>`
        ).join('')

        gsap.from(splitEl.querySelectorAll('.split-char'), {
          y: '110%',
          opacity: 0,
          stagger: 0.035,
          duration: 0.8,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: splitEl,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const vertPanels = [
    { label: 'Motion Language', desc: 'Consistent easing curves unify every interaction. One spring preset, used everywhere.', accent: '#00FFB2', side: 'left' },
    { label: 'Scrub Control', desc: 'Scroll position is the timeline position. The user scrubs through your story at their own pace.', accent: '#00B4D8', side: 'right' },
    { label: 'Pin & Release', desc: 'Sections pin to the viewport, play their sequence, then release. Theater in the browser.', accent: '#FF4D00', side: 'left' },
  ]

  return (
    <div ref={containerRef} className="py-24 space-y-1">
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <h3 className="split-headline font-display text-[clamp(40px,6vw,80px)] tracking-wider text-[var(--text-primary)] leading-none">
          VERTICAL REVEALS
        </h3>
      </div>

      {vertPanels.map((p, i) => (
        <div key={p.label} className="v-panel relative overflow-hidden py-16 px-6">
          <div className="v-visual absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at ${p.side === 'left' ? '20%' : '80%'} 50%, ${p.accent}08, transparent 60%)`,
            }}
          />
          <div className={`max-w-6xl mx-auto flex ${p.side === 'right' ? 'justify-end' : ''}`}>
            <div className="v-text max-w-lg">
              <span className="font-mono text-xs tracking-widest uppercase mb-3 block" style={{ color: p.accent }}>
                {String(i + 1).padStart(2, '0')} — Technique
              </span>
              <h4 className="font-display text-[clamp(32px,4vw,56px)] tracking-wide text-[var(--text-primary)] leading-none mb-4">
                {p.label}
              </h4>
              <p className="text-[var(--text-secondary)] leading-relaxed">{p.desc}</p>
              <div className="v-line mt-6 h-px" style={{ background: `linear-gradient(${p.side === 'left' ? '90deg' : '270deg'}, ${p.accent}, transparent)` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ScrollStory() {
  return (
    <section id="story" className="relative">
      {/* Section header */}
      <div className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionLabel number={4} label="Scroll Story" />
          <motion.h2
            className="font-display text-[clamp(48px,8vw,100px)] leading-none tracking-wider text-[var(--text-primary)]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            SCROLL<br /><span className="gradient-text">THEATER</span>
          </motion.h2>
          <motion.p
            className="text-[var(--text-secondary)] mt-4 max-w-md"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Horizontal pinned sections + vertical reveals. Scroll drives everything.
          </motion.p>
        </div>
      </div>

      {/* Pinned horizontal scroll */}
      <StickyScroll />

      {/* Vertical parallax reveals */}
      <ParallaxPanels />
    </section>
  )
}
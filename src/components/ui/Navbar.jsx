import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { getLenis } from '../../hooks/useLenis'

const sections = ['Hero', 'Gallery', 'Hover Lab', 'Story', 'Grid', '3D', 'Forms', 'Theme', 'Perf', 'Dev Tools']
const sectionIds = ['hero', 'gallery', 'hover-lab', 'story', 'grid', 'depth', 'forms', 'theme', 'perf', 'dev-tools']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(el, { offset: 0, duration: 1.6, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    } else {
      el.scrollIntoView({ behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      >
        <div
          className={`absolute inset-0 transition-all duration-500 ${scrolled ? 'glass border-b border-[var(--border)]' : ''}`}
          style={{ borderRadius: 0 }}
        />

        {/* Logo */}
        <button
          onClick={() => scrollTo('hero')}
          className="relative z-10 flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-full border border-[var(--accent)] flex items-center justify-center relative">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] group-hover:scale-150 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-full border border-[var(--accent)] scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-0 transition-all duration-500 animate-ping" />
          </div>
          <span className="font-display text-xl tracking-widest text-[var(--text-primary)]">
            MOTION<span className="text-[var(--accent)]">LAB</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="relative z-10 hidden md:flex items-center gap-6">
          {sections.slice(0, 8).map((s, i) => (
            <button key={s} onClick={() => scrollTo(sectionIds[i])} className="nav-link">
              {s}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="relative z-10 flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full glass flex items-center justify-center hover:border-[var(--accent)] border border-[var(--border)] transition-all duration-300"
            title="Toggle theme"
          >
            <motion.span
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="text-sm"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </motion.span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
          >
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="block h-px bg-[var(--text-primary)] w-6"
                animate={menuOpen ? {
                  rotate: i === 0 ? 45 : i === 2 ? -45 : 0,
                  y: i === 0 ? 7 : i === 2 ? -7 : 0,
                  opacity: i === 1 ? 0 : 1,
                } : { rotate: 0, y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 glass-strong flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(40px)' }}
            exit={{ opacity: 0 }}
          >
            {sections.map((s, i) => (
              <motion.button
                key={s}
                onClick={() => scrollTo(sectionIds[i])}
                className="font-display text-5xl tracking-wider text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {s}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
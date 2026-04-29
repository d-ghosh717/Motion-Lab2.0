import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import SectionLabel from '../ui/SectionLabel'

const ACCENTS = [
  { color: '#00FFB2', label: 'Mint' },
  { color: '#00B4D8', label: 'Cyan' },
  { color: '#FF4D00', label: 'Ember' },
  { color: '#A855F7', label: 'Violet' },
  { color: '#F59E0B', label: 'Amber' },
  { color: '#EC4899', label: 'Rose' },
  { color: '#10B981', label: 'Emerald' },
  { color: '#F1F5F9', label: 'White' },
]

function ThemeCard({ isDark }) {
  return (
    <motion.div
      className="rounded-2xl overflow-hidden border"
      style={{
        background: isDark ? '#0D0D14' : '#F4F4F0',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {/* Fake header */}
      <div
        className="px-5 py-3 flex items-center gap-2 border-b"
        style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
      >
        <div className="flex gap-1.5">
          {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
            <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <div
          className="flex-1 h-2.5 rounded-full ml-3"
          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
        />
      </div>

      {/* Fake content */}
      <div className="p-5 space-y-3">
        <div className="h-4 rounded w-2/3" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
        <div className="h-3 rounded w-full" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
        <div className="h-3 rounded w-5/6" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
        <div className="flex gap-2 mt-4">
          <div className="h-8 flex-1 rounded-lg" style={{ background: 'var(--accent)', opacity: 0.8 }} />
          <div className="h-8 flex-1 rounded-lg" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
        </div>
      </div>
    </motion.div>
  )
}

export default function ThemeLab() {
  const { theme, toggleTheme, accent, setAccent } = useStore()

  return (
    <section id="theme" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionLabel number={8} label="Theme Lab" />

        <motion.h2
          className="font-display text-[clamp(48px,8vw,100px)] leading-none tracking-wider text-[var(--text-primary)] mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          THEME<br />
          <span className="gradient-text">LAB</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Light/Dark toggle */}
          <div>
            <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-8">
              — Light / Dark Toggle
            </p>

            <div className="glass rounded-2xl p-8">
              {/* Toggle switch */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[var(--text-primary)] font-medium">Color scheme</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Currently: {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                  </p>
                </div>

                <button
                  onClick={toggleTheme}
                  className="relative w-20 h-10 rounded-full overflow-hidden"
                  style={{ background: theme === 'dark' ? '#1a1a2e' : '#e8e8e0', border: '1px solid var(--border)' }}
                >
                  {/* Track icons */}
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-base">🌙</span>
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base">☀️</span>

                  {/* Thumb */}
                  <motion.div
                    className="absolute top-1 w-8 h-8 rounded-full shadow-lg z-10"
                    style={{ background: theme === 'dark' ? '#0D0D14' : '#fff' }}
                    animate={{ x: theme === 'dark' ? 4 : 44 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                </button>
              </div>

              {/* Theme preview cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <ThemeCard isDark={true} />
                  <AnimatePresence>
                    {theme === 'dark' && (
                      <motion.div
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--accent)' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <p className="text-center font-mono text-xs text-[var(--text-muted)] mt-2">Dark</p>
                </div>
                <div className="relative">
                  <ThemeCard isDark={false} />
                  <AnimatePresence>
                    {theme === 'light' && (
                      <motion.div
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--accent)' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <p className="text-center font-mono text-xs text-[var(--text-muted)] mt-2">Light</p>
                </div>
              </div>
            </div>
          </div>

          {/* Accent Palette */}
          <div>
            <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-8">
              — Accent Palette
            </p>

            <div className="glass rounded-2xl p-8">
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Select an accent color — updates CSS variables globally, persisted to localStorage.
              </p>

              <div className="grid grid-cols-4 gap-3 mb-8">
                {ACCENTS.map(({ color, label }) => (
                  <motion.button
                    key={color}
                    onClick={() => setAccent(color)}
                    className="flex flex-col items-center gap-2 group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className="w-12 h-12 rounded-full relative"
                      style={{ background: color }}
                    >
                      <AnimatePresence>
                        {accent === color && (
                          <motion.div
                            className="absolute inset-0 rounded-full flex items-center justify-center"
                            style={{ background: 'rgba(0,0,0,0.3)' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M2 7l3 3 7-6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {/* Ring */}
                      <motion.div
                        className="absolute -inset-1.5 rounded-full border-2"
                        style={{ borderColor: color }}
                        animate={{ opacity: accent === color ? 1 : 0, scale: accent === color ? 1 : 0.8 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <span className="font-mono text-xs text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
                      {label}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Live preview */}
              <div className="rounded-xl p-4" style={{ background: accent + '10', border: `1px solid ${accent}30` }}>
                <p className="font-mono text-xs mb-3" style={{ color: accent }}>Live Preview</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ background: accent }} />
                  <div className="flex-1 h-2 rounded-full" style={{ background: accent, opacity: 0.3 }} />
                  <button className="px-4 py-1.5 rounded-full text-xs font-mono text-black" style={{ background: accent }}>
                    Button
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
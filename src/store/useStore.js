import { create } from 'zustand'

const getStoredTheme = () => {
  try {
    return localStorage.getItem('ml-theme') || 'dark'
  } catch { return 'dark' }
}

const getStoredAccent = () => {
  try {
    return localStorage.getItem('ml-accent') || '#00FFB2'
  } catch { return '#00FFB2' }
}

export const useStore = create((set, get) => ({
  // Theme
  theme: getStoredTheme(),
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    set({ theme: next })
    try { localStorage.setItem('ml-theme', next) } catch { }
    document.documentElement.classList.toggle('light', next === 'light')
  },

  // Accent color
  accent: getStoredAccent(),
  setAccent: (color) => {
    set({ accent: color })
    document.documentElement.style.setProperty('--accent', color)
    // derive accent-dim
    document.documentElement.style.setProperty('--accent-dim', color + 'CC')
    document.documentElement.style.setProperty('--border-accent', color + '4D')
    try { localStorage.setItem('ml-accent', color) } catch { }
  },

  // Effects toggles
  effects: {
    particles: true,
    blur: true,
    animations: true,
    cursor: true,
    parallax: true,
  },
  toggleEffect: (key) => {
    set(s => ({
      effects: { ...s.effects, [key]: !s.effects[key] }
    }))
  },

  // Reduce motion
  reduceMotion: false,
  setReduceMotion: (v) => {
    set({ reduceMotion: v })
    document.body.classList.toggle('reduce-motion', v)
  },

  // FPS
  fps: 60,
  setFps: (v) => set({ fps: v }),

  // Modal
  activeModal: null,
  setModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),

  // Cursor
  cursorPos: { x: 0, y: 0 },
  setCursorPos: (pos) => set({ cursorPos: pos }),
  isHovering: false,
  setHovering: (v) => set({ isHovering: v }),
}))

// Initialize on load
if (typeof window !== 'undefined') {
  const theme = getStoredTheme()
  if (theme === 'light') document.documentElement.classList.add('light')

  const accent = getStoredAccent()
  document.documentElement.style.setProperty('--accent', accent)
  document.documentElement.style.setProperty('--accent-dim', accent + 'CC')
  document.documentElement.style.setProperty('--border-accent', accent + '4D')
}
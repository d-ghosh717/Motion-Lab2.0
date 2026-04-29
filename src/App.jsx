import { useEffect } from 'react'
import { useLenis } from './hooks/useLenis'
import { useStore } from './store/useStore'
import CustomCursor from './components/ui/CustomCursor'
import Navbar from './components/ui/Navbar'
import Hero from './components/sections/Hero'
import GlassGallery from './components/sections/GlassGallery'
import HoverLab from './components/sections/HoverLab'
import ScrollStory from './components/sections/ScrollStory'
import GridMorph from './components/sections/GridMorph'
import DepthZone from './components/sections/DepthZone'
import FormsUX from './components/sections/FormsUX'
import ThemeLab from './components/sections/ThemeLab'
import PerformancePanel from './components/sections/PerformancePanel'
import DevTools from './components/sections/DevTools'
import Footer from './components/sections/Footer'

export default function App() {
  useLenis()
  const { theme } = useStore()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') root.classList.add('light')
    else root.classList.remove('light')
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) useStore.getState().setReduceMotion(true)
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
      <div id="scroll-progress" style={{ width: '0%' }} />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <GlassGallery />
        <HoverLab />
        <ScrollStory />
        <GridMorph />
        <DepthZone />
        <FormsUX />
        <ThemeLab />
        <PerformancePanel />
        <DevTools />
      </main>
      <Footer />
    </div>
  )
}
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance = null

export function getLenis() {
  return lenisInstance
}

export function useLenis() {
  const rafRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    })

    lenisInstance = lenis

    // Integrate with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // Scroll progress bar
    lenis.on('scroll', ({ progress }) => {
      const bar = document.getElementById('scroll-progress')
      if (bar) bar.style.width = `${progress * 100}%`
    })

    return () => {
      lenis.destroy()
      lenisInstance = null
      cancelAnimationFrame(rafRef.current)
    }
  }, [])
}
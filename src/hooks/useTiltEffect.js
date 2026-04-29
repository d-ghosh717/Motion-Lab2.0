import { useRef, useEffect } from 'react'

export function useTiltEffect(options = {}) {
  const {
    maxTilt = 15,
    perspective = 1000,
    scale = 1.03,
    speed = 400,
    glare = true,
  } = options

  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let glareEl = null
    if (glare) {
      glareEl = document.createElement('div')
      glareEl.style.cssText = `
        position: absolute; inset: 0;
        border-radius: inherit;
        background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
      `
      el.style.position = 'relative'
      el.style.overflow = 'hidden'
      el.appendChild(glareEl)
    }

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const cx = rect.width / 2
      const cy = rect.height / 2
      const rotateX = ((y - cy) / cy) * -maxTilt
      const rotateY = ((x - cx) / cx) * maxTilt

      el.style.transition = `transform ${speed * 0.25}ms linear`
      el.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale},${scale},${scale})`

      if (glareEl) {
        const glareAngle = Math.atan2(y - cy, x - cx) * (180 / Math.PI)
        glareEl.style.opacity = '1'
        glareEl.style.background = `linear-gradient(${glareAngle}deg, rgba(255,255,255,0.18) 0%, transparent 70%)`
      }
    }

    const onLeave = () => {
      el.style.transition = `transform ${speed}ms cubic-bezier(0.34,1.56,0.64,1)`
      el.style.transform = `perspective(${perspective}px) rotateX(0) rotateY(0) scale3d(1,1,1)`
      if (glareEl) glareEl.style.opacity = '0'
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      if (glareEl && el.contains(glareEl)) el.removeChild(glareEl)
    }
  }, [maxTilt, perspective, scale, speed, glare])

  return ref
}
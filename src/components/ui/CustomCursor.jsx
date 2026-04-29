import { useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const posRef = useRef({ x: 0, y: 0 })
  const ringPosRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)
  const { effects } = useStore()

  useEffect(() => {
    if (!effects.cursor) return
    if (window.matchMedia('(max-width: 768px)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      dot.style.left = e.clientX + 'px'
      dot.style.top = e.clientY + 'px'
    }

    // Smooth ring follow
    const animate = () => {
      const dx = posRef.current.x - ringPosRef.current.x
      const dy = posRef.current.y - ringPosRef.current.y
      ringPosRef.current.x += dx * 0.12
      ringPosRef.current.y += dy * 0.12
      ring.style.left = ringPosRef.current.x + 'px'
      ring.style.top = ringPosRef.current.y + 'px'
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    const onEnterHoverable = () => {
      dot.classList.add('hovering')
      ring.classList.add('hovering')
    }
    const onLeaveHoverable = () => {
      dot.classList.remove('hovering')
      ring.classList.remove('hovering')
    }
    const onMouseDown = () => ring.classList.add('clicking')
    const onMouseUp = () => ring.classList.remove('clicking')

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)

    const attachHoverListeners = () => {
      const hoverables = document.querySelectorAll('a, button, [data-cursor-hover], input, textarea, select')
      hoverables.forEach(el => {
        el.addEventListener('mouseenter', onEnterHoverable)
        el.addEventListener('mouseleave', onLeaveHoverable)
      })
    }
    attachHoverListeners()

    // Observe DOM for new hoverable elements
    const observer = new MutationObserver(attachHoverListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
    }
  }, [effects.cursor])

  if (!effects.cursor) return null

  return (
    <>
      <div id="cursor-dot" ref={dotRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  )
}
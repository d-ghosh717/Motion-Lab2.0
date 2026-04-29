import { useState, useEffect, useCallback } from 'react'

export function useMouseParallax(strength = 0.05) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleMove = useCallback((e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2
    const y = (e.clientY / window.innerHeight - 0.5) * 2
    setOffset({ x: x * strength * 100, y: y * strength * 100 })
  }, [strength])

  useEffect(() => {
    let frame
    const debounced = (e) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => handleMove(e))
    }
    window.addEventListener('mousemove', debounced)
    return () => window.removeEventListener('mousemove', debounced)
  }, [handleMove])

  return offset
}
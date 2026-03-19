import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'

export default function Cursor() {
  const outerRef = useRef(null)
  const innerRef = useRef(null)
  const gravityActive = useStore((s) => s.gravityActive)

  useEffect(() => {
    let mx = 0, my = 0
    let ox = 0, oy = 0
    let ix = 0, iy = 0

    const handleMove = (e) => {
      mx = e.clientX
      my = e.clientY
    }

    const animate = () => {
      ox += (mx - ox) * 0.12
      oy += (my - oy) * 0.12
      ix += (mx - ix) * 0.25
      iy += (my - iy) * 0.25

      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${ox - 20}px, ${oy - 20}px)`
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${ix - 4}px, ${iy - 4}px)`
      }
      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMove)
    requestAnimationFrame(animate)

    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  // Hide on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) return null

  return (
    <>
      <div
        ref={outerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: gravityActive ? '2px solid #FF6B00' : '2px solid rgba(0, 245, 255, 0.5)',
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'difference',
          transition: 'width 0.3s, height 0.3s, border-color 0.3s',
          boxShadow: gravityActive
            ? '0 0 20px rgba(255, 107, 0, 0.4), 0 0 40px rgba(255, 107, 0, 0.2)'
            : '0 0 20px rgba(0, 245, 255, 0.3), 0 0 40px rgba(0, 245, 255, 0.1)',
        }}
      />
      <div
        ref={innerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: gravityActive ? '#FF6B00' : '#00F5FF',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'background 0.3s',
          boxShadow: gravityActive
            ? '0 0 10px #FF6B00'
            : '0 0 10px #00F5FF',
        }}
      />
    </>
  )
}

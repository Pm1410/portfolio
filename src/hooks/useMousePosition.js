import { useEffect } from 'react'
import useStore from '../store/useStore'

export default function useMousePosition() {
  const setMouse = useStore((s) => s.setMouse)

  useEffect(() => {
    let rafId
    let currentX = 0, currentY = 0
    let targetX = 0, targetY = 0

    const handleMouseMove = (e) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const animate = () => {
      currentX += (targetX - currentX) * 0.15
      currentY += (targetY - currentY) * 0.15
      setMouse(currentX, currentY)
      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [setMouse])
}

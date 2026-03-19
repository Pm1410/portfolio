import { useEffect, useRef } from 'react'
import useStore from '../store/useStore'

export default function useScrollProgress() {
  const setScrollProgress = useStore((s) => s.setScrollProgress)
  const setScrollVelocity = useStore((s) => s.setScrollVelocity)
  const lastScroll = useRef(0)

  useEffect(() => {
    let rafId
    const update = () => {
      const scrollY = window.scrollY || window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollY / docHeight : 0
      const velocity = Math.abs(scrollY - lastScroll.current)
      lastScroll.current = scrollY
      setScrollProgress(Math.min(1, Math.max(0, progress)))
      setScrollVelocity(Math.min(velocity, 100))
      rafId = requestAnimationFrame(update)
    }
    rafId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafId)
  }, [setScrollProgress, setScrollVelocity])
}

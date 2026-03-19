import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import useStore from '../store/useStore'

export default function Preloader() {
  const [show, setShow] = useState(true)
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const gridRef = useRef(null)
  const setLoaded = useStore((s) => s.setLoaded)

  useEffect(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline({
      onComplete: () => {
        setLoaded()
        setShow(false)
      },
    })

    // Create grid dots
    const gridEl = gridRef.current
    if (gridEl) {
      for (let i = 0; i < 100; i++) {
        const dot = document.createElement('div')
        dot.className = 'grid-dot'
        dot.style.cssText = `
          position: absolute;
          width: 3px;
          height: 3px;
          background: #00F5FF;
          border-radius: 50%;
          left: ${(i % 10) * 10 + 5}%;
          top: ${Math.floor(i / 10) * 10 + 5}%;
          opacity: 0;
          box-shadow: 0 0 6px #00F5FF;
        `
        gridEl.appendChild(dot)
      }
    }

    const dots = gridEl?.querySelectorAll('.grid-dot') || []

    // Phase 1: Center dot appears
    tl.fromTo(
      dots,
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: { from: 'center', each: 0.008, grid: [10, 10] },
        ease: 'power2.out',
      }
    )

    // Phase 2: Glitch text
    .to(textRef.current, {
      opacity: 1,
      duration: 0.1,
    }, '-=0.2')
    .fromTo(textRef.current, {
      textContent: '||||||||||||',
    }, {
      duration: 0.6,
      ease: 'none',
      onUpdate: function() {
        const progress = this.progress()
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%'
        const target = 'NEURAL CORE ONLINE'
        let result = ''
        for (let i = 0; i < target.length; i++) {
          if (progress > (i / target.length) + 0.3) {
            result += target[i]
          } else {
            result += chars[Math.floor(Math.random() * chars.length)]
          }
        }
        if (textRef.current) textRef.current.textContent = result
      },
    })

    // Phase 3: Grid collapses
    .to(dots, {
      left: '50%',
      top: '50%',
      scale: 0,
      opacity: 0,
      duration: 0.6,
      stagger: { from: 'edges', each: 0.005, grid: [10, 10] },
      ease: 'power4.in',
    }, '+=0.2')

    // Phase 4: Flash and exit
    .to(containerRef.current, {
      backgroundColor: '#00F5FF',
      duration: 0.05,
    })
    .to(containerRef.current, {
      backgroundColor: '#020408',
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    })

    return () => tl.kill()
  }, [setLoaded])

  if (!show) return null

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50000,
        background: '#020408',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        ref={gridRef}
        style={{
          position: 'absolute',
          inset: 0,
        }}
      />
      <div
        ref={textRef}
        className="font-display"
        style={{
          color: '#00F5FF',
          fontSize: 'clamp(14px, 2vw, 24px)',
          letterSpacing: '0.3em',
          zIndex: 2,
          opacity: 0,
          textShadow: '0 0 20px rgba(0, 245, 255, 0.6), 0 0 60px rgba(0, 245, 255, 0.3)',
        }}
      >
        INITIALIZING
      </div>
    </div>
  )
}

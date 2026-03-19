import { useEffect, useRef, useState } from 'react'
import useGravity from '../hooks/useGravity'
import useStore from '../store/useStore'

export default function GravityMode() {
  const { activateGravity, restoreGravity } = useGravity()
  const gravityActive = useStore((s) => s.gravityActive)
  const [warningText, setWarningText] = useState(null)
  const clickCountRef = useRef(0)
  const clickTimerRef = useRef(null)

  // Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
  useEffect(() => {
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA',
    ]
    let pos = 0

    const handleKeyDown = (e) => {
      if (gravityActive) {
        if (e.key === 'Escape') restoreGravity()
        return
      }

      if (e.code === konamiCode[pos]) {
        pos++
        if (pos === konamiCode.length) {
          trigger()
          pos = 0
        }
      } else {
        pos = 0
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gravityActive, restoreGravity])

  // Name click (7x fast)
  useEffect(() => {
    const nameEl = document.getElementById('hero-name')
    if (!nameEl) return

    const handleClick = () => {
      if (gravityActive) return
      clickCountRef.current++
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
      clickTimerRef.current = setTimeout(() => { clickCountRef.current = 0 }, 2000)

      if (clickCountRef.current >= 7) {
        trigger()
        clickCountRef.current = 0
      }
    }

    nameEl.addEventListener('click', handleClick)
    return () => nameEl.removeEventListener('click', handleClick)
  }, [gravityActive])

  // Terminal "DROP" command
  useEffect(() => {
    const handleTrigger = () => {
      if (!gravityActive) trigger()
    }
    window.addEventListener('trigger-gravity', handleTrigger)
    return () => window.removeEventListener('trigger-gravity', handleTrigger)
  }, [gravityActive])

  const trigger = () => {
    // Phase 1: Warning
    setWarningText('⚠ GRAVITATIONAL ANOMALY DETECTED')
    document.body.style.animation = 'none'

    // Flash red
    const flash = document.createElement('div')
    flash.style.cssText = `
      position: fixed; inset: 0; z-index: 50001;
      background: rgba(255, 0, 0, 0.3); pointer-events: none;
    `
    document.body.appendChild(flash)
    setTimeout(() => flash.remove(), 150)

    // Phase 2: Collapse (after 0.5s)
    setTimeout(() => {
      setWarningText(null)
      activateGravity()
    }, 500)
  }

  return (
    <>
      {/* Warning text */}
      {warningText && (
        <div
          className="animate-glitch"
          style={{
            position: 'fixed',
            top: 60,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50002,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(12px, 1.5vw, 16px)',
            color: '#FF0000',
            textShadow: '0 0 20px rgba(255, 0, 0, 0.5)',
            whiteSpace: 'nowrap',
          }}
        >
          {warningText}
        </div>
      )}

      {/* Gravity mode overlay */}
      {gravityActive && (
        <>
          {/* Secret message */}
          <div style={{
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10001,
            textAlign: 'center',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            color: 'rgba(0, 245, 255, 0.3)',
            lineHeight: 2,
            pointerEvents: 'none',
          }}>
            <div>// you found it.</div>
            <div>// this is what happens when an AI engineer</div>
            <div>// takes physics a little too seriously.</div>
          </div>

          {/* Restore gravity button */}
          <button
            onClick={restoreGravity}
            style={{
              position: 'fixed',
              top: 20,
              right: 20,
              zIndex: 50003,
              padding: '10px 24px',
              background: 'rgba(0, 245, 255, 0.1)',
              border: '1px solid rgba(0, 245, 255, 0.4)',
              borderRadius: 8,
              color: '#00F5FF',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 14,
              letterSpacing: '0.2em',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 0 20px rgba(0, 245, 255, 0.15)',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 245, 255, 0.2)'
              e.target.style.boxShadow = '0 0 40px rgba(0, 245, 255, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0, 245, 255, 0.1)'
              e.target.style.boxShadow = '0 0 20px rgba(0, 245, 255, 0.15)'
            }}
          >
            [ RESTORE GRAVITY ]
          </button>
        </>
      )}
    </>
  )
}

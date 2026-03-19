import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AudioService from '../hooks/useAudio'

export default function Hero() {
  const sectionRef = useRef(null)
  const nameRef = useRef(null)
  const subtitleRef = useRef(null)
  const hudRef = useRef(null)
  const scrollIndicatorRef = useRef(null)
  
  const { playHover, playClick } = AudioService

  // GSAP animations
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Pin the hero
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=200%',
        pin: true,
        pinSpacing: true,
      })

      // Name entrance - Cinematic Glitch Scramble
      const nameEl = nameRef.current
      if (nameEl) {
        const targetText = 'PRATEEK MUKHERJEE'
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*<>'
        
        gsap.fromTo(nameEl, 
          { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
          { 
            opacity: 1, 
            scale: 1, 
            filter: 'blur(0px)',
            duration: 0.5, 
            delay: 2.5,
            ease: 'power2.out'
          }
        )

        // Glitch Scrambler logic
        const glitchObj = { val: 0 }
        gsap.to(glitchObj, {
          val: 1,
          duration: 2.0,
          delay: 2.5,
          ease: 'none',
          onUpdate: () => {
            const progress = glitchObj.val
            const resolvedCount = Math.floor(progress * targetText.length)
            
            let currentText = ''
            for (let i = 0; i < targetText.length; i++) {
              if (targetText[i] === ' ') {
                currentText += ' '
              } else if (i < resolvedCount) {
                currentText += targetText[i]
              } else {
                currentText += chars[Math.floor(Math.random() * chars.length)]
              }
            }
            if (nameEl) nameEl.textContent = currentText
          },
          onComplete: () => {
            if (nameEl) nameEl.textContent = targetText
          }
        })
      }

      // Subtitle matrix decode
      if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current, { opacity: 0, y: 30 }, {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 4,
          ease: 'power3.out',
          onStart: () => {
            const target = 'AI/ML Engineer · Full Stack Architect · Builder of Intelligent Systems'
            const chars = '01アイウエオカキクケコ@#$%&'
            let iterations = 0
            const interval = setInterval(() => {
              if (!subtitleRef.current) { clearInterval(interval); return }
              subtitleRef.current.textContent = target.split('').map((c, i) => {
                if (i < iterations) return target[i]
                return chars[Math.floor(Math.random() * chars.length)]
              }).join('')
              iterations += 1
              if (iterations > target.length) clearInterval(interval)
            }, 30)
          },
        })
      }

      // HUD elements
      if (hudRef.current) {
        gsap.fromTo(hudRef.current.children,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0,
            duration: 0.6,
            stagger: 0.15,
            delay: 4.5,
            ease: 'power2.out',
          }
        )
      }

      // Scroll indicator
      if (scrollIndicatorRef.current) {
        gsap.fromTo(scrollIndicatorRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 1, delay: 5, ease: 'power2.out' }
        )
        gsap.to(scrollIndicatorRef.current, {
          y: 10, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 5.5,
        })
      }

      // Scroll-driven fade out
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=150%',
        scrub: 1,
        onUpdate: (self) => {
          if (nameRef.current) {
            gsap.set(nameRef.current, { opacity: 1 - self.progress * 1.5 })
          }
          if (subtitleRef.current) {
            gsap.set(subtitleRef.current, { opacity: 1 - self.progress * 1.2 })
          }
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="scene-section" style={{ height: '100vh', background: 'transparent' }}>
      {/* Content overlay */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px',
      }}>
        {/* HUD top */}
        <div ref={hudRef} style={{
          position: 'absolute',
          top: 40,
          left: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          <div className="gravity-target" style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '13px',
            letterSpacing: '0.2em',
            color: 'rgba(0, 245, 255, 0.5)',
          }}>
            SYS.STATUS: <span style={{ color: '#39FF14' }}>ONLINE</span>
          </div>
          <div className="gravity-target" style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '13px',
            letterSpacing: '0.2em',
            color: 'rgba(0, 245, 255, 0.5)',
          }}>
            LOCATION: <span style={{ color: '#E8EAF0' }}>INDIA</span>
          </div>
          <div className="gravity-target" style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '13px',
            letterSpacing: '0.2em',
            color: 'rgba(0, 245, 255, 0.5)',
          }}>
            VERSION: <span style={{ color: '#E8EAF0' }}>3.1.4</span>
          </div>
        </div>

        {/* Status HUD top right */}
        <div style={{
          position: 'absolute',
          top: 40,
          right: 40,
          textAlign: 'right',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          <div className="gravity-target" id="nav-link-projects" style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '14px',
            letterSpacing: '0.3em',
            color: 'rgba(232, 234, 240, 0.4)',
            cursor: 'pointer',
            transition: 'color 0.3s',
          }}
          onMouseEnter={(e) => { e.target.style.color = '#00F5FF'; playHover() }}
          onMouseLeave={(e) => e.target.style.color = 'rgba(232, 234, 240, 0.4)'}
          onClick={() => { playClick(); document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' }) }}
          >
            PROJECTS
          </div>
          <div className="gravity-target" id="nav-link-skills" style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '14px',
            letterSpacing: '0.3em',
            color: 'rgba(232, 234, 240, 0.4)',
            cursor: 'pointer',
            transition: 'color 0.3s',
          }}
          onMouseEnter={(e) => { e.target.style.color = '#00F5FF'; playHover() }}
          onMouseLeave={(e) => e.target.style.color = 'rgba(232, 234, 240, 0.4)'}
          onClick={() => { playClick(); document.getElementById('skills-section')?.scrollIntoView({ behavior: 'smooth' }) }}
          >
            SKILLS
          </div>
          <div className="gravity-target" id="nav-link-about" style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '14px',
            letterSpacing: '0.3em',
            color: 'rgba(232, 234, 240, 0.4)',
            cursor: 'pointer',
            transition: 'color 0.3s',
          }}
          onMouseEnter={(e) => { e.target.style.color = '#00F5FF'; playHover() }}
          onMouseLeave={(e) => e.target.style.color = 'rgba(232, 234, 240, 0.4)'}
          onClick={() => { playClick(); document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' }) }}
          >
            ABOUT
          </div>
          <div className="gravity-target" id="nav-link-contact" style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '14px',
            letterSpacing: '0.3em',
            color: 'rgba(232, 234, 240, 0.4)',
            cursor: 'pointer',
            transition: 'color 0.3s',
          }}
          onMouseEnter={(e) => { e.target.style.color = '#00F5FF'; playHover() }}
          onMouseLeave={(e) => e.target.style.color = 'rgba(232, 234, 240, 0.4)'}
          onClick={() => { playClick(); document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' }) }}
          >
            CONTACT
          </div>
        </div>

        {/* Name */}
        <h1
          ref={nameRef}
          id="hero-name"
          className="gravity-target font-display"
          style={{
            fontSize: 'clamp(32px, 7vw, 90px)',
            fontWeight: 900,
            letterSpacing: '0.05em',
            color: '#E8EAF0',
            textShadow: '0 0 40px rgba(0, 245, 255, 0.3), 0 0 80px rgba(0, 245, 255, 0.1)',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          PRATEEK MUKHERJEE
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="gravity-target font-mono"
          style={{
            fontSize: 'clamp(12px, 1.5vw, 18px)',
            color: 'rgba(0, 245, 255, 0.7)',
            letterSpacing: '0.15em',
            textAlign: 'center',
            maxWidth: '700px',
          }}
        >
          AI/ML Engineer · Full Stack Architect · Builder of Intelligent Systems
        </p>

        {/* Corner brackets */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(600px, 80vw)',
          height: 'min(300px, 40vh)',
          pointerEvents: 'none',
        }}>
          {/* Top left bracket */}
          <div style={{
            position: 'absolute', top: -20, left: -20,
            width: 40, height: 40,
            borderTop: '1px solid rgba(0, 245, 255, 0.2)',
            borderLeft: '1px solid rgba(0, 245, 255, 0.2)',
          }} />
          {/* Top right bracket */}
          <div style={{
            position: 'absolute', top: -20, right: -20,
            width: 40, height: 40,
            borderTop: '1px solid rgba(0, 245, 255, 0.2)',
            borderRight: '1px solid rgba(0, 245, 255, 0.2)',
          }} />
          {/* Bottom left bracket */}
          <div style={{
            position: 'absolute', bottom: -20, left: -20,
            width: 40, height: 40,
            borderBottom: '1px solid rgba(0, 245, 255, 0.2)',
            borderLeft: '1px solid rgba(0, 245, 255, 0.2)',
          }} />
          {/* Bottom right bracket */}
          <div style={{
            position: 'absolute', bottom: -20, right: -20,
            width: 40, height: 40,
            borderBottom: '1px solid rgba(0, 245, 255, 0.2)',
            borderRight: '1px solid rgba(0, 245, 255, 0.2)',
          }} />
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollIndicatorRef}
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span className="font-label" style={{
            fontSize: '13px',
            letterSpacing: '0.3em',
            color: 'rgba(0, 245, 255, 0.4)',
          }}>
            SCROLL TO EXPLORE
          </span>
          <div style={{
            width: 1,
            height: 40,
            background: 'linear-gradient(to bottom, rgba(0, 245, 255, 0.5), transparent)',
          }} />
        </div>
      </div>
    </section>
  )
}

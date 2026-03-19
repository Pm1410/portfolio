import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const stats = [
  { label: 'YEARS ACTIVE', value: 2, suffix: '+', color: '#00F5FF' },
  { label: 'PROJECTS BUILT', value: 3, suffix: '', color: '#39FF14' },
  { label: 'TECHNOLOGIES', value: 15, suffix: '+', color: '#FF6B00' },
  { label: 'LINES OF CODE', value: 50, suffix: 'K+', color: '#A855F7' },
]

const timeline = [
  { year: '2023', event: 'Started coding journey in high school', color: '#FF6B00' },
  { year: '2024', event: 'Built first ML project — Neuronova', color: '#39FF14' },
  { year: '2025', event: 'Launched Sentronyx & ERP system', color: '#00F5FF' },
  { year: '2026', event: 'Building the future of intelligent systems', color: '#A855F7' },
]

const bioLines = [
  '> SUBJECT: Prateek Mukherjee',
  '> CLASSIFICATION: AI/ML Engineer',
  '> STATUS: Active Builder',
  '> ORIGIN: India',
  '',
  'A relentless builder at the intersection of',
  'artificial intelligence and full-stack engineering.',
  '',
  'Started coding in high school in 2023 and never',
  'looked back. From algorithmic trading systems to',
  'intelligent code debuggers, every project is a step',
  'toward building systems that think, adapt, and evolve.',
  '',
  'Driven by curiosity. Powered by code.',
  'Building the future — one commit at a time.',
]

export default function About() {
  const sectionRef = useRef(null)
  const bioRef = useRef(null)
  const statsRef = useRef(null)
  const titleRef = useRef(null)
  const timelineRef = useRef(null)
  const [counters, setCounters] = useState(stats.map(() => 0))

  // GSAP animations
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Title
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
          }
        )
      }

      // Bio text — redacted unblur effect
      if (bioRef.current) {
        const bioChildren = bioRef.current.children
        gsap.fromTo(bioChildren,
          { opacity: 0, filter: 'blur(8px)', x: -20 },
          {
            opacity: 1, filter: 'blur(0px)', x: 0,
            duration: 0.6, stagger: 0.08, ease: 'power2.out',
            scrollTrigger: { trigger: bioRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
          }
        )
      }

      // Stats counter
      if (statsRef.current) {
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: 'top 80%',
          onEnter: () => {
            stats.forEach((stat, i) => {
              const duration = 2000
              const start = Date.now()
              const animate = () => {
                const elapsed = Date.now() - start
                const progress = Math.min(elapsed / duration, 1)
                const eased = 1 - Math.pow(1 - progress, 3)
                setCounters(prev => {
                  const next = [...prev]
                  next[i] = Math.round(stat.value * eased)
                  return next
                })
                if (progress < 1) requestAnimationFrame(animate)
              }
              setTimeout(animate, i * 200)
            })
          },
          once: true,
        })
      }

      // Timeline
      if (timelineRef.current) {
        gsap.fromTo(timelineRef.current.children,
          { opacity: 0, x: 30, scale: 0.95 },
          {
            opacity: 1, x: 0, scale: 1,
            duration: 0.6, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: timelineRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
          }
        )
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about-section"
      className="scene-section"
      style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(60px, 8vh, 120px) clamp(20px, 5vw, 80px)',
        background: 'transparent',
      }}
    >
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(400px, 100%), 1fr))',
        gap: '60px',
      }}>
        {/* Left column — Bio */}
        <div>
          <div ref={titleRef} className="gravity-target" style={{ marginBottom: 40 }}>
            <span className="font-label" style={{
              fontSize: 14,
              letterSpacing: '0.4em',
              color: 'rgba(0, 245, 255, 0.3)',
            }}>
              04 //
            </span>
            <h2 className="font-display" style={{
              fontSize: 'clamp(24px, 3vw, 42px)',
              fontWeight: 800,
              color: '#E8EAF0',
              textShadow: '0 0 30px rgba(0, 245, 255, 0.15)',
            }}>
              DOSSIER
            </h2>
          </div>

          {/* Bio lines */}
          <div ref={bioRef} className="gravity-target" style={{
            padding: 24,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(0, 245, 255, 0.08)',
            borderRadius: 12,
          }}>
            {bioLines.map((line, i) => (
              <div key={i} className="font-mono" style={{
                fontSize: 13,
                lineHeight: 1.8,
                color: line.startsWith('>') ? '#00F5FF' : 'rgba(232, 234, 240, 0.6)',
                fontWeight: line.startsWith('>') ? 600 : 400,
                minHeight: line === '' ? 16 : 'auto',
              }}>
                {line}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div ref={statsRef} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 16,
            marginTop: 32,
          }}>
            {stats.map((stat, i) => (
              <div key={stat.label} className="gravity-target" style={{
                padding: '20px 16px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 10,
                textAlign: 'center',
              }}>
                <div className="font-display" style={{
                  fontSize: 'clamp(24px, 3vw, 36px)',
                  fontWeight: 900,
                  color: stat.color,
                  textShadow: `0 0 20px ${stat.color}40`,
                }}>
                  {counters[i]}{stat.suffix}
                </div>
                <div className="font-label" style={{
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  color: 'rgba(232, 234, 240, 0.4)',
                  marginTop: 6,
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — Timeline */}
        <div>
          <div className="gravity-target" style={{ marginBottom: 40, marginTop: 60 }}>
            <span className="font-label" style={{
              fontSize: 14,
              letterSpacing: '0.4em',
              color: 'rgba(0, 245, 255, 0.3)',
            }}>
              TIMELINE //
            </span>
            <h3 className="font-display" style={{
              fontSize: 'clamp(18px, 2vw, 28px)',
              fontWeight: 700,
              color: '#E8EAF0',
            }}>
              THE JOURNEY
            </h3>
          </div>

          <div ref={timelineRef} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            position: 'relative',
          }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              left: 20,
              top: 0,
              bottom: 0,
              width: 1,
              background: 'linear-gradient(to bottom, rgba(0, 245, 255, 0.2), rgba(168, 85, 247, 0.2))',
            }} />

            {timeline.map((item, i) => (
              <div key={item.year} className="gravity-target" style={{
                display: 'flex',
                gap: 24,
                padding: '20px 0',
                paddingLeft: 0,
              }}>
                {/* Dot */}
                <div style={{
                  position: 'relative',
                  flexShrink: 0,
                  width: 40,
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: item.color,
                    boxShadow: `0 0 15px ${item.color}60`,
                    zIndex: 1,
                  }} />
                </div>

                {/* Content */}
                <div>
                  <div className="font-display" style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: item.color,
                    marginBottom: 4,
                  }}>
                    {item.year}
                  </div>
                  <div className="font-mono" style={{
                    fontSize: 13,
                    color: 'rgba(232, 234, 240, 0.6)',
                    lineHeight: 1.5,
                  }}>
                    {item.event}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

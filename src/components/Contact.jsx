import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const socialLinks = [
  { name: 'GITHUB', url: 'https://github.com/Pm1410', icon: '⟐', color: '#E8EAF0' },
  { name: 'LINKEDIN', url: 'https://www.linkedin.com/in/prateek-mukherjee-687298397', icon: '◆', color: '#00F5FF' },
  { name: 'EMAIL', url: 'mailto:prateekmukherjee111@gmail.com', icon: '◈', color: '#FF6B00' },
]

export default function Contact() {
  const sectionRef = useRef(null)
  const formRef = useRef(null)
  const titleRef = useRef(null)
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [terminalLines, setTerminalLines] = useState([
    '> AWAITING TRANSMISSION...',
    '> SECURE CHANNEL OPEN',
    '> TYPE YOUR MESSAGE BELOW',
  ])

  // GSAP entrance
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
          }
        )
      }
      if (formRef.current) {
        gsap.fromTo(formRef.current,
          { opacity: 0, y: 40, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 60%', toggleActions: 'play none none reverse' },
          }
        )
      }
    }, section)

    return () => ctx.revert()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setTerminalLines(prev => [
      ...prev,
      `> NAME: ${formState.name}`,
      `> MSG: ${formState.message.substring(0, 50)}...`,
      '> ENCRYPTING TRANSMISSION...',
      '> ████████████████ 100%',
      '> ✓ TRANSMISSION RECEIVED',
    ])
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormState({ name: '', email: '', message: '' })
    }, 4000)
  }

  const handleTerminalInput = (value) => {
    // Easter egg: typing "DROP" triggers gravity
    if (value.trim().toUpperCase() === 'DROP') {
      window.dispatchEvent(new CustomEvent('trigger-gravity'))
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact-section"
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
        maxWidth: 1000,
        margin: '0 auto',
      }}>
        <div ref={titleRef} className="gravity-target" style={{ marginBottom: 50, textAlign: 'center' }}>
          <span className="font-label" style={{
            fontSize: 14,
            letterSpacing: '0.4em',
            color: 'rgba(0, 245, 255, 0.3)',
          }}>
            05 //
          </span>
          <h2 className="font-display" style={{
            fontSize: 'clamp(24px, 4vw, 48px)',
            fontWeight: 800,
            color: '#E8EAF0',
            textShadow: '0 0 30px rgba(0, 245, 255, 0.15)',
          }}>
            ESTABLISH CONTACT
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))',
          gap: 40,
        }}>
          {/* Terminal form */}
          <div
            ref={formRef}
            className="gravity-target"
            style={{
              background: 'rgba(2, 4, 8, 0.8)',
              border: '1px solid rgba(0, 245, 255, 0.15)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {/* Terminal header */}
            <div style={{
              padding: '10px 16px',
              borderBottom: '1px solid rgba(0, 245, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5F56' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFBD2E' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27C93F' }} />
              <span className="font-mono" style={{ fontSize: 11, color: 'rgba(232, 234, 240, 0.4)', marginLeft: 8 }}>
                transmission_terminal
              </span>
            </div>

            {/* Terminal output */}
            <div style={{
              padding: '16px',
              maxHeight: 120,
              overflowY: 'auto',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
            }}>
              {terminalLines.map((line, i) => (
                <div key={i} style={{
                  color: line.includes('✓') ? '#39FF14' :
                         line.includes('████') ? '#FF6B00' :
                         'rgba(0, 245, 255, 0.6)',
                  marginBottom: 4,
                }}>
                  {line}
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: '0 16px 16px' }}>
              <div style={{ marginBottom: 12 }}>
                <label className="font-mono" style={{
                  fontSize: 11,
                  color: '#00F5FF',
                  display: 'block',
                  marginBottom: 4,
                }}>
                  {'>'} ENTER NAME:
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState(p => ({ ...p, name: e.target.value }))}
                  required
                  id="contact-name"
                  style={{
                    width: '100%',
                    background: 'rgba(0, 245, 255, 0.03)',
                    border: '1px solid rgba(0, 245, 255, 0.15)',
                    borderRadius: 6,
                    padding: '10px 12px',
                    color: '#E8EAF0',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 13,
                    outline: 'none',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(0, 245, 255, 0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0, 245, 255, 0.15)'}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label className="font-mono" style={{
                  fontSize: 11,
                  color: '#00F5FF',
                  display: 'block',
                  marginBottom: 4,
                }}>
                  {'>'} ENTER EMAIL:
                </label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState(p => ({ ...p, email: e.target.value }))}
                  required
                  id="contact-email"
                  style={{
                    width: '100%',
                    background: 'rgba(0, 245, 255, 0.03)',
                    border: '1px solid rgba(0, 245, 255, 0.15)',
                    borderRadius: 6,
                    padding: '10px 12px',
                    color: '#E8EAF0',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 13,
                    outline: 'none',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(0, 245, 255, 0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0, 245, 255, 0.15)'}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="font-mono" style={{
                  fontSize: 11,
                  color: '#00F5FF',
                  display: 'block',
                  marginBottom: 4,
                }}>
                  {'>'} ENTER MESSAGE:
                </label>
                <textarea
                  value={formState.message}
                  onChange={(e) => {
                    setFormState(p => ({ ...p, message: e.target.value }))
                    handleTerminalInput(e.target.value)
                  }}
                  required
                  id="contact-message"
                  rows={4}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 245, 255, 0.03)',
                    border: '1px solid rgba(0, 245, 255, 0.15)',
                    borderRadius: 6,
                    padding: '10px 12px',
                    color: '#E8EAF0',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 13,
                    outline: 'none',
                    resize: 'none',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(0, 245, 255, 0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0, 245, 255, 0.15)'}
                />
              </div>

              <button
                type="submit"
                id="contact-submit"
                className="magnetic-btn"
                disabled={submitted}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  background: submitted ? 'rgba(57, 255, 20, 0.1)' : 'rgba(0, 245, 255, 0.08)',
                  border: submitted ? '1px solid rgba(57, 255, 20, 0.3)' : '1px solid rgba(0, 245, 255, 0.3)',
                  borderRadius: 8,
                  color: submitted ? '#39FF14' : '#00F5FF',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 16,
                  letterSpacing: '0.3em',
                  cursor: submitted ? 'default' : 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                {submitted ? '✓ TRANSMITTED' : 'TRANSMIT ↗'}
              </button>
            </form>
          </div>

          {/* Social links */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            justifyContent: 'center',
          }}>
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="gravity-target magnetic-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '20px 24px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 12,
                  textDecoration: 'none',
                  transition: 'all 0.4s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${link.color}40`
                  e.currentTarget.style.boxShadow = `0 0 30px ${link.color}15`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <span style={{
                  fontSize: 24,
                  color: link.color,
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `${link.color}10`,
                  borderRadius: 8,
                }}>
                  {link.icon}
                </span>
                <div>
                  <div className="font-label" style={{
                    fontSize: 16,
                    letterSpacing: '0.2em',
                    color: link.color,
                  }}>
                    {link.name}
                  </div>
                  <div className="font-mono" style={{
                    fontSize: 11,
                    color: 'rgba(232, 234, 240, 0.4)',
                  }}>
                    {link.url.replace('https://', '').replace('mailto:', '')}
                  </div>
                </div>
                <span style={{
                  marginLeft: 'auto',
                  color: 'rgba(232, 234, 240, 0.3)',
                  fontSize: 18,
                }}>
                  ↗
                </span>
              </a>
            ))}

            {/* Hidden message */}
            <div className="font-mono gravity-target" style={{
              textAlign: 'center',
              marginTop: 20,
              fontSize: 11,
              color: 'rgba(232, 234, 240, 0.15)',
              lineHeight: 1.8,
            }}>
              // built with Three.js, GSAP, Matter.js<br />
              // and an unreasonable amount of caffeine<br />
              // © 2026 Prateek Mukherjee
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

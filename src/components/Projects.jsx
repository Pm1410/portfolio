import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: 'neuronova',
    name: 'NEURONOVA',
    desc: 'LGBM-based algorithmic trading bot with real-time market signal generation',
    tech: ['Python', 'LightGBM', 'Pandas', 'NumPy', 'Real-time Signals', 'FinTech'],
    github: 'https://github.com/Pm1410/Neuronova_V0.1.git',
    live: '#',
    color: '#FF6B00',
    colorRgb: '255, 107, 0',
    accent: 'amber',
    stat: '94.3%',
    statLabel: 'SIGNAL ACCURACY',
    visual: 'trading',
  },
  {
    id: 'sentronyx',
    name: 'SENTRONYX',
    desc: 'AI-powered intelligent code debugger and error resolution engine',
    tech: ['Python', 'LLM', 'AST Analysis', 'Code Intelligence', 'NLP', 'DevTools'],
    github: 'https://github.com/Pm1410/Sentronyx_V0.1.git',
    live: '#',
    color: '#39FF14',
    colorRgb: '57, 255, 20',
    accent: 'green',
    stat: '10K+',
    statLabel: 'BUGS RESOLVED',
    visual: 'code',
  },
  {
    id: 'erp-school',
    name: 'ERP SYSTEM',
    desc: 'Full-scale enterprise resource planning platform for educational institutions',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Full Stack', 'System Design', 'REST API'],
    github: 'https://github.com/Pm1410/ERPmanagement.git',
    live: '#',
    color: '#00F5FF',
    colorRgb: '0, 245, 255',
    accent: 'cyan',
    stat: '50+',
    statLabel: 'MODULES DEPLOYED',
    visual: 'dashboard',
  },
]

function TradingVisual({ color, canvasRef }) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.width = canvas.offsetWidth
    let H = canvas.height = canvas.offsetHeight
    let t = 0, animId

    const candles = []
    for (let i = 0; i < 30; i++) {
      candles.push({
        open: 50 + Math.random() * 40,
        close: 50 + Math.random() * 40,
        high: 70 + Math.random() * 30,
        low: 30 + Math.random() * 20,
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(2, 4, 8, 0.3)'
      ctx.fillRect(0, 0, W, H)
      t += 0.02
      const barW = W / 35

      candles.forEach((c, i) => {
        const x = i * barW + barW * 2
        const open = c.open + Math.sin(t + i * 0.3) * 10
        const close = c.close + Math.cos(t + i * 0.2) * 10
        const isUp = close > open
        const body = Math.abs(close - open)
        const top = Math.min(open, close)

        // Wick
        ctx.beginPath()
        ctx.moveTo(x + barW / 2, (c.low + Math.sin(t + i) * 5) * H / 100)
        ctx.lineTo(x + barW / 2, (c.high + Math.cos(t + i) * 5) * H / 100)
        ctx.strokeStyle = `rgba(${isUp ? '57, 255, 20' : '255, 50, 50'}, 0.5)`
        ctx.lineWidth = 1
        ctx.stroke()

        // Body
        ctx.fillStyle = isUp ? 'rgba(57, 255, 20, 0.6)' : 'rgba(255, 50, 50, 0.6)'
        ctx.fillRect(x + 2, top * H / 100, barW - 4, Math.max(body * H / 100, 2))

        // Signal pulse
        if (i === Math.floor(t * 2) % 30) {
          ctx.beginPath()
          ctx.arc(x + barW / 2, top * H / 100, 8 + Math.sin(t * 5) * 4, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255, 107, 0, ${0.5 + Math.sin(t * 5) * 0.3})`
          ctx.lineWidth = 2
          ctx.stroke()
        }
      })

      animId = requestAnimationFrame(animate)
    }
    animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [])
  return null
}

function CodeVisual({ canvasRef }) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.width = canvas.offsetWidth
    let H = canvas.height = canvas.offsetHeight
    let t = 0, animId

    const codeLines = [
      'def analyze_error(stack):', '  ast_tree = parse(code)',
      '  nodes = traverse(ast_tree)', '  anomalies = detect(nodes)',
      '  for bug in anomalies:', '    patch = resolve(bug)',
      '    apply_fix(patch)', '  return optimized_code',
      'class NeuralDebugger:', '  def __init__(self):',
      '    self.model = load_llm()', '  def scan(self, file):',
    ]

    const bugs = Array.from({ length: 5 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: 4 + Math.random() * 6,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random(),
    }))

    const animate = () => {
      ctx.fillStyle = 'rgba(2, 4, 8, 0.2)'
      ctx.fillRect(0, 0, W, H)
      t += 0.015

      // Draw code lines at various depths
      ctx.font = '11px JetBrains Mono'
      codeLines.forEach((line, i) => {
        const y = (i * 30 + t * 20) % (H + 40) - 20
        const depth = (Math.sin(i + t * 0.5) + 1) / 2
        ctx.globalAlpha = 0.15 + depth * 0.25
        ctx.fillStyle = '#39FF14'
        ctx.fillText(line, 20 + depth * 40, y)
      })
      ctx.globalAlpha = 1

      // Draw bugs (red anomalies)
      bugs.forEach(bug => {
        bug.x += Math.sin(t * bug.speed + bug.phase) * 1
        bug.y += Math.cos(t * bug.speed * 0.7 + bug.phase) * 0.8
        if (bug.x < 0) bug.x = W
        if (bug.x > W) bug.x = 0
        if (bug.y < 0) bug.y = H
        if (bug.y > H) bug.y = 0

        // Scan and fix effect
        const scanY = (t * 50) % H
        const nearScan = Math.abs(bug.y - scanY) < 30

        ctx.beginPath()
        ctx.arc(bug.x, bug.y, bug.size, 0, Math.PI * 2)
        ctx.fillStyle = nearScan ? '#39FF14' : `rgba(255, 50, 50, ${0.6 + Math.sin(t * 3) * 0.3})`
        ctx.fill()

        if (nearScan) {
          ctx.beginPath()
          ctx.arc(bug.x, bug.y, bug.size + 8, 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(57, 255, 20, 0.5)'
          ctx.lineWidth = 1
          ctx.stroke()
          ctx.font = '9px JetBrains Mono'
          ctx.fillStyle = '#39FF14'
          ctx.fillText('PATCHED', bug.x + 12, bug.y + 3)
        }
      })

      // Scan line
      const scanY = (t * 50) % H
      ctx.beginPath()
      ctx.moveTo(0, scanY)
      ctx.lineTo(W, scanY)
      ctx.strokeStyle = 'rgba(57, 255, 20, 0.3)'
      ctx.lineWidth = 1
      ctx.stroke()

      animId = requestAnimationFrame(animate)
    }
    animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [])
  return null
}

function DashboardVisual({ canvasRef }) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.width = canvas.offsetWidth
    let H = canvas.height = canvas.offsetHeight
    let t = 0, animId

    const rings = [
      { x: W * 0.25, y: H * 0.4, r: 35, progress: 0.87, color: '#00F5FF', label: 'ATTENDANCE' },
      { x: W * 0.5, y: H * 0.3, r: 40, progress: 0.93, color: '#39FF14', label: 'ACADEMICS' },
      { x: W * 0.75, y: H * 0.4, r: 35, progress: 0.76, color: '#FF6B00', label: 'FINANCE' },
    ]

    const modules = [
      { x: W * 0.2, y: H * 0.75, w: 60, h: 30, label: 'STUDENTS' },
      { x: W * 0.45, y: H * 0.8, w: 60, h: 30, label: 'FACULTY' },
      { x: W * 0.7, y: H * 0.75, w: 60, h: 30, label: 'REPORTS' },
    ]

    const animate = () => {
      ctx.fillStyle = 'rgba(2, 4, 8, 0.2)'
      ctx.fillRect(0, 0, W, H)
      t += 0.015

      // Draw progress rings
      rings.forEach((ring, i) => {
        const animProgress = ring.progress * Math.min(1, t * 0.5 - i * 0.15)

        // Background circle
        ctx.beginPath()
        ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
        ctx.lineWidth = 4
        ctx.stroke()

        // Progress arc
        ctx.beginPath()
        ctx.arc(ring.x, ring.y, ring.r, -Math.PI / 2, -Math.PI / 2 + animProgress * Math.PI * 2)
        ctx.strokeStyle = ring.color
        ctx.lineWidth = 4
        ctx.lineCap = 'round'
        ctx.stroke()

        // Percentage text
        ctx.font = 'bold 14px Orbitron'
        ctx.fillStyle = ring.color
        ctx.textAlign = 'center'
        ctx.fillText(Math.round(animProgress * 100) + '%', ring.x, ring.y + 5)

        // Label
        ctx.font = '8px JetBrains Mono'
        ctx.fillStyle = 'rgba(232, 234, 240, 0.5)'
        ctx.fillText(ring.label, ring.x, ring.y + ring.r + 15)
      })

      // Draw module cubes
      modules.forEach((mod, i) => {
        const offset = Math.sin(t + i) * 3
        ctx.fillStyle = 'rgba(0, 245, 255, 0.08)'
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.3)'
        ctx.lineWidth = 1
        ctx.fillRect(mod.x, mod.y + offset, mod.w, mod.h)
        ctx.strokeRect(mod.x, mod.y + offset, mod.w, mod.h)

        ctx.font = '8px JetBrains Mono'
        ctx.fillStyle = '#00F5FF'
        ctx.textAlign = 'center'
        ctx.fillText(mod.label, mod.x + mod.w / 2, mod.y + offset + mod.h / 2 + 3)
      })

      // Data streams between modules
      for (let i = 0; i < modules.length - 1; i++) {
        const a = modules[i]
        const b = modules[i + 1]
        ctx.beginPath()
        ctx.moveTo(a.x + a.w, a.y + a.h / 2)
        ctx.lineTo(b.x, b.y + b.h / 2)
        ctx.strokeStyle = `rgba(0, 245, 255, ${0.1 + Math.sin(t * 3 + i) * 0.1})`
        ctx.lineWidth = 1
        ctx.setLineDash([4, 4])
        ctx.stroke()
        ctx.setLineDash([])

        // Moving dot
        const dotProgress = (t * 0.3 + i * 0.3) % 1
        const dx = a.x + a.w + (b.x - a.x - a.w) * dotProgress
        const dy = a.y + a.h / 2
        ctx.beginPath()
        ctx.arc(dx, dy, 2, 0, Math.PI * 2)
        ctx.fillStyle = '#00F5FF'
        ctx.fill()
      }

      ctx.textAlign = 'start'
      animId = requestAnimationFrame(animate)
    }
    animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [])
  return null
}

function ProjectCard({ project, index }) {
  const cardRef = useRef(null)
  const canvasRef = useRef(null)
  const [count, setCount] = useState(0)
  
  // 3D Tilt State
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1500px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
  })
  // Glare State
  const [glareStyle, setGlareStyle] = useState({
    opacity: 0,
    background: `radial-gradient(circle at 50% 50%, rgba(${project.colorRgb}, 0.2) 0%, transparent 60%)`,
    transform: 'translate(-50%, -50%)'
  })

  // Animate stat counter
  useEffect(() => {
    const target = parseFloat(project.stat)
    if (isNaN(target)) {
      setTimeout(() => setCount(project.stat), 500)
      return
    }
    let start = 0
    const duration = 2000
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount((target * eased).toFixed(1) + '%')
      if (progress < 1) requestAnimationFrame(animate)
    }
    const timer = setTimeout(animate, 800 + index * 300)
    return () => clearTimeout(timer)
  }, [project.stat, index])

  // Holographic 3D Tilt Effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    // Calculate mouse position relative to card center (-1 to 1)
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    // Limits the rotation angle (e.g. max 15 degrees)
    const maxRotate = 15 
    const rotateX = ((y - centerY) / centerY) * -maxRotate
    const rotateY = ((x - centerX) / centerX) * maxRotate

    setTiltStyle({
      transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
    })

    // Dynamic Glare
    setGlareStyle({
      opacity: 1,
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(${project.colorRgb}, 0.3) 0%, transparent 50%)`,
    })
  }

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    })
    setGlareStyle({
      opacity: 0,
      background: `radial-gradient(circle at 50% 50%, rgba(${project.colorRgb}, 0) 0%, transparent 50%)`,
    })
    if (cardRef.current) {
      cardRef.current.style.borderColor = `rgba(${project.colorRgb}, 0.15)`
      cardRef.current.style.boxShadow = 'none'
    }
  }

  const handleMouseEnter = (e) => {
    e.currentTarget.style.borderColor = `rgba(${project.colorRgb}, 0.4)`
    e.currentTarget.style.boxShadow = `0 20px 50px -10px rgba(${project.colorRgb}, 0.3), inset 0 0 60px rgba(${project.colorRgb}, 0.05)`
  }

  return (
    <div
      ref={cardRef}
      className="gravity-target"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        flex: '0 0 min(450px, 85vw)',
        height: 'min(500px, 75vh)',
        background: `linear-gradient(135deg, rgba(${project.colorRgb}, 0.05), rgba(2, 4, 8, 0.95))`,
        border: `1px solid rgba(${project.colorRgb}, 0.15)`,
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        transition: 'border-color 0.4s, box-shadow 0.4s, transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        transformStyle: 'preserve-3d', // Necessary for 3D children
        ...tiltStyle
      }}
    >
      {/* Dynamic light glare layer */}
      <div 
        className="pointer-events-none"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          transition: 'opacity 0.4s',
          ...glareStyle
        }} 
      />
      {/* Portal label */}
      <div style={{
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span className="font-label" style={{
          fontSize: 14,
          letterSpacing: '0.3em',
          color: `rgba(${project.colorRgb}, 0.5)`,
        }}>
          PORTAL {String(index + 1).padStart(2, '0')}
        </span>
        <span style={{
          fontSize: 11,
          color: `rgba(${project.colorRgb}, 0.3)`,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          ● ACTIVE
        </span>
      </div>

      {/* Canvas visualization */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
          }}
        />
        {project.visual === 'trading' && <TradingVisual color={project.color} canvasRef={canvasRef} />}
        {project.visual === 'code' && <CodeVisual canvasRef={canvasRef} />}
        {project.visual === 'dashboard' && <DashboardVisual canvasRef={canvasRef} />}

        {/* Stat overlay */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <div className="font-display" style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 900,
            color: project.color,
            textShadow: `0 0 30px rgba(${project.colorRgb}, 0.5)`,
          }}>
            {count}
          </div>
          <div className="font-label" style={{
            fontSize: 12,
            letterSpacing: '0.3em',
            color: `rgba(${project.colorRgb}, 0.6)`,
            marginTop: 4,
          }}>
            {project.statLabel}
          </div>
        </div>
      </div>

      {/* Info section */}
      <div style={{ padding: '20px 24px' }}>
        <h3 className="font-display gravity-target" style={{
          fontSize: 'clamp(18px, 2.5vw, 28px)',
          fontWeight: 800,
          color: project.color,
          marginBottom: 8,
          textShadow: `0 0 20px rgba(${project.colorRgb}, 0.3)`,
        }}>
          {project.name}
        </h3>
        <p className="gravity-target" style={{
          fontSize: 13,
          color: 'rgba(232, 234, 240, 0.6)',
          lineHeight: 1.5,
          marginBottom: 16,
        }}>
          {project.desc}
        </p>

        {/* Tech tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {project.tech.map((t) => (
            <span key={t} className="gravity-target" style={{
              fontSize: 10,
              padding: '3px 10px',
              borderRadius: 999,
              border: `1px solid rgba(${project.colorRgb}, 0.2)`,
              color: `rgba(${project.colorRgb}, 0.7)`,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.05em',
            }}>
              {t}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="magnetic-btn gravity-target"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 0',
              border: `1px solid rgba(${project.colorRgb}, 0.3)`,
              borderRadius: 8,
              color: project.color,
              fontSize: 12,
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '0.15em',
              textDecoration: 'none',
              transition: 'all 0.3s',
              background: 'transparent',
            }}
          >
            GITHUB ↗
          </a>
          {/*  */}
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const ctx = gsap.context(() => {
      // Title entrance
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // Horizontal scroll
      const totalScrollWidth = track.scrollWidth - window.innerWidth
      gsap.to(track, {
        x: -totalScrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalScrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="projects-section"
      className="scene-section"
      style={{
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      {/* Section title */}
      <div
        ref={titleRef}
        className="gravity-target"
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          zIndex: 5,
        }}
      >
        <span className="font-label" style={{
          fontSize: 14,
          letterSpacing: '0.4em',
          color: 'rgba(0, 245, 255, 0.3)',
        }}>
          02 //
        </span>
        <h2 className="font-display" style={{
          fontSize: 'clamp(24px, 3vw, 42px)',
          fontWeight: 800,
          color: '#E8EAF0',
          textShadow: '0 0 30px rgba(0, 245, 255, 0.15)',
        }}>
          PROJECTS
        </h2>
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: 50,
          alignItems: 'center',
          height: '100vh',
          padding: '0 max(100px, 10vw)',
          width: 'fit-content',
        }}
      >
        {/* Spacer for title */}
        <div style={{ flex: '0 0 200px' }} />

        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}

        {/* End spacer */}
        <div style={{ flex: '0 0 100px' }} />
      </div>

      {/* Horizontal scroll progress bar */}
      <div style={{
        position: 'absolute',
        bottom: 30,
        left: '10%',
        width: '80%',
        height: 1,
        background: 'rgba(255, 255, 255, 0.05)',
      }}>
        <div
          className="projects-progress"
          style={{
            height: '100%',
            width: '0%',
            background: 'linear-gradient(90deg, #FF6B00, #39FF14, #00F5FF)',
            transition: 'width 0.1s',
          }}
        />
      </div>
    </section>
  )
}

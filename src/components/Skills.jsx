import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// UPDATED: All specific technologies from the projects
const skillData = [
  // ML / Python Stack (Neuronova & Sentronyx)
  { name: 'Python', cluster: 'ml', color: '#FF6B00', size: 1.3, proficiency: 95 },
  { name: 'LightGBM', cluster: 'ml', color: '#FF6B00', size: 1.1, proficiency: 92 },
  { name: 'TensorFlow', cluster: 'ml', color: '#FF6B00', size: 1.1, proficiency: 88 },
  { name: 'Pandas', cluster: 'ml', color: '#FF6B00', size: 1.0, proficiency: 94 },
  { name: 'NumPy', cluster: 'ml', color: '#FF6B00', size: 0.9, proficiency: 90 },
  { name: 'Scikit-Learn', cluster: 'ml', color: '#FF6B00', size: 0.9, proficiency: 85 },
  { name: 'PyTorch', cluster: 'ml', color: '#FF6B00', size: 0.85, proficiency: 80 },

  // Frontend / Web (ERP System & Portfolios)
  { name: 'JavaScript', cluster: 'frontend', color: '#00F5FF', size: 1.2, proficiency: 96 },
  { name: 'React', cluster: 'frontend', color: '#00F5FF', size: 1.2, proficiency: 95 },
  { name: 'HTML5', cluster: 'frontend', color: '#00F5FF', size: 1.0, proficiency: 98 },
  { name: 'CSS3', cluster: 'frontend', color: '#00F5FF', size: 1.0, proficiency: 95 },
  { name: 'Three.js / WebGL', cluster: 'frontend', color: '#00F5FF', size: 0.9, proficiency: 85 },
  { name: 'Tailwind CSS', cluster: 'frontend', color: '#00F5FF', size: 1.1, proficiency: 92 },

  // Backend / Infrastructure
  { name: 'Node.js', cluster: 'backend', color: '#39FF14', size: 1.1, proficiency: 90 },
  { name: 'Express', cluster: 'backend', color: '#39FF14', size: 1.0, proficiency: 92 },
  { name: 'REST APIs', cluster: 'backend', color: '#39FF14', size: 1.1, proficiency: 95 },
  { name: 'PostgreSQL', cluster: 'backend', color: '#39FF14', size: 0.9, proficiency: 85 },
  { name: 'MongoDB', cluster: 'backend', color: '#39FF14', size: 0.9, proficiency: 88 },
  { name: 'WebSocket / Real-time', cluster: 'backend', color: '#39FF14', size: 0.85, proficiency: 82 },

  // Tools & Platforms
  { name: 'Git / GitHub', cluster: 'tools', color: '#A855F7', size: 1.1, proficiency: 94 },
  { name: 'Docker', cluster: 'tools', color: '#A855F7', size: 0.9, proficiency: 80 },
  { name: 'Vercel / Hosting', cluster: 'tools', color: '#A855F7', size: 0.9, proficiency: 90 },
  { name: 'VS Code', cluster: 'tools', color: '#A855F7', size: 1.0, proficiency: 98 },
  { name: 'Linux / Bash', cluster: 'tools', color: '#A855F7', size: 0.9, proficiency: 85 },
]

const clusterCenters = {
  ml: { x: 0.25, y: 0.45 },
  frontend: { x: 0.75, y: 0.45 },
  backend: { x: 0.25, y: 0.80 },
  tools: { x: 0.75, y: 0.80 },
}

const clusterLabels = {
  ml: '🟡 AI / ML CORE',
  frontend: '🔵 FRONTEND STACK',
  backend: '🟢 BACKEND ARCHITECTURE',
  tools: '🟣 DEVOPS & TOOLS',
}

export default function Skills() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null) // Restored canvas ref
  const titleRef = useRef(null)

  // Restored Canvas Force-Directed Graph logic with transparent background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H, animId
    let mouseX = -100, mouseY = -100
    let hoveredNode = null
    let time = 0

    const resize = () => {
      // Use window inner dimensions, offset parent might be 0 until mounted
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Wait a tick to ensure we have valid width/height
    setTimeout(resize, 0)
    
    // Initialize nodes with positions
    const nodes = skillData.map((skill, i) => {
      const center = clusterCenters[skill.cluster]
      const angle = (i * 2.4 + Math.random() * 1.5)
      const radius = 60 + Math.random() * 80
      return {
        ...skill,
        x: center.x * W + Math.cos(angle) * radius,
        y: center.y * H + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        targetX: center.x * W + Math.cos(angle) * radius,
        targetY: center.y * H + Math.sin(angle) * radius,
        radius: skill.size * 28, // Made nodes larger
        hovered: false,
        pulsePhase: Math.random() * Math.PI * 2,
      }
    })

    // Create connections within clusters
    const connections = []
    nodes.forEach((a, i) => {
      nodes.forEach((b, j) => {
        if (i < j && a.cluster === b.cluster) {
          connections.push({ from: i, to: j })
        }
      })
    })

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', () => { mouseX = -100; mouseY = -100 })

    const animate = () => {
      ctx.clearRect(0, 0, W, H) // crucial: perfectly transparent clear
      time += 0.01

      hoveredNode = null

      // Update node positions (spring physics)
      nodes.forEach(node => {
        // Gentle spring to target layout position
        const dx = node.targetX - node.x
        const dy = node.targetY - node.y
        node.vx += dx * 0.04  // Stronger spring so they snap back quicker
        node.vy += dy * 0.04

        // Mouse interaction - Very gentle magnetic pull when close, no harsh repulsion
        const mx = mouseX - node.x
        const my = mouseY - node.y
        const md = Math.sqrt(mx * mx + my * my)
        
        if (md < node.radius + 15) {
          hoveredNode = node
          node.hovered = true
          // Very slight magnetic pull towards mouse when hovering
          node.vx += (mx / md) * 0.5
          node.vy += (my / md) * 0.5
        } else {
          node.hovered = false
          // Extremely subtle repulsion only when mouse is nearby but not hovering
          if (md < 120) {
            node.vx -= (mx / md) * 0.4
            node.vy -= (my / md) * 0.4
          }
        }

        // Floating
        node.vy += Math.sin(time * 2 + node.pulsePhase) * 0.1

        // Damping
        node.vx *= 0.9
        node.vy *= 0.9
        node.x += node.vx
        node.y += node.vy
      })

      // Draw connections
      connections.forEach(conn => {
        const a = nodes[conn.from]
        const b = nodes[conn.to]
        const d = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
        if (d < 200) {
          const alpha = (1 - d / 200) * 0.2
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)

          const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
          gradient.addColorStop(0, `rgba(${hexToRgb(a.color)}, ${alpha})`)
          gradient.addColorStop(1, `rgba(${hexToRgb(b.color)}, ${alpha})`)
          ctx.strokeStyle = gradient
          ctx.lineWidth = 1
          ctx.stroke()

          // Energy pulse along connection
          const pulsePos = (time * 0.5 + conn.from * 0.1) % 1
          const px = a.x + (b.x - a.x) * pulsePos
          const py = a.y + (b.y - a.y) * pulsePos
          ctx.beginPath()
          ctx.arc(px, py, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${hexToRgb(a.color)}, ${alpha * 3})`
          ctx.fill()
        }
      })

      // Draw nodes
      nodes.forEach(node => {
        const pulse = Math.sin(time * 3 + node.pulsePhase) * 0.1 + 1
        const r = node.radius * (node.hovered ? 1.15 : pulse) // Less dramatic scaling

        // Premium Outer glow
        const glowGrad = ctx.createRadialGradient(node.x, node.y, r * 0.8, node.x, node.y, r * 3)
        glowGrad.addColorStop(0, `rgba(${hexToRgb(node.color)}, ${node.hovered ? 0.3 : 0.15})`)
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.beginPath()
        ctx.arc(node.x, node.y, r * 3, 0, Math.PI * 2)
        ctx.fillStyle = glowGrad
        ctx.fill()

        // Deep glassy core 
        ctx.beginPath()
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(5, 10, 20, ${node.hovered ? 0.9 : 0.6})` // Solid dark core to block stars
        ctx.fill()
        
        ctx.beginPath()
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${hexToRgb(node.color)}, ${node.hovered ? 0.2 : 0.05})`
        ctx.fill()
        
        ctx.strokeStyle = `rgba(${hexToRgb(node.color)}, ${node.hovered ? 1.0 : 0.4})`
        ctx.lineWidth = node.hovered ? 2.5 : 1
        ctx.stroke()

        // Node label - Larger, crisper text
        ctx.font = `${node.hovered ? '600' : '400'} ${node.hovered ? '15px' : '13px'} 'JetBrains Mono', monospace`
        ctx.fillStyle = node.hovered ? '#FFFFFF' : `rgba(232, 234, 240, 0.9)`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        // Add text shadow for readability over background
        ctx.shadowColor = 'rgba(0,0,0,0.8)'
        ctx.shadowBlur = 4
        ctx.fillText(node.name, node.x, node.y)
        ctx.shadowBlur = 0 // reset

        // Cinematic Proficiency bar on hover
        if (node.hovered) {
          const barW = r * 1.5
          const barH = 5
          const barX = node.x - barW / 2
          const barY = node.y + r + 15

          // Bar background path
          ctx.beginPath()
          ctx.lineCap = 'round'
          ctx.moveTo(barX, barY)
          ctx.lineTo(barX + barW, barY)
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
          ctx.lineWidth = barH
          ctx.stroke()

          // Bar fill path
          ctx.beginPath()
          ctx.moveTo(barX, barY)
          ctx.lineTo(barX + (barW * node.proficiency / 100), barY)
          ctx.strokeStyle = node.color
          ctx.lineWidth = barH
          ctx.stroke()

          ctx.font = '600 11px JetBrains Mono'
          ctx.fillStyle = node.color
          ctx.fillText(node.proficiency + '%', node.x, barY + 18)
        }
      })

      // Draw cluster labels
      Object.entries(clusterCenters).forEach(([cluster, center]) => {
        ctx.font = "16px 'Bebas Neue', sans-serif"
        ctx.fillStyle = 'rgba(232, 234, 240, 0.4)'
        ctx.textAlign = 'center'
        ctx.fillText(clusterLabels[cluster], center.x * W, center.y * H - 120)
      })

      ctx.textAlign = 'start'
      ctx.textBaseline = 'alphabetic'
      animId = requestAnimationFrame(animate)
    }
    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // GSAP scroll animation for title
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1,
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
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="skills-section"
      className="scene-section gravity-container" // added gravity-container so physics targets it
      style={{ height: '100vh', position: 'relative', background: 'transparent' }}
    >
      <div
        ref={titleRef}
        className="gravity-target"
        style={{
          position: 'absolute',
          top: '10vh',
          left: '5vw',
          zIndex: 5,
        }}
      >
        <span className="font-label gravity-target" style={{
          fontSize: 14,
          letterSpacing: '0.4em',
          color: 'rgba(0, 245, 255, 0.5)',
        }}>
          03 //
        </span>
        <h2 className="font-display gravity-target" style={{
          fontSize: 'clamp(32px, 5vw, 64px)',
          fontWeight: 800,
          color: '#E8EAF0',
          lineHeight: 1,
          textShadow: '0 0 30px rgba(0, 245, 255, 0.2)',
        }}>
          SKILL MATRIX
        </h2>
      </div>

      {/* The restored interactive graph canvas */}
      <canvas
        ref={canvasRef}
        className="gravity-target"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          zIndex: 2, // Must be above background, below mouse events if needed (it captures mouse via addEventListener)
        }}
      />
    </section>
  )
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '255, 255, 255'
}

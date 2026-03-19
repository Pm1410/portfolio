import { useCallback, useRef } from 'react'
import Matter from 'matter-js'
import gsap from 'gsap'
import useStore from '../store/useStore'
import AudioService from './useAudio'

export default function useGravity() {
  const setGravityActive = useStore((s) => s.setGravityActive)
  const engineRef = useRef(null)
  const bodiesRef = useRef([])
  const clonesRef = useRef([])
  const origRectsRef = useRef([])
  const mouseConstraintRef = useRef(null)
  const renderLoopRef = useRef(null)
  const { playThud, playWhoosh } = AudioService

  const activateGravity = useCallback(() => {
    if (engineRef.current) return

    // Stop smooth scroll
    if (window.__lenis) window.__lenis.stop()

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 2.5 } })
    engineRef.current = engine

    const W = window.innerWidth
    const H = window.innerHeight

    // Create walls
    const walls = [
      Matter.Bodies.rectangle(W / 2, H + 30, W + 100, 60, { isStatic: true }),
      Matter.Bodies.rectangle(-30, H / 2, 60, H + 100, { isStatic: true }),
      Matter.Bodies.rectangle(W + 30, H / 2, 60, H + 100, { isStatic: true }),
      Matter.Bodies.rectangle(W / 2, -30, W + 100, 60, { isStatic: true }),
    ]
    Matter.Composite.add(engine.world, walls)

    // Grab DOM elements
    const selectors = '.gravity-target'
    const elements = document.querySelectorAll(selectors)
    const rects = []
    const clones = []
    const bodies = []

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.width < 5 || rect.height < 5) return
      rects.push({ el, rect: { ...rect, top: rect.top, left: rect.left, width: rect.width, height: rect.height } })

      const clone = el.cloneNode(true)
      clone.style.position = 'fixed'
      clone.style.left = rect.left + 'px'
      clone.style.top = rect.top + 'px'
      clone.style.width = rect.width + 'px'
      clone.style.height = rect.height + 'px'
      clone.style.margin = '0'
      clone.style.zIndex = '10000'
      clone.style.pointerEvents = 'auto'
      clone.style.transformOrigin = 'center center'
      clone.classList.add('gravity-clone')
      document.body.appendChild(clone)
      clones.push(clone)

      el.style.visibility = 'hidden'

      const body = Matter.Bodies.rectangle(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        rect.width,
        rect.height,
        {
          restitution: 0.4,
          friction: 0.3,
          frictionAir: 0.01,
          density: 0.002,
        }
      )
      bodies.push(body)
      Matter.Composite.add(engine.world, body)
    })

    bodiesRef.current = bodies
    clonesRef.current = clones
    origRectsRef.current = rects

    // Mouse constraint for drag
    const mouse = Matter.Mouse.create(document.body)
    mouse.pixelRatio = window.devicePixelRatio || 1
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    })
    Matter.Composite.add(engine.world, mouseConstraint)
    mouseConstraintRef.current = mouseConstraint

    // Play thud
    playThud()

    // Render loop
    const runner = () => {
      Matter.Engine.update(engine, 1000 / 60)
      bodies.forEach((body, i) => {
        const clone = clones[i]
        if (clone) {
          const w = parseFloat(clone.style.width)
          const h = parseFloat(clone.style.height)
          clone.style.left = (body.position.x - w / 2) + 'px'
          clone.style.top = (body.position.y - h / 2) + 'px'
          clone.style.transform = `rotate(${body.angle}rad)`
        }
      })
      renderLoopRef.current = requestAnimationFrame(runner)
    }
    renderLoopRef.current = requestAnimationFrame(runner)
    setGravityActive(true)
  }, [setGravityActive, playThud])

  const restoreGravity = useCallback(() => {
    if (!engineRef.current) return
    cancelAnimationFrame(renderLoopRef.current)

    playWhoosh()

    const clones = clonesRef.current
    const rects = origRectsRef.current

    clones.forEach((clone, i) => {
      const orig = rects[i]
      if (!orig) return
      gsap.to(clone, {
        left: orig.rect.left,
        top: orig.rect.top,
        rotation: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        delay: i * 0.02,
        onComplete: () => {
          orig.el.style.visibility = 'visible'
          clone.remove()
        },
      })
    })

    // Cleanup Matter
    setTimeout(() => {
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current)
        engineRef.current = null
      }
      bodiesRef.current = []
      clonesRef.current = []
      origRectsRef.current = []
      mouseConstraintRef.current = null
      setGravityActive(false)
      if (window.__lenis) window.__lenis.start()
    }, 1200)
  }, [setGravityActive, playWhoosh])

  return { activateGravity, restoreGravity }
}

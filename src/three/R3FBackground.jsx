import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { Vector2, MathUtils, Vector3 } from 'three'
import useStore from '../store/useStore'
import NeuralNetwork from './NeuralNetwork'

function Starfield() {
  const starsRef = useRef()
  const mouseNormX = useStore(s => s.mouseNormX)
  const mouseNormY = useStore(s => s.mouseNormY)
  const scrollVelocity = useStore(s => s.scrollVelocity)
  const gravityActive = useStore(s => s.gravityActive) // Fixed: was gravityMode

  const count = 5000 // Dense starfield

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const siz = new Float32Array(count)

    // Realistic star colors (O, B, A, F, G, K, M spectral classes approximated)
    const starColors = [
      new Vector3(0.6, 0.7, 1.0), // O/B: Hot blue
      new Vector3(0.8, 0.9, 1.0), // A: White-blue
      new Vector3(1.0, 1.0, 1.0), // F: Pure white
      new Vector3(1.0, 0.9, 0.7), // G/K: Yellow-white
      new Vector3(1.0, 0.6, 0.4), // M: Red dwarf
    ]

    for (let i = 0; i < count; i++) {
      // Cylinder distribution around camera for optimal fly-through
      const r = 50 + Math.pow(Math.random(), 1.5) * 800 // Pushed out from center
      const theta = 2 * Math.PI * Math.random()
      const z = (Math.random() - 0.5) * 2000 // Deep Z box

      pos[i * 3] = r * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(theta)
      pos[i * 3 + 2] = z

      // Bias toward white/yellow, less blue/red
      const colorRoll = Math.random()
      let colorIndex = 2 // default white
      if (colorRoll < 0.1) colorIndex = 0 // blue
      else if (colorRoll < 0.3) colorIndex = 1 // light blue
      else if (colorRoll < 0.7) colorIndex = 2 // white
      else if (colorRoll < 0.9) colorIndex = 3 // yellow
      else colorIndex = 4 // red

      const color = starColors[colorIndex]
      // Vary brightness
      const brightness = 0.5 + Math.random() * 0.5
      col[i * 3]     = color.x * brightness
      col[i * 3 + 1] = color.y * brightness
      col[i * 3 + 2] = color.z * brightness

      // Vary sizes mostly small, few large
      siz[i] = Math.pow(Math.random(), 4) * 2.0 + 0.3
    }
    return [pos, col, siz]
  }, [])

  useFrame((state, delta) => {
    if (!starsRef.current) return
    const time = state.clock.elapsedTime
    
    // Slow universe rotation + slight mouse parallax
    starsRef.current.rotation.z = time * 0.02
    starsRef.current.rotation.x = mouseNormY * 0.1
    starsRef.current.rotation.y = mouseNormX * 0.1

    const positions = starsRef.current.geometry.attributes.position.array
    // Base speed + massive speed burst when scrolling (warp effect)
    const speed = 20 * delta + (scrollVelocity * 4)

    // Black Hole target (mouse position mapped roughly to 3D space at Z=0)
    const targetX = mouseNormX * 800
    const targetY = mouseNormY * 500

    for (let i = 0; i < count; i++) {
      let x = positions[i * 3]
      let y = positions[i * 3 + 1]
      let z = positions[i * 3 + 2]
      
      z += speed
      
      // Black hole physics: if gravityActive is active, bend stars towards mouse
      if (gravityActive) {
        const dx = targetX - x
        const dy = targetY - y
        // Distance squared for realistic gravity falloff
        const distSq = dx * dx + dy * dy + (z * z * 0.1) 
        
        // Prevent singularity explosion dividing by zero
        if (distSq > 100) {
          const force = 5000000 / distSq // Gravitational constant * Mass
          x += (dx / Math.sqrt(distSq)) * force * delta
          y += (dy / Math.sqrt(distSq)) * force * delta
          // Pull them slightly backwards into the hole
          z += ((0 - z) / Math.sqrt(distSq)) * force * delta 
        }
      } else {
        // Slowly relax back to cylinder if gravity is off (prevent them staying clamped)
        // A simple radial push outward if they got sucked in too close to center Z axis
        const radialDist = Math.sqrt(x*x + y*y)
        if (radialDist < 50) {
           x += (x / radialDist) * 100 * delta
           y += (y / radialDist) * 100 * delta
        }
      }

      // Infinite loop: recycle stars when they pass the camera
      if (z > 200) {
        z -= 2000
        // Randomize X/Y on respawn so they don't form clumps after black hole releases
        if (gravityActive) {
           const r = 50 + Math.pow(Math.random(), 1.5) * 800
           const theta = 2 * Math.PI * Math.random()
           x = r * Math.cos(theta)
           y = r * Math.sin(theta)
        }
      } else if (z < -1800) {
        z += 2000
      }
      
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }
    starsRef.current.geometry.attributes.position.needsUpdate = true

    // Update Shader Uniforms
    if (starsRef.current.material.uniforms) {
      starsRef.current.material.uniforms.uTime.value = time
      starsRef.current.material.uniforms.uMouse.value.set(mouseNormX, mouseNormY)
      starsRef.current.material.uniforms.uGravity.value = gravityActive ? 1 : 0
    }
  })

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={2} // Additive blending
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new Vector2(0, 0) },
          uGravity: { value: 0 }
        }}
        vertexShader={`
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          varying float vDistToMouse;
          uniform vec2 uMouse;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            
            // Project mouse to screen space for proximity
            vec4 projectedMouse = projectionMatrix * modelViewMatrix * vec4(uMouse.x * 800.0, uMouse.y * 500.0, 0.0, 1.0);
            vDistToMouse = distance(mvPosition.xy, projectedMouse.xy);

            gl_PointSize = size * (800.0 / -mvPosition.z); 
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          varying float vDistToMouse;
          uniform float uTime;
          void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            if (d > 0.5) discard;
            
            // Flashlight / Nova effect: Stars near mouse glow 3x brighter
            float light = smoothstep(400.0, 50.0, vDistToMouse);
            float alpha = smoothstep(0.5, 0.1, d);
            
            vec3 core = vColor * (1.0 + pow(1.0 - d*2.0, 4.0) * 1.5 + light * 4.0);
            gl_FragColor = vec4(core, alpha);
          }
        `}
      />
    </points>
  )
}

function DeepNebulas() {
  const numNebulas = 40
  const nebulaRef = useRef()
  const scrollVelocity = useStore(s => s.scrollVelocity)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(numNebulas * 3)
    const col = new Float32Array(numNebulas * 3)
    
    // Cosmic Nebula palettes
    const baseColors = [
      new Vector3(0.05, 0.0, 0.15), // Deep space purple
      new Vector3(0.0, 0.1, 0.15),  // Deep cyan/blue
      new Vector3(0.15, 0.02, 0.02) // Distant red nebula
    ]

    for (let i = 0; i < numNebulas; i++) {
      // Much further away and larger
      const r = 300 + Math.random() * 800
      const theta = 2 * Math.PI * Math.random()
      const z = (Math.random() - 0.5) * 3000

      pos[i * 3] = r * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(theta)
      pos[i * 3 + 2] = z

      const c = baseColors[Math.floor(Math.random() * baseColors.length)]
      col[i*3] = c.x
      col[i*3+1] = c.y
      col[i*3+2] = c.z
    }
    return [pos, col]
  }, [])

  useFrame((state, delta) => {
    if (!nebulaRef.current) return
    const positions = nebulaRef.current.geometry.attributes.position.array
    // Nebulas move slower to simulate immense distance (parallax)
    const speed = 5 * delta + (scrollVelocity * 1)

    for(let i=0; i<numNebulas; i++) {
      let z = positions[i*3+2]
      z += speed
      if (z > 500) z -= 3500
      else if (z < -3000) z += 3500
      positions[i*3+2] = z
    }
    nebulaRef.current.geometry.attributes.position.needsUpdate = true
    nebulaRef.current.rotation.z = state.clock.elapsedTime * 0.005
  })

  return (
    <points ref={nebulaRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={numNebulas} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={numNebulas} array={colors} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={2}
        vertexShader={`
          attribute vec3 color;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = 40000.0 / -mvPosition.z; // Absolutely massive
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          void main() {
            vec2 uv = gl_PointCoord - vec2(0.5);
            float d = length(uv);
            if (d > 0.5) discard;
            // Extremely soft, almost imperceptible glowing clouds
            float alpha = smoothstep(0.5, 0.0, d) * 0.6;
            gl_FragColor = vec4(vColor, alpha);
          }
        `}
      />
    </points>
  )
}

export default function R3FBackground() {
  const scrollVelocity = useStore(s => s.scrollVelocity)
  const gravityActive = useStore(s => s.gravityActive)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: '#000000' }}>
      <Canvas camera={{ position: [0, 0, 0], fov: 60 }} dpr={[1, 1.5]}>
        {/* Absolute void black background */}
        <color attach="background" args={['#000000']} />
        
        {/* Core Universe */}
        <DeepNebulas />
        <Starfield />
        <NeuralNetwork />

        {/* Global Cinematic Post-Processing Pipeline - OPTIMIZED */}
        <EffectComposer disableNormalPass multisampling={0}>
          {/* Subtle Bloom to make stars pop, but optimized */}
          <Bloom
            luminanceThreshold={0.5} // Only brightest stars glow
            luminanceSmoothing={0.9}
            intensity={gravityActive ? 4.0 : 1.5} // More glow during gravity
            mipmapBlur={false}
          />

          {/* Warp speed RGB trailing effect when scrolling fast */}
          <ChromaticAberration
            offset={new Vector2(
              Math.min(scrollVelocity * 0.0003, 0.015) + (gravityActive ? 0.02 : 0),
              Math.min(scrollVelocity * 0.0003, 0.015) + (gravityActive ? 0.01 : 0)
            )}
            radialModulation={true}
            modulationOffset={0.6}
          />
        </EffectComposer>
      </Canvas>
      
      {/* Absolute dark radial gradient to focus center */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.85) 100%)'
      }} />
    </div>
  )
}

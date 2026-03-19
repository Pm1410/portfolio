import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../store/useStore'

export default function NeuralNetwork() {
  const pointsRef = useRef()
  const linesRef = useRef()
  const mouseNormX = useStore(s => s.mouseNormX)
  const mouseNormY = useStore(s => s.mouseNormY)
  
  const count = 80 // Slightly reduced for better mobile performance
  const maxDistance = 140
  
  // Pre-allocate buffers for points
  const [positions, velocities, nodeSizes] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    const siz = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 500
      pos[i * 3 + 1] = (Math.random() - 0.5) * 500
      pos[i * 3 + 2] = (Math.random() - 0.5) * 500
      
      vel[i * 3] = (Math.random() - 0.5) * 0.4
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.4
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.4
      
      siz[i] = Math.random() * 2 + 1
    }
    return [pos, vel, siz]
  }, [])

  // Pre-allocate buffers for lines - max connections count * 8 (conservative)
  const maxLines = 400
  const [lineCoords, lineColors] = useMemo(() => {
    return [
      new Float32Array(maxLines * 2 * 3), // 2 points per line, 3 coords per point
      new Float32Array(maxLines * 2 * 4)  // 2 points per line, 4 colors per point
    ]
  }, [])

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return
    const pos = pointsRef.current.geometry.attributes.position.array
    const targetX = mouseNormX * 250
    const targetY = mouseNormY * 250
    
    // 1. Update point positions
    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i * 3]
      pos[i * 3 + 1] += velocities[i * 3 + 1]
      pos[i * 3 + 2] += velocities[i * 3 + 2]
      
      if (Math.abs(pos[i * 3]) > 250) velocities[i * 3] *= -1
      if (Math.abs(pos[i * 3 + 1]) > 250) velocities[i * 3 + 1] *= -1
      if (Math.abs(pos[i * 3 + 2]) > 250) velocities[i * 3 + 2] *= -1
      
      const dx = targetX - pos[i * 3]
      const dy = targetY - pos[i * 3 + 1]
      const d2 = dx * dx + dy * dy
      if (d2 < 20000) { // faster dist check sq
        const dist = Math.sqrt(d2)
        pos[i * 3] += (dx / dist) * 0.4
        pos[i * 3 + 1] += (dy / dist) * 0.4
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // 2. Update lines without new allocations
    let lineIdx = 0
    let colorIdx = 0
    let activeLines = 0
    
    for (let i = 0; i < count && activeLines < maxLines; i++) {
        for (let j = i + 1; j < count && activeLines < maxLines; j++) {
            const dx = pos[i * 3] - pos[j * 3]
            const dy = pos[i * 3 + 1] - pos[j * 3 + 1]
            const dz = pos[i * 3 + 2] - pos[j * 3 + 2]
            const dSq = dx * dx + dy * dy + dz * dz
            
            if (dSq < maxDistance * maxDistance) {
                const d = Math.sqrt(dSq)
                const alpha = (1 - d / maxDistance) * 0.2
                
                lineCoords[lineIdx++] = pos[i * 3]; lineCoords[lineIdx++] = pos[i * 3 + 1]; lineCoords[lineIdx++] = pos[i * 3 + 2]
                lineCoords[lineIdx++] = pos[j * 3]; lineCoords[lineIdx++] = pos[j * 3 + 1]; lineCoords[lineIdx++] = pos[j * 3 + 2]
                
                lineColors[colorIdx++] = 0; lineColors[colorIdx++] = 0.96; lineColors[colorIdx++] = 1; lineColors[colorIdx++] = alpha
                lineColors[colorIdx++] = 0; lineColors[colorIdx++] = 0.96; lineColors[colorIdx++] = 1; lineColors[colorIdx++] = alpha
                
                activeLines++
            }
        }
    }
    
    const linesGeo = linesRef.current.geometry
    linesGeo.attributes.position.needsUpdate = true
    linesGeo.attributes.color.needsUpdate = true
    linesGeo.setDrawRange(0, activeLines * 2)
  })

  return (
    <group rotation={[0.4, 0.4, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={count} array={nodeSizes} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial 
          transparent
          vertexShader={`
            attribute float size;
            void main() {
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            void main() {
              float d = distance(gl_PointCoord, vec2(0.5));
              if (d > 0.5) discard;
              gl_FragColor = vec4(0.0, 0.96, 1.0, smoothstep(0.5, 0.2, d));
            }
          `}
        />
      </points>
      
      <lineSegments ref={linesRef}>
        <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={maxLines * 2} array={lineCoords} itemSize={3} usage={THREE.DynamicDrawUsage} />
            <bufferAttribute attach="attributes-color" count={maxLines * 2} array={lineColors} itemSize={4} usage={THREE.DynamicDrawUsage} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  )
}

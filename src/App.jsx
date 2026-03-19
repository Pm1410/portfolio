import { Suspense, lazy } from 'react'
import useMousePosition from './hooks/useMousePosition'
import useScrollProgress from './hooks/useScrollProgress'
import useLenis from './hooks/useLenis'
import Cursor from './components/Cursor'
import Preloader from './components/Preloader'
import AudioEngine from './components/AudioEngine'
import GravityMode from './components/GravityMode'
import R3FBackground from './three/R3FBackground'
import AudioService from './hooks/useAudio'
import Hero from './components/Hero'

const Projects = lazy(() => import('./components/Projects'))
const Skills = lazy(() => import('./components/Skills'))
const About = lazy(() => import('./components/About'))
const Contact = lazy(() => import('./components/Contact'))
const CommandPalette = lazy(() => import('./components/CommandPalette'))

function LoadingFallback() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#010204',
    }}>
      <div className="font-mono animate-pulse" style={{
        color: 'rgba(0, 245, 255, 0.4)',
        fontSize: 14,
        letterSpacing: '0.3em',
      }}>
        INITIALIZING RENDERING ENGINE...
      </div>
    </div>
  )
}

export default function App() {
  useLenis()
  useMousePosition()
  useScrollProgress()

  return (
    <div onClick={() => AudioService.initAudio()}>
      <Preloader />
      <Cursor />
      <AudioEngine />
      <GravityMode />
      <Suspense fallback={null}>
        <CommandPalette />
      </Suspense>

      {/* The Global Cinematic R3F System */}
      <Suspense fallback={null}>
        <R3FBackground />
      </Suspense>

      {/* Subtly overlay UI scanlines on top of 3D for texture */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9996,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px)',
        opacity: 0.5
      }} />
      
      <div className="scanline-glitch" />

      <main style={{ position: 'relative', zIndex: 10 }}>
        <Suspense fallback={<LoadingFallback />}>
          <Hero />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <Projects />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <Skills />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <About />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <Contact />
        </Suspense>
      </main>
    </div>
  )
}

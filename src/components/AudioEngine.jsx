import { useState, useEffect, useRef } from 'react'
import useStore from '../store/useStore'
import AudioService from '../hooks/useAudio'

export default function AudioEngine() {
  const audioMuted = useStore((s) => s.audioMuted)
  const toggleAudio = useStore((s) => s.toggleAudio)
  const { initAudio, startAmbient } = AudioService

  useEffect(() => {
    // Attempt to start ambient when component mounts, 
    // though it might be suspended till first user click
    startAmbient()
  }, [startAmbient])

  return (
    <button
      onClick={() => {
        initAudio()    // Unlocks context globally
        startAmbient() // Ensures ambient is running
        toggleAudio()  // Flips muted state in store
      }}
      id="audio-toggle"
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(0, 245, 255, 0.15)',
        color: audioMuted ? 'rgba(232, 234, 240, 0.3)' : '#00F5FF',
        fontSize: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s',
        backdropFilter: 'blur(10px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 245, 255, 0.4)'
        e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 245, 255, 0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 245, 255, 0.15)'
        e.currentTarget.style.boxShadow = 'none'
      }}
      title={audioMuted ? 'Unmute Audio' : 'Mute Audio'}
    >
      {audioMuted ? '🔇' : '🔊'}
    </button>
  )
}

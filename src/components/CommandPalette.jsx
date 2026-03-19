import { useState, useEffect, useRef } from 'react'
import useStore from '../store/useStore'
import AudioService from '../hooks/useAudio'

export default function CommandPalette() {
  const isOpen = useStore((s) => s.commandPaletteOpen)
  const setOpen = useStore((s) => s.setCommandPaletteOpen)
  const setGravity = useStore((s) => s.setGravityActive)
  const { playTerminalBeep, playClick } = AudioService
  
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([
    'System initialized...',
    'Type /help for available commands.'
  ])
  const inputRef = useRef(null)
  
  const commands = {
    '/help': 'List all available commands',
    '/gravity on': 'Activate gravity anomaly',
    '/gravity off': 'Restore gravitational stability',
    '/warp': 'Pulse spacetime warp',
    '/goto projects': 'Navigate to Projects',
    '/goto skills': 'Navigate to Skills',
    '/goto about': 'Navigate to About',
    '/goto contact': 'Navigate to Contact',
    '/clear': 'Clear terminal history'
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Open with / or Cmd+K
      if ((e.key === '/' || (e.metaKey && e.key === 'k')) && !isOpen) {
        e.preventDefault()
        setOpen(true)
        playTerminalBeep()
      }
      // Close with Escape
      if (e.key === 'Escape' && isOpen) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setOpen, playTerminalBeep])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase()
      setHistory(prev => [...prev, `> ${input}`])
      setInput('')
      playClick()

      if (cmd === '/help') {
        setHistory(prev => [...prev, ...Object.entries(commands).map(([k, v]) => `${k} - ${v}`)])
      } else if (cmd === '/gravity on') {
        setGravity(true)
        setHistory(prev => [...prev, 'G-ANOMALY: ACTIVE'])
      } else if (cmd === '/gravity off') {
        setGravity(false)
        setHistory(prev => [...prev, 'G-ANOMALY: RESOLVED'])
      } else if (cmd === '/clear') {
        setHistory([])
      } else if (cmd.startsWith('/goto ')) {
        const target = cmd.split(' ')[1]
        const el = document.getElementById(`${target}-section`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
          setHistory(prev => [...prev, `NAVIGATING TO: ${target.toUpperCase()}`])
        } else {
          setHistory(prev => [...prev, `ERROR: ${target} NOT FOUND`])
        }
      } else if (cmd === '/warp') {
        window.dispatchEvent(new CustomEvent('warp-pulse'))
        setHistory(prev => [...prev, 'WARP PULSE INITIATED'])
      } else {
        setHistory(prev => [...prev, 'UNKNOWN COMMAND. Type /help.'])
      }
    }
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(10px)',
    }}>
      <div 
        onClick={() => setOpen(false)}
        style={{ position: 'absolute', inset: 0 }}
      />
      
      <div style={{
        position: 'relative',
        width: 'min(600px, 90vw)',
        height: '400px',
        background: 'rgba(5, 10, 20, 0.9)',
        border: '1px solid rgba(0, 245, 255, 0.2)',
        borderRadius: '12px',
        boxShadow: '0 0 50px rgba(0,0,0,0.5), inset 0 0 30px rgba(0, 245, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        {/* Header */}
        <div style={{
          padding: '12px 20px',
          background: 'rgba(0, 245, 255, 0.05)',
          borderBottom: '1px solid rgba(0, 245, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: 12, color: 'rgba(0, 245, 255, 0.6)', letterSpacing: '0.2em' }}>
            PRATEEK_OS // COMMAND_TERMINAL
          </span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>ESC TO CLOSE</span>
        </div>

        {/* Console space */}
        <div style={{
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '13px',
          color: 'rgba(232, 234, 240, 0.8)',
        }}>
          {history.map((line, i) => (
            <div key={i} style={{ 
              color: line.startsWith('>') ? '#00F5FF' : (line.startsWith('ERROR') ? '#FF5555' : 'inherit')
            }}>
              {line}
            </div>
          ))}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: 'auto' }}>
            <span style={{ color: '#00F5FF' }}>{'>'}</span>
            <input 
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: '#E8EAF0',
                fontSize: '14px',
                width: '100%',
              }}
              placeholder="Enter command..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

import useStore from '../store/useStore'

// GLOBAL SINGLETON
let sharedAudioCtx = null
let sharedGainNode = null
let ambientOsc1 = null
let ambientOsc2 = null

export function getAudioCtx() {
  if (!sharedAudioCtx) {
    try {
      sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)()
      sharedGainNode = sharedAudioCtx.createGain()
      sharedGainNode.connect(sharedAudioCtx.destination)
      sharedGainNode.gain.value = 0.15
    } catch (e) {
      console.warn('AudioContext not supported')
    }
  }
  return { ctx: sharedAudioCtx, gain: sharedGainNode }
}

const AudioService = {
  initAudio: () => {
    const { ctx } = getAudioCtx()
    if (ctx && ctx.state === 'suspended') {
      ctx.resume()
    }
  },

  playThud: () => {
    const { ctx, gain } = getAudioCtx()
    const audioMuted = useStore.getState().audioMuted
    if (!ctx || audioMuted || ctx.state === 'suspended') return
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.connect(g)
    g.connect(gain)
    osc.frequency.setValueAtTime(60, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.3)
    g.gain.setValueAtTime(0.5, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
  },

  playWhoosh: () => {
    const { ctx, gain } = getAudioCtx()
    const audioMuted = useStore.getState().audioMuted
    if (!ctx || audioMuted || ctx.state === 'suspended') return
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sawtooth'
    osc.connect(g)
    g.connect(gain)
    osc.frequency.setValueAtTime(200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.15)
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4)
    g.gain.setValueAtTime(0.2, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.5)
  },

  playClick: () => {
    const { ctx, gain } = getAudioCtx()
    const audioMuted = useStore.getState().audioMuted
    if (!ctx || audioMuted || ctx.state === 'suspended') return
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.connect(g)
    g.connect(gain)
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    g.gain.setValueAtTime(0.1, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.05)
  },

  playHover: () => {
    const { ctx, gain } = getAudioCtx()
    const audioMuted = useStore.getState().audioMuted
    if (!ctx || audioMuted || ctx.state === 'suspended') return
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.connect(g)
    g.connect(gain)
    osc.frequency.setValueAtTime(300, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1)
    g.gain.setValueAtTime(0.05, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.1)
  },

  playTerminalBeep: () => {
    const { ctx, gain } = getAudioCtx()
    const audioMuted = useStore.getState().audioMuted
    if (!ctx || audioMuted || ctx.state === 'suspended') return
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'square'
    osc.connect(g)
    g.connect(gain)
    osc.frequency.setValueAtTime(1200, ctx.currentTime)
    g.gain.setValueAtTime(0.05, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.1)
  },

  playWarp: () => {
    const { ctx, gain } = getAudioCtx()
    const audioMuted = useStore.getState().audioMuted
    if (!ctx || audioMuted || ctx.state === 'suspended') return
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sawtooth'
    osc.connect(g)
    g.connect(gain)
    osc.frequency.setValueAtTime(50, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.5)
    g.gain.setValueAtTime(0.1, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.6)
  },

  startAmbient: () => {
    const { ctx, gain } = getAudioCtx()
    if (!ctx || ambientOsc1) return
    ambientOsc1 = ctx.createOscillator()
    ambientOsc1.type = 'sine'
    ambientOsc1.frequency.value = 55
    ambientOsc2 = ctx.createOscillator()
    ambientOsc2.type = 'sine'
    ambientOsc2.frequency.value = 82.5
    const ambientGain = ctx.createGain()
    ambientGain.gain.value = 0.4
    ambientOsc1.connect(ambientGain)
    ambientOsc2.connect(ambientGain)
    ambientGain.connect(gain)
    ambientOsc1.start()
    ambientOsc2.start()
  }
}

export default AudioService

import { create } from 'zustand'

const useStore = create((set, get) => ({
  // Loading
  isLoaded: false,
  loadProgress: 0,
  setLoaded: () => set({ isLoaded: true }),
  setLoadProgress: (p) => set({ loadProgress: p }),

  // Scroll
  scrollProgress: 0,
  scrollVelocity: 0,
  currentScene: 0,
  warpIntensity: 0, // NEW: For scroll warp effect
  setScrollProgress: (p) => set({ scrollProgress: p }),
  setScrollVelocity: (v) => set({ scrollVelocity: v }),
  setCurrentScene: (s) => set({ currentScene: s }),
  setWarpIntensity: (i) => set({ warpIntensity: i }),

  // Mouse
  mouseX: 0,
  mouseY: 0,
  mouseNormX: 0,
  mouseNormY: 0,
  setMouse: (x, y) => set({
    mouseX: x,
    mouseY: y,
    mouseNormX: (x / window.innerWidth) * 2 - 1,
    mouseNormY: -(y / window.innerHeight) * 2 + 1,
  }),

  // Gravity mode
  gravityActive: false,
  setGravityActive: (active) => set({ gravityActive: active }),

  // Audio
  audioMuted: false,
  toggleAudio: () => set((s) => ({ audioMuted: !s.audioMuted })),

  // Command Palette
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  // Cursor
  cursorVariant: 'default',
  setCursorVariant: (v) => set({ cursorVariant: v }),
}))

export default useStore

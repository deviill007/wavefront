// stores/themeStore.ts
// Extracts dominant color from thumbnail and provides theme tokens

import { create } from 'zustand'

interface ThemeStore {
  accentRgb: string       // e.g. "120, 80, 240"
  accentHex: string       // e.g. "#7850f0"
  accentMuted: string     // low-opacity version for backgrounds
  isDark: boolean         // whether the accent is dark (affects text contrast)
  setFromImage: (src: string) => void
  reset: () => void
}

const DEFAULT_ACCENT_RGB = '32, 32, 40'
const DEFAULT_ACCENT_HEX = '#202028'

function luminance(r: number, g: number, b: number) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function extractDominantColor(src: string): Promise<{ r: number; g: number; b: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 32
      canvas.height = 32
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, 32, 32)
      const data = ctx.getImageData(0, 0, 32, 32).data

      // Sample pixels, skipping very dark/light ones
      let rSum = 0, gSum = 0, bSum = 0, count = 0
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2]
        const lum = luminance(r, g, b)
        const sat = Math.max(r, g, b) - Math.min(r, g, b)
        // Only sample colorful, mid-range pixels
        if (lum > 20 && lum < 220 && sat > 30) {
          rSum += r; gSum += g; bSum += b; count++
        }
      }

      if (count === 0) {
        resolve({ r: 32, g: 32, b: 40 })
      } else {
        resolve({
          r: Math.round(rSum / count),
          g: Math.round(gSum / count),
          b: Math.round(bSum / count),
        })
      }
    }
    img.onerror = () => resolve({ r: 32, g: 32, b: 40 })
    img.src = src
  })
}

function toHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`
}

// Boosts saturation so muted album art still produces a vivid accent
function boostSaturation(r: number, g: number, b: number, factor = 1.6) {
  const avg = (r + g + b) / 3
  return {
    r: Math.min(255, Math.round(avg + (r - avg) * factor)),
    g: Math.min(255, Math.round(avg + (g - avg) * factor)),
    b: Math.min(255, Math.round(avg + (b - avg) * factor)),
  }
}

export const useThemeStore = create<ThemeStore>((set) => ({
  accentRgb: DEFAULT_ACCENT_RGB,
  accentHex: DEFAULT_ACCENT_HEX,
  accentMuted: `rgba(${DEFAULT_ACCENT_RGB}, 0.15)`,
  isDark: true,

  setFromImage: async (src: string) => {
    try {
      const raw = await extractDominantColor(src)
      const { r, g, b } = boostSaturation(raw.r, raw.g, raw.b)
      const lum = luminance(r, g, b)
      set({
        accentRgb: `${r}, ${g}, ${b}`,
        accentHex: toHex(r, g, b),
        accentMuted: `rgba(${r}, ${g}, ${b}, 0.15)`,
        isDark: lum < 128,
      })
    } catch {
      set({
        accentRgb: DEFAULT_ACCENT_RGB,
        accentHex: DEFAULT_ACCENT_HEX,
        accentMuted: `rgba(${DEFAULT_ACCENT_RGB}, 0.15)`,
        isDark: true,
      })
    }
  },

  reset: () => set({
    accentRgb: DEFAULT_ACCENT_RGB,
    accentHex: DEFAULT_ACCENT_HEX,
    accentMuted: `rgba(${DEFAULT_ACCENT_RGB}, 0.15)`,
    isDark: true,
  }),
}))
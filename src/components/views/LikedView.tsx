// src/components/views/LikedView.tsx
'use client'
import { useThemeStore } from '@/stores/themeStore'
import { Heart } from 'lucide-react'
export default function LikedView() {
  const { accentRgb } = useThemeStore()
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 28px 0', textAlign: 'center' }}>
      <Heart size={48} style={{ color: `rgba(${accentRgb},0.3)`, marginBottom: 16 }} />
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 16 }}>Liked songs</p>
      <p style={{ color: 'rgba(255,255,255,0.12)', fontSize: 13, marginTop: 6 }}>Sign in to see your liked songs</p>
    </div>
  )
}
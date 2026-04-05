'use client'

import { useEffect, useRef } from 'react'
import { usePlayerStore } from '@/stores/playerStore'
import { useThemeStore } from '@/stores/themeStore'
import { useSyncedLyrics } from '@/hooks/useSyncedLyrics'
import { Music2 } from 'lucide-react'

export default function LyricsPanel() {
  useSyncedLyrics()

  const { currentTrack, lyrics, activeLyricIndex } = usePlayerStore()
  const { accentRgb } = useThemeStore()
  const activeRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [activeLyricIndex])

  const emptyState = (icon: boolean, message: string, sub?: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10, padding: '0 24px' }}>
      {icon && (
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
          <Music2 size={18} style={{ color: 'rgba(255,255,255,0.16)' }} />
        </div>
      )}
      <p style={{ fontSize: 12.5, fontWeight: 500, color: 'rgba(255,255,255,0.20)', textAlign: 'center' }}>{message}</p>
      {sub && <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.10)', textAlign: 'center' }}>{sub}</p>}
    </div>
  )

  if (!currentTrack) return emptyState(true, 'Play a song to see lyrics')
  if (!lyrics) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          border: `2px solid rgba(${accentRgb}, 0.20)`,
          borderTopColor: `rgba(${accentRgb}, 0.7)`,
          animation: 'spin 0.7s linear infinite',
          transition: 'border-color 1.2s ease, border-top-color 1.2s ease',
        }}
      />
      <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.20)' }}>Loading lyrics…</p>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
  if (!lyrics.synced.length && !lyrics.plain) return emptyState(true, 'No lyrics found', 'This track may be instrumental')

  if (lyrics.synced.length) {
    return (
      <div
        ref={containerRef}
        style={{ height: '100%', overflowY: 'auto', padding: '12px 22px 48px', scrollbarWidth: 'none' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {lyrics.synced.map((line, i) => {
            const isActive = i === activeLyricIndex
            const isPast = i < activeLyricIndex
            const isNext = i === activeLyricIndex + 1

            return (
              <div
                key={i}
                ref={isActive ? activeRef : null}
                onClick={() => {
                  const audio = document.querySelector('audio')
                  if (audio) audio.currentTime = line.time
                }}
                style={{
                  padding: '7px 10px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
                  fontSize: isActive ? 18 : isNext ? 14.5 : 13.5,
                  fontWeight: isActive ? 650 : 400,
                  letterSpacing: isActive ? '-0.020em' : '-0.010em',
                  lineHeight: 1.45,
                  color: isActive
                    ? 'transparent'
                    : isPast
                    ? 'rgba(255,255,255,0.18)'
                    : 'rgba(255,255,255,0.34)',
                  background: isActive
                    ? `linear-gradient(135deg, rgb(${accentRgb}), rgba(255,255,255,0.80))`
                    : 'transparent',
                  WebkitBackgroundClip: isActive ? 'text' : undefined,
                  WebkitTextFillColor: isActive ? 'transparent' : undefined,
                  transform: isActive ? 'translateX(4px)' : 'translateX(0)',
                  transformOrigin: 'left center',
                }}
              >
                {line.text || <span style={{ opacity: 0.4 }}>♪</span>}
              </div>
            )
          })}
          <div style={{ height: '38vh' }} />
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '12px 22px 48px', scrollbarWidth: 'none' }}>
      <pre
        style={{
          whiteSpace: 'pre-wrap',
          fontSize: 13,
          lineHeight: 1.75,
          color: 'rgba(255,255,255,0.42)',
          fontFamily: 'inherit',
          letterSpacing: '-0.008em',
        }}
      >
        {lyrics.plain}
      </pre>
    </div>
  )
}
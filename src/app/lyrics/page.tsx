'use client'

import { useEffect, useRef } from 'react'
import { usePlayerStore } from '@/stores/playerStore'
import { useThemeStore } from '@/stores/themeStore'
import { useSyncedLyrics } from '@/hooks/useSyncedLyrics'
import { ArrowLeft, Music2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LyricsPage() {
  useSyncedLyrics()

  const router = useRouter()
  const { currentTrack, lyrics, activeLyricIndex, progress } = usePlayerStore()
  const { accentRgb } = useThemeStore()
  const activeRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto scroll active line to center within the scroll container
  useEffect(() => {
    if (!activeRef.current || !scrollRef.current) return
    const container = scrollRef.current
    const el = activeRef.current
    const containerHeight = container.clientHeight
    const elTop = el.offsetTop
    const elHeight = el.clientHeight
    container.scrollTo({
      top: elTop - containerHeight / 2 + elHeight / 2,
      behavior: 'smooth',
    })
  }, [activeLyricIndex])

  function getLineFillPercent(i: number): number {
    if (!lyrics?.synced || i !== activeLyricIndex) return 0
    const line = lyrics.synced[i]
    const nextLine = lyrics.synced[i + 1]
    if (!nextLine) return 0
    const lineDuration = nextLine.time - line.time
    const elapsed = progress - line.time
    return Math.min(100, Math.max(0, (elapsed / lineDuration) * 100))
  }

  return (
    <div style={{ height: '100vh', overflow: 'hidden', position: 'relative', paddingBottom: 80, paddingTop: 50 }}>

      {/* Blurred album art bg */}
      {currentTrack && (
        <div
          aria-hidden
          style={{
            position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
            backgroundImage: `url(${currentTrack.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(80px) saturate(150%)',
            opacity: 0.12,
            transform: 'scale(1.1)',
          }}
        />
      )}

      {/* Dark overlay */}
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: `
            linear-gradient(180deg, rgba(8,8,13,0.85) 0%, rgba(8,8,13,0.5) 40%, rgba(8,8,13,0.85) 100%),
            radial-gradient(ellipse 80% 60% at 50% 30%, rgba(${accentRgb}, 0.08) 0%, transparent 70%)
          `,
          transition: 'background 1.4s ease',
        }}
      />

      {/* Full layout column */}
      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', maxWidth: 800, margin: '0 auto', padding: '0 48px' }}>

        {/* ── Sticky header ── */}
        <div
          style={{
            flexShrink: 0,
            position: 'sticky',
            top: 0,
            zIndex: 10,
            paddingTop: 28,
            paddingBottom: 20,
            // background: 'linear-gradient(180deg, rgba(8,8,13,0.95) 0%, rgba(8,8,13,0.80) 75%, transparent 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Back */}
            <button
              onClick={() => router.back()}
              style={{
                width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'rgba(255,255,255,0.45)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
              }}
            >
              <ArrowLeft size={16} />
            </button>

            {/* Album art */}
            {currentTrack && (
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div
                  style={{
                    position: 'absolute', inset: 0, borderRadius: 11,
                    backgroundImage: `url(${currentTrack.thumbnail})`,
                    backgroundSize: 'cover',
                    filter: 'blur(12px)', opacity: 0.5,
                    transform: 'scale(0.85) translateY(6px)',
                  }}
                />
                <img
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  style={{
                    width: 44, height: 44, borderRadius: 11,
                    objectFit: 'cover', position: 'relative',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: `0 4px 16px rgba(${accentRgb}, 0.20)`,
                    display: 'block',
                  }}
                />
              </div>
            )}

            {/* Track info */}
            {currentTrack ? (
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{
                  fontSize: 14, fontWeight: 600,
                  color: 'rgba(255,255,255,0.92)',
                  letterSpacing: '-0.015em',
                  overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                  marginBottom: 2,
                }}>
                  {currentTrack.title}
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                  {currentTrack.artist}
                </p>
              </div>
            ) : (
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>No song playing</p>
            )}

            {/* Source badge */}
            {lyrics?.source && (
              <div style={{
                flexShrink: 0,
                padding: '4px 10px', borderRadius: 99,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: 10.5, fontWeight: 500,
                color: 'rgba(255,255,255,0.30)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                {lyrics.source}
              </div>
            )}
          </div>
        </div>

        {/* ── Scrollable lyrics ── */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            scrollbarWidth: 'none',
            paddingTop: 8,
          }}
        >
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            div::-webkit-scrollbar { display: none; }
          `}</style>

          {/* No song */}
          {!currentTrack && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12 }}>
              <Music2 size={44} style={{ color: 'rgba(255,255,255,0.12)' }} />
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 15 }}>Play a song to see lyrics</p>
            </div>
          )}

          {/* Loading */}
          {currentTrack && !lyrics && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '48px 0' }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                border: `2px solid rgba(${accentRgb}, 0.20)`,
                borderTopColor: `rgba(${accentRgb}, 0.85)`,
                animation: 'spin 0.7s linear infinite',
              }} />
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>Loading lyrics...</p>
            </div>
          )}

          {/* Not found */}
          {currentTrack && lyrics && !lyrics.synced.length && !lyrics.plain && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <Music2 size={48} style={{ color: 'rgba(255,255,255,0.10)', marginBottom: 20 }} />
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 16, marginBottom: 8 }}>No lyrics found</p>
              <p style={{ color: 'rgba(255,255,255,0.12)', fontSize: 13 }}>This track may be instrumental</p>
            </div>
          )}

          {/* Synced lyrics */}
          {currentTrack && lyrics?.synced.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: '45vh' }}>
              {lyrics.synced.map((line, i) => {
                const isActive = i === activeLyricIndex
                const isPast = i < activeLyricIndex
                const isNext = i === activeLyricIndex + 1
                const fillPercent = getLineFillPercent(i)

                return (
                  <div
                    key={i}
                    ref={isActive ? activeRef : null}
                    onClick={() => {
                      const audio = document.querySelector('audio')
                      if (audio) audio.currentTime = line.time
                    }}
                    style={{
                      padding: isActive ? '8px 14px' : '5px 14px',
                      borderRadius: 16,
                      cursor: 'pointer',
                      transition: 'all 0.32s cubic-bezier(0.4,0,0.2,1)',
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'block',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    {/* Sweep fill behind active line */}
                    {isActive && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0, left: 0, bottom: 0,
                          width: `${fillPercent}%`,
                          background: `linear-gradient(90deg, rgba(${accentRgb}, 0.14), rgba(${accentRgb}, 0.04))`,
                          borderRadius: 16,
                          transition: 'width 0.08s linear',
                          pointerEvents: 'none',
                        }}
                      />
                    )}

                    <p
                      style={{
                        position: 'relative',
                        margin: 0,
                        fontSize: isActive ? 36 : isNext ? 23 : isPast ? 19 : 21,
                        fontWeight: isActive ? 800 : isPast ? 400 : 500,
                        letterSpacing: isActive ? '-0.04em' : '-0.02em',
                        lineHeight: 1.25,
                        transition: 'all 0.32s cubic-bezier(0.4,0,0.2,1)',
                        transform: isActive ? 'translateX(6px)' : 'translateX(0)',

                        // Active: gradient text
                        ...(isActive ? {
                          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.97), rgba(${accentRgb}, 0.88))`,
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        } : {
                          color: isPast
                            ? 'rgba(255,255,255,0.20)'
                            : isNext
                            ? 'rgba(255,255,255,0.52)'
                            : 'rgba(255,255,255,0.36)',
                        }),
                      }}
                    >
                      {line.text || '♪'}
                    </p>
                  </div>
                )
              })}
            </div>

          ) : currentTrack && lyrics?.plain ? (
            // Plain text fallback
            <pre style={{
              whiteSpace: 'pre-wrap',
              fontSize: 17,
              lineHeight: 2,
              color: 'rgba(255,255,255,0.42)',
              fontFamily: 'inherit',
              letterSpacing: '-0.01em',
              paddingBottom: '40vh',
            }}>
              {lyrics.plain}
            </pre>
          ) : null}

        </div>
      </div>
    </div>
  )
}
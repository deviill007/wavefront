'use client'

import { usePlayerStore } from '@/stores/playerStore'
import { useThemeStore } from '@/stores/themeStore'
import { Heart, Share2, Music2, AlignLeft, MoreHorizontal, Radio } from 'lucide-react'
import { useState } from 'react'
import LyricsPanel from '@/components/lyrics/LyricsPanel'

export default function NowPlaying() {
  const { currentTrack } = usePlayerStore()
  const { accentRgb } = useThemeStore()
  const [tab, setTab] = useState<'info' | 'lyrics'>('info')
  const [liked, setLiked] = useState(false)

  return (
    <aside
      className="fixed right-0 top-0 h-screen w-[300px] flex flex-col z-40 overflow-hidden"
      style={{
        background: 'rgba(8, 8, 13, 0.94)',
        backdropFilter: 'blur(56px) saturate(180%)',
        WebkitBackdropFilter: 'blur(56px) saturate(180%)',
        borderLeft: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Dynamic ambient orbs */}
      <div
        aria-hidden
        style={{
          position: 'absolute', top: -100, right: -80,
          width: 360, height: 360, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${accentRgb}, 0.13) 0%, transparent 65%)`,
          pointerEvents: 'none', transition: 'background 1.4s ease', zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute', bottom: 60, left: -80,
          width: 300, height: 300, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${accentRgb}, 0.07) 0%, transparent 65%)`,
          pointerEvents: 'none', transition: 'background 1.4s ease', zIndex: 0,
        }}
      />

      {!currentTrack ? (
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, padding: '0 24px' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            <Radio size={22} style={{ color: 'rgba(255,255,255,0.16)' }} />
          </div>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.20)' }}>Nothing playing yet</p>
          <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.10)', textAlign: 'center', lineHeight: 1.65, maxWidth: 160 }}>Pick a track and it'll appear here</p>
        </div>
      ) : (
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '26px 22px 0' }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.16)', letterSpacing: '0.13em', textTransform: 'uppercase' }}>
              Now Playing
            </span>
            <button
              style={{ width: 30, height: 30, borderRadius: 9, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.24)', transition: 'all 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.24)' }}
            >
              <MoreHorizontal size={14} />
            </button>
          </div>

          {/* Album art */}
          <div style={{ padding: '20px 22px 0' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 20, backgroundImage: `url(${currentTrack.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(36px)', opacity: 0.45, transform: 'scale(0.87) translateY(20px)', zIndex: 0 }} />
              <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', zIndex: 1 }}>
                <img src={currentTrack.thumbnail} alt={currentTrack.title} style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 45%, rgba(0,0,0,0.15) 100%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: 18, border: '1px solid rgba(255,255,255,0.10)', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          {/* Track meta + like */}
          <div style={{ padding: '18px 22px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h3 style={{ fontSize: 15.5, fontWeight: 600, color: 'rgba(255,255,255,0.92)', lineHeight: 1.3, letterSpacing: '-0.015em', marginBottom: 5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {currentTrack.title}
              </h3>
              <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.32)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {currentTrack.artist}
              </p>
            </div>
            <button
              onClick={() => setLiked(!liked)}
              style={{ flexShrink: 0, marginTop: 3, width: 36, height: 36, borderRadius: 11, border: liked ? `1px solid rgba(${accentRgb}, 0.40)` : '1px solid rgba(255,255,255,0.08)', background: liked ? `rgba(${accentRgb}, 0.16)` : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.20s cubic-bezier(0.34,1.56,0.64,1)', color: liked ? `rgb(${accentRgb})` : 'rgba(255,255,255,0.28)' }}
              onMouseEnter={(e) => { if (!liked) { e.currentTarget.style.borderColor = `rgba(${accentRgb}, 0.22)`; e.currentTarget.style.color = `rgba(${accentRgb}, 0.7)` } }}
              onMouseLeave={(e) => { if (!liked) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.28)' } }}
            >
              <Heart size={14} style={{ fill: liked ? `rgb(${accentRgb})` : 'none', transition: 'fill 0.18s' }} />
            </button>
          </div>

          {/* Share */}
          <div style={{ padding: '12px 22px 0' }}>
            <button
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '9px 0', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)', fontSize: 12.5, fontWeight: 500, color: 'rgba(255,255,255,0.30)', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.11)'; e.currentTarget.style.color = 'rgba(255,255,255,0.60)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.30)' }}
            >
              <Share2 size={13} />
              Share track
            </button>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '16px 22px 0' }} />

          {/* Tabs */}
          <div style={{ padding: '12px 22px 0' }}>
            <div style={{ display: 'flex', borderRadius: 13, padding: 3, gap: 3, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {(['info', 'lyrics'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, letterSpacing: '0.01em', transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)', background: tab === t ? 'rgba(255,255,255,0.08)' : 'transparent', color: tab === t ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.24)', boxShadow: tab === t ? `0 1px 4px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(${accentRgb}, 0.14)` : 'none' }}
                >
                  {t === 'info' ? <Music2 size={12} /> : <AlignLeft size={12} />}
                  {t === 'info' ? 'Queue' : 'Lyrics'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, minHeight: 0, marginTop: 12 }}>
            {tab === 'lyrics' ? (
              <LyricsPanel />
            ) : (
              <div style={{ padding: '4px 22px' }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.14)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Up Next</p>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 16px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Music2 size={15} style={{ color: 'rgba(255,255,255,0.13)' }} />
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.17)', textAlign: 'center' }}>Queue is empty</p>
                </div>
              </div>
            )}
          </div>

          <div style={{ flexShrink: 0, height: 20 }} />
        </div>
      )}
    </aside>
  )
}
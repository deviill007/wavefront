'use client'

import { useThemeStore } from '@/stores/themeStore'
import { usePlayerStore } from '@/stores/playerStore'
import { useUIStore } from '@/stores/uiStore'
import { Waves, Search, ListMusic, Heart } from 'lucide-react'

export default function HomeView() {
  const { accentRgb } = useThemeStore()
  const { currentTrack } = usePlayerStore()
  const { setActiveView } = useUIStore()

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 28px 0' }}>

      {/* Greeting */}
      <div style={{ marginBottom: 48 }}>
        <h1 style={{
          fontSize: 32, fontWeight: 700, letterSpacing: '-0.04em',
          color: 'rgba(255,255,255,0.92)', marginBottom: 8,
        }}>
          Good {getGreeting()} 👋
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.28)' }}>
          What do you want to listen to today?
        </p>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 40 }}>
        {[
          { icon: Search, label: 'Search music', sub: 'Find any song', view: 'search' as const },
          { icon: Heart, label: 'Liked songs', sub: 'Your favourites', view: 'liked' as const },
          { icon: ListMusic, label: 'Library', sub: 'Your playlists', view: 'library' as const },
          { icon: Waves, label: 'Listen Together', sub: 'Vibe with friends', view: 'room' as const },
        ].map(({ icon: Icon, label, sub, view }) => (
          <button
            key={label}
            onClick={() => setActiveView(view)}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', borderRadius: 14, cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              transition: 'all 0.18s', textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `rgba(${accentRgb},0.10)`
              e.currentTarget.style.borderColor = `rgba(${accentRgb},0.25)`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 11, flexShrink: 0,
              background: `rgba(${accentRgb},0.15)`,
              border: `1px solid rgba(${accentRgb},0.20)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 1.2s ease',
            }}>
              <Icon size={18} style={{ color: `rgba(${accentRgb},1)`, transition: 'color 1.2s ease' }} />
            </div>
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.01em' }}>{label}</p>
              <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.30)', marginTop: 1 }}>{sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Currently playing hint */}
      {currentTrack && (
        <div style={{
          padding: '14px 16px', borderRadius: 14,
          background: `rgba(${accentRgb},0.08)`,
          border: `1px solid rgba(${accentRgb},0.15)`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <img src={currentTrack.thumbnail} alt="" style={{ width: 40, height: 40, borderRadius: 9, objectFit: 'cover' }} />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 11, color: `rgba(${accentRgb},0.8)`, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>Now Playing</p>
            <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.85)', fontWeight: 500, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{currentTrack.title}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
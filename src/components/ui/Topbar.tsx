'use client'

import { useUIStore } from '@/stores/uiStore'
import { useThemeStore } from '@/stores/themeStore'
import { Search, Bell, Settings, User, ChevronLeft, ChevronRight } from 'lucide-react'

export default function TopBar() {
  const { setActiveView, activeView } = useUIStore()
  const { accentRgb } = useThemeStore()

  return (
    <div style={{
      height: 56, display: 'flex', alignItems: 'center',
      padding: '0 20px', gap: 12,
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(9,9,14,0.80)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>

      {/* Back/Forward */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        {[ChevronLeft, ChevronRight].map((Icon, i) => (
          <button
            key={i}
            style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.40)', transition: 'all 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = 'rgba(255,255,255,0.80)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.40)' }}
          >
            <Icon size={14} />
          </button>
        ))}
      </div>

      {/* Search bar — center */}
      <div
        style={{ flex: 1, maxWidth: 400, margin: '0 auto', position: 'relative', cursor: 'pointer' }}
        onClick={() => setActiveView('search')}
      >
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
        <div style={{
          width: '100%', paddingLeft: 36, paddingRight: 16,
          paddingTop: 8, paddingBottom: 8,
          borderRadius: 99, background: 'rgba(255,255,255,0.06)',
          border: activeView === 'search' ? `1px solid rgba(${accentRgb},0.35)` : '1px solid rgba(255,255,255,0.09)',
          color: 'rgba(255,255,255,0.30)', fontSize: 13,
          letterSpacing: '-0.005em', transition: 'all 0.2s',
          boxSizing: 'border-box',
        }}>
          Search songs, artists, albums...
        </div>
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginRight: '100px' }}>
        {[
          { Icon: Bell, title: 'Notifications' },
          { Icon: Settings, title: 'Settings' },
        ].map(({ Icon, title }) => (
          <button
            key={title}
            title={title}
            style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', transition: 'all 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
          >
            <Icon size={14} />
          </button>
        ))}

        {/* Profile avatar placeholder */}
        <div style={{
          width: 32, height: 32, borderRadius: '50%', cursor: 'pointer',
          background: `linear-gradient(135deg, rgba(${accentRgb},0.8), rgba(${accentRgb},0.4))`,
          border: `1px solid rgba(${accentRgb},0.35)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 1.2s ease',
        }}>
          <User size={14} style={{ color: 'rgba(255,255,255,0.85)' }} />
        </div>
      </div>
    </div>
  )
}
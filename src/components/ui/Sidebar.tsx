'use client'

import { useUIStore } from '@/stores/uiStore'
import { useThemeStore } from '@/stores/themeStore'
import { usePlayerStore } from '@/stores/playerStore'
import {
  Home, Library, Heart, Radio,
  Download, Settings, Plus, ChevronLeft, ChevronRight, Waves
} from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Home', view: 'home' as const },
  { icon: Library, label: 'Library', view: 'library' as const },
  { icon: Heart, label: 'Liked Songs', view: 'liked' as const },
  { icon: Radio, label: 'Listen Together', view: 'room' as const },
  { icon: Download, label: 'Downloads', view: 'downloads' as const },
]

const playlists = ['Late Night Mix', 'Chill Vibes', 'Workout 🔥', 'Focus Mode', 'Sunday Morning']

export default function Sidebar() {
  const { activeView, setActiveView, sidebarCollapsed, toggleSidebar } = useUIStore()
  const { accentRgb } = useThemeStore()
  const { currentTrack } = usePlayerStore()

  const W = sidebarCollapsed ? 64 : 220

  return (
    <aside
      style={{
        position: 'fixed', left: 0, top: 0,
        height: '100vh', width: W,
        display: 'flex', flexDirection: 'column',
        zIndex: 40, overflow: 'hidden',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        background: 'rgba(8,8,12,0.95)',
        backdropFilter: 'blur(48px)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Accent orb */}
      <div aria-hidden style={{
        position: 'absolute', top: -60, left: -60,
        width: 200, height: 200, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${accentRgb},0.10) 0%, transparent 70%)`,
        pointerEvents: 'none', transition: 'background 1.2s ease',
      }} />

      {/* Logo + collapse button */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: sidebarCollapsed ? 'center' : 'space-between',
        padding: sidebarCollapsed ? '20px 0' : '20px 16px',
        flexShrink: 0,
      }}>
        {!sidebarCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: `linear-gradient(145deg, rgba(${accentRgb},0.9), rgba(${accentRgb},0.5))`,
              border: `1px solid rgba(${accentRgb},0.4)`,
              boxShadow: `0 4px 16px rgba(${accentRgb},0.25)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, transition: 'all 1.2s ease',
            }}>🌊</div>
            <span style={{
              fontSize: 16, fontWeight: 700, letterSpacing: '-0.025em',
              color: 'rgba(255,255,255,0.92)',
            }}>Wavefront</span>
          </div>
        )}

        {sidebarCollapsed && (
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: `linear-gradient(145deg, rgba(${accentRgb},0.9), rgba(${accentRgb},0.5))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, cursor: 'pointer',
          }} onClick={toggleSidebar}>🌊</div>
        )}

        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            style={{
              width: 26, height: 26, borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(255,255,255,0.30)',
              transition: 'all 0.15s', flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = 'rgba(255,255,255,0.70)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.30)' }}
          >
            <ChevronLeft size={13} />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ padding: sidebarCollapsed ? '0 8px' : '0 10px', display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
        {navItems.map(({ icon: Icon, label, view }) => {
          const isActive = activeView === view
          return (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              title={sidebarCollapsed ? label : undefined}
              style={{
                display: 'flex', alignItems: 'center',
                gap: sidebarCollapsed ? 0 : 11,
                padding: sidebarCollapsed ? '10px 0' : '9px 12px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                borderRadius: 10,
                border: isActive ? `1px solid rgba(${accentRgb},0.22)` : '1px solid transparent',
                background: isActive ? `rgba(${accentRgb},0.13)` : 'transparent',
                color: isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.32)',
                cursor: 'pointer', width: '100%', textAlign: 'left',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.68)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.32)'
                }
              }}
            >
              <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
              {!sidebarCollapsed && (
                <span style={{ fontSize: 13, fontWeight: isActive ? 500 : 400, letterSpacing: '-0.005em', whiteSpace: 'nowrap' }}>
                  {label}
                </span>
              )}
              {/* Active dot when collapsed */}
              {isActive && sidebarCollapsed && (
                <div style={{
                  position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                  width: 4, height: 4, borderRadius: '50%',
                  background: `rgba(${accentRgb},1)`,
                }} />
              )}
              {/* Active dot when expanded */}
              {isActive && !sidebarCollapsed && (
                <div style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: `rgba(${accentRgb},1)`, boxShadow: `0 0 6px rgba(${accentRgb},0.7)` }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Divider */}
      {!sidebarCollapsed && (
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '14px 16px' }} />
      )}

      {/* Playlists — only when expanded */}
      {!sidebarCollapsed && (
        <div style={{ padding: '0 10px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
              Playlists
            </span>
            <button
              style={{ width: 20, height: 20, borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.28)', transition: 'all 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.28)' }}
            ><Plus size={11} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
            {playlists.map((name) => (
              <button
                key={name}
                style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 10px', borderRadius: 8, border: '1px solid transparent', background: 'transparent', cursor: 'pointer', textAlign: 'left', width: '100%', color: 'rgba(255,255,255,0.28)', transition: 'all 0.13s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.62)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.28)' }}
              >
                <div style={{ width: 26, height: 26, borderRadius: 6, background: `rgba(${accentRgb},0.10)`, border: `1px solid rgba(${accentRgb},0.15)`, flexShrink: 0, transition: 'background 1.2s ease' }} />
                <span style={{ fontSize: 12.5, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Settings at bottom */}
      <div style={{ padding: sidebarCollapsed ? '12px 8px' : '12px 10px', flexShrink: 0 }}>
        {!sidebarCollapsed && <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 10 }} />}
        <button
          title={sidebarCollapsed ? 'Settings' : undefined}
          style={{
            display: 'flex', alignItems: 'center',
            gap: sidebarCollapsed ? 0 : 10,
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            padding: sidebarCollapsed ? '10px 0' : '9px 12px',
            borderRadius: 10, border: '1px solid transparent',
            background: 'transparent', color: 'rgba(255,255,255,0.22)',
            cursor: 'pointer', width: '100%', transition: 'all 0.14s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.22)' }}
        >
          <Settings size={16} strokeWidth={1.8} />
          {!sidebarCollapsed && <span style={{ fontSize: 13 }}>Settings</span>}
        </button>
      </div>
    </aside>
  )
}
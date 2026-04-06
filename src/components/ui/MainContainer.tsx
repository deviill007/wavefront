'use client'

import { useUIStore } from '@/stores/uiStore'
import { useThemeStore } from '@/stores/themeStore'
import HomeView from '@/components/views/HomeView'
import SearchView from '@/components/views/SearchView'
import LibraryView from '@/components/views/LibraryView'
import LikedView from '@/components/views/LikedView'

export default function MainContainer() {
  const { activeView, sidebarCollapsed, rightPanelCollapsed } = useUIStore()
  const { accentRgb } = useThemeStore()

  const leftOffset = sidebarCollapsed ? 64 : 220
  const rightOffset = rightPanelCollapsed ? 0 : 300

  return (
    <div style={{
      marginLeft: leftOffset,
      marginRight: rightOffset,
      paddingBottom: 90,
      minHeight: '100vh',
      transition: 'margin 0.25s cubic-bezier(0.4,0,0.2,1)',
      position: 'relative', zIndex: 1,
    }}>
      {/* Ambient wash */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 55% 45% at 30% 15%, rgba(${accentRgb},0.08) 0%, transparent 70%),
          radial-gradient(ellipse 45% 35% at 80% 5%, rgba(${accentRgb},0.04) 0%, transparent 65%)
        `,
        transition: 'background 1.4s ease',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {activeView === 'home' && <HomeView />}
        {activeView === 'search' && <SearchView />}
        {activeView === 'library' && <LibraryView />}
        {activeView === 'liked' && <LikedView />}
        {activeView === 'room' && (
          <div style={{ padding: '60px 28px', textAlign: 'center', color: 'rgba(255,255,255,0.20)' }}>
            Listen Together — coming soon
          </div>
        )}
        {activeView === 'downloads' && (
          <div style={{ padding: '60px 28px', textAlign: 'center', color: 'rgba(255,255,255,0.20)' }}>
            Downloads — coming soon
          </div>
        )}
      </div>
    </div>
  )
}
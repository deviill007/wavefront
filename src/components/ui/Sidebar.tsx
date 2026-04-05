'use client'

import { Home, Search, Library, Heart, Download, Radio, Settings } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Search, label: 'Search', href: '/search' },
  { icon: Library, label: 'Library', href: '/library' },
  { icon: Heart, label: 'Liked Songs', href: '/liked' },
  { icon: Radio, label: 'Listen Together', href: '/room' },
  { icon: Download, label: 'Downloads', href: '/downloads' },
]

export default function Sidebar() {
  const [active, setActive] = useState('Home')

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-60 flex flex-col z-40 py-6 px-3"
      style={{
        background: 'rgba(10,10,15,0.8)',
        backdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(139,124,248,0.9), rgba(96,165,250,0.8))',
            boxShadow: '0 0 20px rgba(139,124,248,0.4)',
          }}
        >
          🌊
        </div>
        <span
          className="text-lg font-semibold tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #e8eaf0, rgba(139,124,248,0.9))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Wavefront
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map(({ icon: Icon, label, href }) => (
          <button
            key={label}
            onClick={() => setActive(label)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left w-full"
            style={{
              background: active === label
                ? 'rgba(139,124,248,0.15)'
                : 'transparent',
              border: active === label
                ? '1px solid rgba(139,124,248,0.20)'
                : '1px solid transparent',
              color: active === label
                ? '#c4b5fd'
                : 'rgba(255,255,255,0.35)',
            }}
            onMouseEnter={(e) => {
              if (active !== label) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
              }
            }}
            onMouseLeave={(e) => {
              if (active !== label) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'rgba(255,255,255,0.35)'
              }
            }}
          >
            <Icon size={18} />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </nav>

      {/* Playlists section */}
      <div className="mt-6 px-3">
        <p className="text-xs font-medium mb-3"
          style={{ color: 'rgba(255,255,255,0.20)', letterSpacing: '0.08em' }}>
          PLAYLISTS
        </p>
        <div className="flex flex-col gap-1">
          {['Late Night Mix', 'Chill Vibes', 'Workout 🔥'].map((name) => (
            <button
              key={name}
              className="text-left text-sm px-2 py-1.5 rounded-lg transition-all truncate"
              style={{ color: 'rgba(255,255,255,0.30)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.30)'}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom settings */}
      <div className="mt-auto px-3">
        <button
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all"
          style={{ color: 'rgba(255,255,255,0.25)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
        >
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </aside>
  )
}
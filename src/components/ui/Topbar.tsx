'use client'

import { useState, useEffect, useRef } from 'react'
import { useUIStore } from '@/stores/uiStore'
import { useThemeStore } from '@/stores/themeStore'
import { useSearchStore } from '@/stores/searchStore'
import { useSession, signOut } from 'next-auth/react'
import { searchTracks } from '@/lib/api'
import { getHistory, saveHistory, removeHistory } from '@/lib/searchHistory'
import { Search, Bell, LogIn, LogOut, Clock, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

function TopIconBtn({ children, title, onClick, active }: {
  children: React.ReactNode
  title: string
  onClick?: () => void
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 30, height: 30, borderRadius: 8,
        border: 'none', background: 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        color: active ? '#a78bfa' : 'rgba(255,255,255,0.90)',
        transition: 'all 0.15s', flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = active ? '#c4b5fd' : 'rgba(255,255,255,0.95)'
        e.currentTarget.style.transform = 'scale(1.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = active ? '#a78bfa' : 'rgba(255,255,255,0.90)'
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      {children}
    </button>
  )
}

export default function TopBar() {
  const { setActiveView } = useUIStore()
  const { accentRgb } = useThemeStore()
  const { setQuery, setResults, setIsSearching } = useSearchStore()
  const { data: session, status } = useSession()
  const router = useRouter()

  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setHistory(getHistory()) }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (input.trim().length < 2) { setSuggestions([]); return }
    setLoadingSuggestions(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const tracks = await searchTracks(input)
        // Extract plain song names: strip " - ArtistName" suffix if present,
        // then deduplicate so the list feels like a real suggestions menu
        const seen = new Set<string>()
        const names: string[] = []
        for (const t of tracks) {
          const clean = t.title
            .replace(/\s*[-–]\s*(official\s*(video|audio|music\s*video|lyric\s*video)?|lyrics?|hd|4k|\d{4}).*$/i, '')
            .trim()
          if (clean && !seen.has(clean.toLowerCase())) {
            seen.add(clean.toLowerCase())
            names.push(clean)
          }
        }
        setSuggestions(names.slice(0, 6))
      } catch { setSuggestions([]) }
      finally { setLoadingSuggestions(false) }
    }, 350)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [input])

  // FIX 1: added router.push('/') so search results render on the home page
  // regardless of which route (e.g. /lyrics) the user is currently on
  const commit = async (q: string) => {
    if (!q.trim()) return
    saveHistory(q)
    setHistory(getHistory())
    setInput(q)
    setFocused(false)
    inputRef.current?.blur()
    setQuery(q)
    setIsSearching(true)
    setActiveView('search')
    router.push('/')          // ← navigate home so SearchView is mounted
    try {
      const tracks = await searchTracks(q)
      setResults(tracks)
    } finally { setIsSearching(false) }
  }

  const showDropdown = focused && (history.length > 0 || input.trim().length >= 2)
  const filteredHistory = input.trim()
    ? history.filter(h => h.toLowerCase().includes(input.toLowerCase()))
    : history

  return (
    <>
      {/* FIX 2: full-screen blur backdrop when dropdown is open */}
      {showDropdown && (
        <div
          aria-hidden
          onClick={() => setFocused(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            background: 'rgba(0,0,0,0.35)',
            transition: 'opacity 0.2s',
          }}
        />
      )}

      <div style={{
        height: 56, display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: 12,
        position: 'fixed', top: 0, zIndex: 50, width: '100%',
        background: 'rgba(9,9,14,0.92)',
        backdropFilter: 'blur(60px) saturate(200%)',
        WebkitBackdropFilter: 'blur(60px) saturate(200%)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>

        {/* Accent glow — mirrors player */}
        <div aria-hidden style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '40%', height: 56, pointerEvents: 'none',
          background: `radial-gradient(ellipse at top, rgba(${accentRgb},0.07) 0%, transparent 70%)`,
          transition: 'background 1.2s ease',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: `linear-gradient(145deg, rgba(${accentRgb},0.9), rgba(${accentRgb},0.5))`,
            border: `1px solid rgba(${accentRgb},0.4)`,
            boxShadow: `0 2px 16px rgba(${accentRgb},0.35)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, transition: 'all 1.2s ease',
          }}>🌊</div>
          <span style={{
            fontSize: 15, fontWeight: 700, letterSpacing: '-0.025em',
            color: 'rgba(255,255,255,0.93)',
          }}>Wavefront</span>
        </div>

        {/* Search — center */}
        <div style={{ flex: 1, maxWidth: 440, margin: '0 auto', position: 'relative', zIndex: 51 }}>
          <Search size={13} style={{
            position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
            color: focused ? `rgba(${accentRgb},0.8)` : 'rgba(255,255,255,0.25)',
            pointerEvents: 'none', zIndex: 2, transition: 'color 0.2s',
          }} />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => { setFocused(true); setHistory(getHistory()) }}
            onBlur={() => setTimeout(() => setFocused(false), 180)}
            onKeyDown={(e) => { if (e.key === 'Enter') commit(input) }}
            placeholder="Search songs, artists, albums..."
            style={{
              width: '100%', paddingLeft: 36, paddingRight: input ? 34 : 16,
              paddingTop: 7, paddingBottom: 7, borderRadius: 99,
              background: focused ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
              border: focused
                ? `1px solid rgba(${accentRgb},0.40)`
                : '1px solid rgba(255,255,255,0.08)',
              boxShadow: focused ? `0 0 0 3px rgba(${accentRgb},0.08)` : 'none',
              color: 'rgba(255,255,255,0.88)', fontSize: 13, outline: 'none',
              transition: 'all 0.2s', boxSizing: 'border-box' as const,
              letterSpacing: '-0.005em',
            }}
          />
          {input && (
            <button
              onClick={() => { setInput(''); setSuggestions([]) }}
              style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.28)', display: 'flex', padding: 4,
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.28)'}
            >
              <X size={11} />
            </button>
          )}

          {/* Dropdown */}
          {showDropdown && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
              background: 'rgba(9,9,14,0.96)',
              backdropFilter: 'blur(60px) saturate(200%)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, overflow: 'hidden', zIndex: 200,
              boxShadow: `0 20px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(${accentRgb},0.06)`,
            }}>

              {filteredHistory.length > 0 && (
                <>
                  <div style={{ padding: '10px 14px 5px', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.20)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                    Recent
                  </div>
                  {filteredHistory.slice(0, 4).map((h) => (
                    <DropdownRow
                      key={h} accentRgb={accentRgb}
                      left={<Clock size={13} style={{ color: 'rgba(255,255,255,0.22)', flexShrink: 0 }} />}
                      label={h} onClick={() => commit(h)}
                      onRemove={() => { removeHistory(h); setHistory(getHistory()) }}
                    />
                  ))}
                </>
              )}

              {filteredHistory.length > 0 && (suggestions.length > 0 || loadingSuggestions) && (
                <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
              )}

              {loadingSuggestions && (
                <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 12, height: 12, borderRadius: '50%',
                    border: `1.5px solid rgba(${accentRgb},0.2)`,
                    borderTopColor: `rgba(${accentRgb},0.9)`,
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.25)' }}>Finding songs…</span>
                  <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </div>
              )}

              {!loadingSuggestions && suggestions.length > 0 && (
                <>
                  <div style={{ padding: '10px 14px 5px', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.20)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                    Suggestions
                  </div>
                  {suggestions.map((name) => (
                    <DropdownRow
                      key={name} accentRgb={accentRgb}
                      left={<Search size={13} style={{ color: 'rgba(255,255,255,0.22)', flexShrink: 0 }} />}
                      label={name}
                      onClick={() => commit(name)}
                    />
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, position: 'relative', zIndex: 1 }}>

          <TopIconBtn title="Notifications">
            <Bell size={14} />
          </TopIconBtn>

          {/* Divider */}
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)', margin: '0 2px' }} />

          {status === 'loading' ? (
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
          ) : session ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                title={session.user?.name || 'Profile'}
                style={{
                  width: 30, height: 30, borderRadius: '50%',
                  overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
                  border: `1.5px solid rgba(${accentRgb},0.50)`,
                  boxShadow: `0 0 12px rgba(${accentRgb},0.25)`,
                  transition: 'all 1.2s ease',
                }}
              >
                {session.user?.image
                  ? <img src={session.user.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{
                      width: '100%', height: '100%',
                      background: `linear-gradient(135deg, rgba(${accentRgb},0.8), rgba(${accentRgb},0.4))`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 600, color: 'white',
                    }}>{session.user?.name?.[0] || '?'}</div>
                }
              </div>
              <TopIconBtn title="Sign out" onClick={() => signOut()}>
                <LogOut size={13} />
              </TopIconBtn>
            </div>
          ) : (
            <button
              onClick={() => router.push('/auth/signin')}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '6px 14px', borderRadius: 99,
                background: 'white',
                border: 'none',
                color: '#000',
                fontSize: 12.5, fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                boxShadow: `0 2px 16px rgba(${accentRgb},0.35)`,
                whiteSpace: 'nowrap' as const,
                letterSpacing: '-0.005em',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <LogIn size={12} />
              Sign in
            </button>
          )}
        </div>
      </div>
    </>
  )
}

function DropdownRow({ accentRgb, left, label, sub, onClick, onRemove }: {
  accentRgb: string
  left: React.ReactNode
  label: string
  sub?: string
  onClick: () => void
  onRemove?: () => void
}) {
  return (
    <div
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', cursor: 'pointer', transition: 'background 0.12s' }}
      onMouseEnter={(e) => e.currentTarget.style.background = `rgba(${accentRgb},0.08)`}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      {left}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.80)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>{label}</p>
        {sub && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.30)', marginTop: 1 }}>{sub}</p>}
      </div>
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.18)', display: 'flex', padding: 3, borderRadius: 4, flexShrink: 0, transition: 'color 0.15s' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.18)'}
        >
          <X size={11} />
        </button>
      )}
    </div>
  )
}
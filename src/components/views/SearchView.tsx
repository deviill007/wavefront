'use client'

import { useState } from 'react'
import { searchTracks, resolveStream, Track } from '@/lib/api'
import { usePlayerStore } from '@/stores/playerStore'
import { useThemeStore } from '@/stores/themeStore'
import TrackCard from '@/components/ui/TrackCard'
import { Search, Sparkles, Clock, X } from 'lucide-react'

const HISTORY_KEY = 'wf_search_history'

function getHistory(): string[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') }
  catch { return [] }
}

function saveHistory(q: string) {
  const h = getHistory().filter(x => x !== q)
  localStorage.setItem(HISTORY_KEY, JSON.stringify([q, ...h].slice(0, 8)))
}

function removeHistory(q: string) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(getHistory().filter(x => x !== q)))
}

export default function SearchView() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Track[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [focused, setFocused] = useState(false)
  const [history, setHistory] = useState<string[]>(getHistory())

  const { currentTrack, isPlaying, setCurrentTrack, setStreamUrl, setIsLoading } = usePlayerStore()
  const { accentRgb } = useThemeStore()

  const doSearch = async (q: string) => {
    if (!q.trim()) return
    setQuery(q)
    setFocused(false)
    setIsSearching(true)
    saveHistory(q)
    setHistory(getHistory())
    try {
      const tracks = await searchTracks(q)
      setResults(tracks)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSearching(false)
    }
  }

  const handlePlay = async (track: Track) => {
    if (loadingId === track.id) return
    setLoadingId(track.id)
    setIsLoading(true)
    setCurrentTrack(track)
    try {
      const stream = await resolveStream(track.id)
      setStreamUrl(stream.url!)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingId(null)
      setIsLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 28px 0' }}>

      {/* Search input */}
      <div style={{ position: 'relative', marginBottom: 36 }}>
        <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.30)', pointerEvents: 'none', zIndex: 2 }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => e.key === 'Enter' && doSearch(query)}
          placeholder="Songs, artists, albums..."
          style={{
            width: '100%', paddingLeft: 46, paddingRight: 48,
            paddingTop: 14, paddingBottom: 14,
            borderRadius: 14, background: 'rgba(255,255,255,0.06)',
            border: focused ? `1px solid rgba(${accentRgb},0.45)` : '1px solid rgba(255,255,255,0.09)',
            boxShadow: focused ? `0 0 0 3px rgba(${accentRgb},0.10)` : 'none',
            color: 'rgba(255,255,255,0.90)', fontSize: 14, outline: 'none',
            letterSpacing: '-0.005em', transition: 'all 0.2s', boxSizing: 'border-box',
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]) }}
            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.30)', display: 'flex', alignItems: 'center', padding: 4 }}
          >
            <X size={14} />
          </button>
        )}

        {/* Dropdown — history + suggestions */}
        {focused && !isSearching && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
            background: 'rgba(14,14,20,0.98)', backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
            overflow: 'hidden', zIndex: 100,
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          }}>
            {history.length > 0 && (
              <>
                <div style={{ padding: '10px 16px 6px', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.20)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                  Recent searches
                </div>
                {history.map((h) => (
                  <div
                    key={h}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', cursor: 'pointer', transition: 'background 0.12s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Clock size={13} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
                    <span
                      style={{ flex: 1, fontSize: 13.5, color: 'rgba(255,255,255,0.70)', letterSpacing: '-0.005em' }}
                      onClick={() => doSearch(h)}
                    >
                      {h}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeHistory(h)
                        setHistory(getHistory())
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.20)', display: 'flex', alignItems: 'center', padding: 3, borderRadius: 4 }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.20)'}
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </>
            )}
            {!history.length && (
              <div style={{ padding: '16px', fontSize: 13, color: 'rgba(255,255,255,0.20)', textAlign: 'center' }}>
                Start typing to search
              </div>
            )}
          </div>
        )}
      </div>

      {/* Searching spinner */}
      {isSearching && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '32px 0' }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid rgba(${accentRgb},0.2)`, borderTopColor: `rgba(${accentRgb},0.9)`, animation: 'spin 0.7s linear infinite' }} />
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.30)' }}>Searching...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && !isSearching && (
        <div>
          <p style={{ fontSize: 10.5, fontWeight: 600, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 14 }}>
            {results.length} results — "{query}"
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {results.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onPlay={handlePlay}
                isPlaying={currentTrack?.id === track.id && isPlaying}
                isLoading={loadingId === track.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {results.length === 0 && !isSearching && (
        <div style={{ textAlign: 'center', marginTop: 60 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <Search size={22} style={{ color: 'rgba(255,255,255,0.14)' }} />
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.20)', marginBottom: 5 }}>Search for any song</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.10)' }}>Powered by YouTube Music</p>
        </div>
      )}
    </div>
  )
}
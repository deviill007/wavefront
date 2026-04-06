'use client'

import { useEffect, useState } from 'react'
import { usePlayerStore } from '@/stores/playerStore'
import { useThemeStore } from '@/stores/themeStore'
import { useSearchStore } from '@/stores/searchStore'
import { resolveStream } from '@/lib/api'
import { getHistory, removeHistory } from '@/lib/searchHistory'
import TrackCard from '@/components/ui/TrackCard'
import { Clock, X, Search } from 'lucide-react'
import type { Track } from '@/lib/api'

export default function SearchView() {
  const { accentRgb } = useThemeStore()
  const { query, results, isSearching } = useSearchStore()
  const { currentTrack, isPlaying, setCurrentTrack, setStreamUrl, setIsLoading } = usePlayerStore()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => { setHistory(getHistory()) }, [])

  const handlePlay = async (track : Track) => {
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
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 28px 0', paddingTop: 70 }}>

      {/* Searching spinner */}
      {isSearching && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '40px 0' }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid rgba(${accentRgb},0.2)`, borderTopColor: `rgba(${accentRgb},0.9)`, animation: 'spin 0.7s linear infinite' }} />
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.30)' }}>Searching…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {/* Results */}
      {!isSearching && results.length > 0 && (
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

      {/* No results yet — show history */}
      {!isSearching && results.length === 0 && (
        <>
          {history.length > 0 ? (
            <div>
              <p style={{ fontSize: 10.5, fontWeight: 600, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 14 }}>
                Recent searches
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {history.map((h) => (
                  <div
                    key={h}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s', cursor: 'default' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = `rgba(${accentRgb},0.07)`}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  >
                    <Clock size={14} style={{ color: 'rgba(255,255,255,0.22)', flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 13.5, color: 'rgba(255,255,255,0.65)', letterSpacing: '-0.01em' }}>{h}</span>
                    <button
                      onClick={() => { removeHistory(h); setHistory(getHistory()) }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.18)', display: 'flex', padding: 4, borderRadius: 5 }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.18)'}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: 80 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Search size={22} style={{ color: 'rgba(255,255,255,0.14)' }} />
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.20)', marginBottom: 5 }}>Use the search bar above</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.10)' }}>Powered by YouTube Music</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
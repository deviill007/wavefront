'use client'

import { useState } from 'react'
import { searchTracks, resolveStream, Track } from '@/lib/api'
import { usePlayerStore } from '@/stores/playerStore'
import TrackCard from '@/components/ui/TrackCard'
import Player from '@/components/player/Player'
import { Search } from 'lucide-react'

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Track[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const {
    currentTrack,
    isPlaying,
    setCurrentTrack,
    setStreamUrl,
    setIsLoading,
  } = usePlayerStore()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const tracks = await searchTracks(query)
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
      console.error('Failed to play:', err)
    } finally {
      setLoadingId(null)
      setIsLoading(false)
    }
  }

  return (
    <main
      className="min-h-screen pb-28"
      style={{
        background: 'linear-gradient(135deg, #0d0f14 0%, #12151c 100%)',
      }}
    >
      {/* Ambient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 15% 20%, rgba(139,124,248,0.10) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 85% 10%, rgba(96,165,250,0.08) 0%, transparent 70%)
          `
        }}
      />

      <div className="relative max-w-2xl mx-auto px-4 pt-16">

        {/* Header */}
<div className="mb-10">
  <h2
    className="text-2xl font-semibold tracking-tight mb-1"
    style={{
      background: 'linear-gradient(135deg, #e8eaf0, rgba(139,124,248,0.9))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}
  >
    Search
  </h2>
  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
    Find any song in the world
  </p>
</div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search songs, artists, albums..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder-white/25 outline-none text-sm"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(139,124,248,0.4)'
                e.target.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.07), 0 0 0 3px rgba(139,124,248,0.10)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.10)'
                e.target.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.07)'
              }}
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: 'rgba(139,124,248,0.25)',
                border: '1px solid rgba(139,124,248,0.35)',
                color: '#c4b5fd',
              }}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Results */}
        {results.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-white/20 text-xs mb-2 px-1">
              {results.length} results for "{query}"
            </p>
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
        )}

        {/* Empty state */}
        {results.length === 0 && (
          <div className="text-center mt-20">
            <div className="text-4xl mb-4">🎵</div>
            <p className="text-white/20 text-sm">
              Search for any song to start listening
            </p>
          </div>
        )}

      </div>

      {/* Player */}
      <Player />
    </main>
  )
}
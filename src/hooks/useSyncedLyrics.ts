import { useEffect } from 'react'
import { usePlayerStore } from '@/stores/playerStore'
import { fetchLyrics } from '@/lib/api'

export function useSyncedLyrics() {
  const {
    currentTrack,
    progress,
    lyrics,
    setLyrics,
    setActiveLyricIndex,
  } = usePlayerStore()

  useEffect(() => {
    if (!currentTrack) return
    setLyrics(null)
    setActiveLyricIndex(-1)

    let cancelled = false

    // Timeout — if no lyrics found in 10s, set empty so loader stops
    const timeout = setTimeout(() => {
      if (!cancelled) {
        setLyrics({ synced: [], plain: '', source: 'none' })
      }
    }, 10000)

    fetchLyrics(
      currentTrack.title,
      currentTrack.artist,
      currentTrack.duration
    ).then(data => {
      if (cancelled) return
      clearTimeout(timeout)
      // If null returned, set empty object so loader stops
      setLyrics(data ?? { synced: [], plain: '', source: 'none' })
    })

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [currentTrack?.id])

  useEffect(() => {
    if (!lyrics?.synced?.length) return

    let active = -1
    for (let i = 0; i < lyrics.synced.length; i++) {
      if (lyrics.synced[i].time <= progress) {
        active = i
      } else {
        break
      }
    }

    setActiveLyricIndex(active)
  }, [progress, lyrics])
}
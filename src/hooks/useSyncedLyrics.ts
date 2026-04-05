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

  // Fetch lyrics when track changes
  useEffect(() => {
    if (!currentTrack) return
    setLyrics(null)
    setActiveLyricIndex(-1)

    fetchLyrics(
      currentTrack.title,
      currentTrack.artist,
      currentTrack.duration
    ).then(data => {
      setLyrics(data)
    })
  }, [currentTrack?.id])

  // Update active lyric line as song progresses
  useEffect(() => {
    if (!lyrics?.synced?.length) return

    // Find current line — last line whose time <= progress
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
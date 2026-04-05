import { useEffect } from 'react'
import { usePlayerStore } from '@/stores/playerStore'

export function usePlayerShortcuts(
  audioRef: React.RefObject<HTMLAudioElement | null>
) {
  const {
    isPlaying,
    volume,
    setIsPlaying,
    setVolume,
    setProgress,
    currentTrack,
  } = usePlayerStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      switch (e.code) {
        // Spacebar — play/pause
        case 'Space':
          e.preventDefault()
          if (!audioRef.current) return
          if (isPlaying) {
            audioRef.current.pause()
            setIsPlaying(false)
          } else {
            audioRef.current.play()
            setIsPlaying(true)
          }
          break

        // Arrow right — seek forward 5s
        case 'ArrowRight':
          e.preventDefault()
          if (!audioRef.current) return
          audioRef.current.currentTime = Math.min(
            audioRef.current.duration,
            audioRef.current.currentTime + 5
          )
          setProgress(audioRef.current.currentTime)
          break

        // Arrow left — seek backward 5s
        case 'ArrowLeft':
          e.preventDefault()
          if (!audioRef.current) return
          audioRef.current.currentTime = Math.max(
            0,
            audioRef.current.currentTime - 5
          )
          setProgress(audioRef.current.currentTime)
          break

        // Arrow up — volume up
        case 'ArrowUp':
          e.preventDefault()
          setVolume(Math.min(1, volume + 0.05))
          break

        // Arrow down — volume down
        case 'ArrowDown':
          e.preventDefault()
          setVolume(Math.max(0, volume - 0.05))
          break

        // M — mute/unmute
        case 'KeyM':
          setVolume(volume > 0 ? 0 : 0.8)
          break
      }
    }

    // Middle mouse scroll for volume on the whole window
    const handleWheel = (e: WheelEvent) => {
      // Only if hovering over the player area (bottom 80px)
      const fromBottom = window.innerHeight - e.clientY
      if (fromBottom > 80) return

      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.05 : 0.05
      setVolume(Math.min(1, Math.max(0, volume + delta)))
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [isPlaying, volume, currentTrack])
}
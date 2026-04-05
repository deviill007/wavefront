import { useEffect } from 'react'
import { usePlayerStore } from '@/stores/playerStore'
import { getAudioRef } from '@/components/player/AudioManager'

export function usePlayerShortcuts() {
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
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      const audio = getAudioRef()

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          if (!audio) return
          if (isPlaying) {
            audio.pause()
            setIsPlaying(false)
          } else {
            audio.play().catch(() => {})
            setIsPlaying(true)
          }
          break

        case 'ArrowRight':
          e.preventDefault()
          if (!audio) return
          audio.currentTime = Math.min(audio.duration, audio.currentTime + 5)
          setProgress(audio.currentTime)
          break

        case 'ArrowLeft':
          e.preventDefault()
          if (!audio) return
          audio.currentTime = Math.max(0, audio.currentTime - 5)
          setProgress(audio.currentTime)
          break

        case 'ArrowUp':
          e.preventDefault()
          setVolume(Math.min(1, volume + 0.05))
          break

        case 'ArrowDown':
          e.preventDefault()
          setVolume(Math.max(0, volume - 0.05))
          break

        case 'KeyM':
          setVolume(volume > 0 ? 0 : 0.8)
          break
      }
    }

    const handleWheel = (e: WheelEvent) => {
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
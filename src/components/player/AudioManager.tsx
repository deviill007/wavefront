'use client'

import { useEffect, useRef } from 'react'
import { usePlayerStore } from '@/stores/playerStore'

let globalAudioRef: HTMLAudioElement | null = null

export function getAudioRef() {
  return globalAudioRef
}

export default function AudioManager() {
  const audioRef = useRef<HTMLAudioElement>(null)

  const {
    streamUrl,
    volume,
    setIsPlaying,
    setProgress,
    setDuration,
    playNext,
  } = usePlayerStore()

  useEffect(() => {
    if (audioRef.current) globalAudioRef = audioRef.current
  }, [])

  useEffect(() => {
    if (!streamUrl || !audioRef.current) return
    audioRef.current.src = streamUrl
    audioRef.current.volume = volume
    audioRef.current.play().catch(() => {})
    setIsPlaying(true)
  }, [streamUrl])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const handleEnded = () => {
      playNext({ current: globalAudioRef } as any)
    }
    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [playNext])

  return (
    <audio
      ref={audioRef}
      onTimeUpdate={() => setProgress(audioRef.current?.currentTime || 0)}
      onDurationChange={() => setDuration(audioRef.current?.duration || 0)}
      style={{ display: 'none' }}
    />
  )
}
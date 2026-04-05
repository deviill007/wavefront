'use client'

import { useEffect, useRef } from 'react'
import { usePlayerStore } from '@/stores/playerStore'
import { Play, Pause, Volume2, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react'

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const {
    currentTrack,
    streamUrl,
    isPlaying,
    volume,
    progress,
    duration,
    setIsPlaying,
    setProgress,
    setDuration,
    setVolume,
  } = usePlayerStore()

  useEffect(() => {
    if (streamUrl && audioRef.current) {
      audioRef.current.src = streamUrl
      audioRef.current.volume = volume
      audioRef.current.play()
      setIsPlaying(true)
    }
  }, [streamUrl])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setProgress(time)
    }
  }

  const progressPercent = duration ? (progress / duration) * 100 : 0

  if (!currentTrack) return null

  return (
    <div className="fixed bottom-0 z-50" style={{ left: '240px', right: '288px' }}>
      {/* Glass player bar */}
      <div
        style={{
          background: 'rgba(12,12,18,0.75)',
          backdropFilter: 'blur(40px) saturate(180%)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
        className="px-8 py-4"
      >
        <div className="flex items-center gap-8">

          {/* Track info */}
          <div className="flex items-center gap-3 w-56 flex-shrink-0">
            <div className="relative flex-shrink-0">
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className="w-11 h-11 rounded-xl object-cover"
                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
              />
              {/* Glow behind art */}
              <div
                className="absolute inset-0 rounded-xl -z-10"
                style={{
                  background: `url(${currentTrack.thumbnail})`,
                  backgroundSize: 'cover',
                  filter: 'blur(12px)',
                  opacity: 0.5,
                  transform: 'scale(1.2)',
                }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate leading-tight">
                {currentTrack.title}
              </p>
              <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>
                {currentTrack.artist}
              </p>
            </div>
          </div>

          {/* Center controls */}
          <div className="flex-1 flex flex-col items-center gap-3">

            {/* Buttons */}
            <div className="flex items-center gap-5">
              <button
                className="transition-all"
                style={{ color: 'rgba(255,255,255,0.25)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
              >
                <Shuffle size={15} />
              </button>

              <button
                className="transition-all"
                style={{ color: 'rgba(255,255,255,0.40)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.40)'}
              >
                <SkipBack size={18} />
              </button>

              {/* Play button — glass style from Image 1 */}
              <button
                onClick={togglePlay}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: 'linear-gradient(145deg, rgba(139,124,248,0.35), rgba(96,165,250,0.25))',
                  border: '1px solid rgba(139,124,248,0.40)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.20), 0 4px 16px rgba(139,124,248,0.30)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.20), 0 8px 24px rgba(139,124,248,0.45)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.20), 0 4px 16px rgba(139,124,248,0.30)'
                }}
              >
                {isPlaying
                  ? <Pause size={16} className="text-purple-300" />
                  : <Play size={16} className="text-purple-300 ml-0.5" />
                }
              </button>

              <button
                className="transition-all"
                style={{ color: 'rgba(255,255,255,0.40)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.40)'}
              >
                <SkipForward size={18} />
              </button>

              <button
                className="transition-all"
                style={{ color: 'rgba(255,255,255,0.25)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
              >
                <Repeat size={15} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full flex items-center gap-3">
              <span className="text-xs w-8 text-right tabular-nums"
                style={{ color: 'rgba(255,255,255,0.30)' }}>
                {formatTime(progress)}
              </span>

              {/* Custom progress track */}
              <div
                className="flex-1 relative h-1 rounded-full cursor-pointer group"
                style={{ background: 'rgba(255,255,255,0.08)' }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const ratio = (e.clientX - rect.left) / rect.width
                  const time = ratio * (duration || 0)
                  if (audioRef.current) {
                    audioRef.current.currentTime = time
                    setProgress(time)
                  }
                }}
              >
                {/* Fill */}
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all"
                  style={{
                    width: `${progressPercent}%`,
                    background: 'linear-gradient(90deg, #8b7cf8, #60a5fa)',
                  }}
                />
                {/* Thumb — shows on hover */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    left: `${progressPercent}%`,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 8px rgba(139,124,248,0.6)',
                  }}
                />
              </div>

              <span className="text-xs w-8 tabular-nums"
                style={{ color: 'rgba(255,255,255,0.30)' }}>
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3 w-32 flex-shrink-0">
            <Volume2 size={15} style={{ color: 'rgba(255,255,255,0.30)' }} />
            <div
              className="flex-1 relative h-1 rounded-full cursor-pointer group"
              style={{ background: 'rgba(255,255,255,0.08)' }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const ratio = (e.clientX - rect.left) / rect.width
                setVolume(Math.min(1, Math.max(0, ratio)))
              }}
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{
                  width: `${volume * 100}%`,
                  background: 'linear-gradient(90deg, #8b7cf8, #34d399)',
                }}
              />
              <div
                className="absolute top-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  left: `${volume * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 8px rgba(139,124,248,0.5)',
                }}
              />
            </div>
          </div>

        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={() => setProgress(audioRef.current?.currentTime || 0)}
        onDurationChange={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  )
}
'use client'

import { useEffect } from 'react'
import { usePlayerStore } from '@/stores/playerStore'
import { useThemeStore } from '@/stores/themeStore'
import { useUIStore } from '@/stores/uiStore'
import { useRouter } from 'next/navigation'
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { Volume2, Volume1, VolumeX,
  SkipBack, SkipForward, Shuffle, Repeat, Repeat1,
  AlignLeft, ListMusic, Maximize2, Heart,
} from 'lucide-react'
import { usePlayerShortcuts } from '@/hooks/usePlayerShortcuts'
import { getAudioRef } from './AudioManager'
import { PiMicrophoneStageDuotone } from "react-icons/pi";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function IconBtn({
  children, title, onClick, active, dim
}: {
  children: React.ReactNode
  title: string
  onClick?: () => void
  active?: boolean
  dim?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 30, height: 30, borderRadius: 8,
        border: 'none',
        background: 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        color: active
          ? '#a78bfa'
          : dim
          ? 'rgba(255, 255, 255, 0.8)'
          : 'rgb(255, 255, 255, 0.9)',
        transition: 'all 0.15s',
        flexShrink: 0,
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = active ? '#c4b5fd' : 'rgba(255,255,255,0.85)'
        e.currentTarget.style.transform = 'scale(1.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = active
          ? '#a78bfa'
          : dim
          ? 'rgba(255, 255, 255, 0.8)'
          : 'rgb(255, 255, 255, 0.9)'
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      {children}
      {/* Active dot indicator */}
      {active && (
        <div style={{
          position: 'absolute', bottom: 2, left: '50%',
          transform: 'translateX(-50%)',
          width: 3, height: 3, borderRadius: '50%',
          background: '#a78bfa',
        }} />
      )}
    </button>
  )
}

export default function Player() {
  usePlayerShortcuts()
  const router = useRouter()
  const { setRightPanel } = useUIStore()

  const {
    currentTrack, isPlaying, volume, progress, duration,
    shuffle, repeat,
    setIsPlaying, setProgress, setVolume,
    playNext, playPrev, toggleShuffle, toggleRepeat,
  } = usePlayerStore()

  const { accentRgb, setFromImage } = useThemeStore()

  useEffect(() => {
    if (currentTrack?.thumbnail) setFromImage(currentTrack.thumbnail)
  }, [currentTrack?.thumbnail])

  useEffect(() => {
    document.title = currentTrack ? `${currentTrack.title} • Wavefront` : 'Wavefront'
  }, [currentTrack])

  const togglePlay = () => {
    const audio = getAudioRef()
    if (!audio) return
    if (isPlaying) { audio.pause(); setIsPlaying(false) }
    else { audio.play().catch(() => {}); setIsPlaying(true) }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    const audio = getAudioRef()
    if (audio) { audio.currentTime = ratio * (duration || 0); setProgress(audio.currentTime) }
  }

  const fakeRef = { current: getAudioRef() }
  const progressPercent = duration ? (progress / duration) * 100 : 0

  if (!currentTrack) return null

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999 }}>

      {/* Accent glow */}
      <div aria-hidden style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '50%', height: 60, pointerEvents: 'none',
        background: `radial-gradient(ellipse at bottom, rgba(${accentRgb}, 0.10) 0%, transparent 70%)`,
        transition: 'background 1.2s ease',
      }} />
      
      <div style={{
        background: 'rgba(9,9,14,0.92)',
        backdropFilter: 'blur(60px) saturate(200%)',
        WebkitBackdropFilter: 'blur(60px) saturate(200%)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '0 24px',
        height: 72,
        display: 'flex', alignItems: 'center',
        position: 'relative',
      }}>

        {/* ── LEFT: Track info ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 260, flexShrink: 0 }}>

          {/* Album art */}
          <div
            style={{ position: 'relative', flexShrink: 0, cursor: 'pointer' }}
            onClick={() => router.push('/lyrics')}
          >
            <div style={{
              position: 'absolute', inset: -3, borderRadius: 12,
              backgroundImage: `url(${currentTrack.thumbnail})`,
              backgroundSize: 'cover',
              filter: 'blur(12px)', opacity: 0.45,
              transform: 'scale(0.9)',
            }} />
            <img
              src={currentTrack.thumbnail}
              alt={currentTrack.title}
              style={{
                width: 44, height: 44, borderRadius: 10,
                objectFit: 'cover', position: 'relative',
                border: '1px solid rgba(255,255,255,0.10)', display: 'block',
              }}
            />
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{
              fontSize: 13, fontWeight: 500,
              color: 'rgba(255,255,255,0.93)',
              overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
              marginBottom: 1, letterSpacing: '-0.01em',
            }}>
              {currentTrack.title}
            </p>
            <p style={{
              fontSize: 11.5, color: 'rgba(255,255,255,0.38)',
              overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
            }}>
              {currentTrack.artist}
            </p>
          </div>

          {/* Heart */}
          <IconBtn title="Like" dim>
            <Heart size={14} />
          </IconBtn>
        </div>

        {/* ── CENTER: Controls ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>

          {/* Buttons row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <IconBtn
              title={`Shuffle ${shuffle ? 'on' : 'off'}`}
              onClick={toggleShuffle}
              active={shuffle}
              dim={!shuffle}
            >
              <Shuffle size={14} />
            </IconBtn>

            <IconBtn title="Previous" onClick={() => playPrev(fakeRef as any)}>
              <SkipBack size={18} strokeWidth={2} />
            </IconBtn>

            {/* Play/Pause — main button */}
            <button
              onClick={togglePlay}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'white',
                border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                boxShadow: `0 2px 16px rgba(${accentRgb},0.35)`,
                margin: '0 4px',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isPlaying
                ? <FaPause size={14} style={{ color: '#000' }} />
                : <FaPlay size={14} style={{ color: '#000', marginLeft: 2 }} />
              }
            </button>

            <IconBtn title="Next" onClick={() => playNext(fakeRef as any)}>
              <SkipForward size={18} strokeWidth={2} />
            </IconBtn>

            <IconBtn
              title={`Repeat: ${repeat}`}
              onClick={toggleRepeat}
              active={repeat !== 'none'}
              dim={repeat === 'none'}
            >
              {repeat === 'one' ? <Repeat1 size={14} /> : <Repeat size={14} />}
            </IconBtn>
          </div>

          {/* Time + progress */}
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)', width: 32, textAlign: 'right', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(progress)}
            </span>
            <div
              className="group"
              style={{ flex: 1, height: 3, borderRadius: 999, background: 'rgba(255,255,255,0.08)', position: 'relative', cursor: 'pointer' }}
              onClick={handleSeek}
            >
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 999, width: `${progressPercent}%`, background: `rgba(${accentRgb},0.9)`, transition: 'background 1.2s ease' }} />
              <div className="group-hover:opacity-100" style={{ position: 'absolute', top: '50%', left: `${progressPercent}%`, transform: 'translate(-50%,-50%)', width: 11, height: 11, borderRadius: '50%', background: '#fff', opacity: 0, transition: 'opacity 0.12s', pointerEvents: 'none' }} />
            </div>
            <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)', width: 32, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* ── RIGHT: Volume + actions ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: 260, flexShrink: 0, justifyContent: 'flex-end' }}>

          <IconBtn title="Lyrics" onClick={() => router.push('/lyrics')}>
            <PiMicrophoneStageDuotone size={14} />
          </IconBtn>

          <IconBtn title="Queue" onClick={() => { setRightPanel('queue') }}>
            <ListMusic size={14} />
          </IconBtn>

          <IconBtn title="Fullscreen" onClick={() => {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen()
            else document.exitFullscreen()
          }}>
            <Maximize2 size={14} />
          </IconBtn>

          {/* Divider */}
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

          {/* Volume */}
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.80)', padding: 4, flexShrink: 0, transition: 'color 0.15s', display: 'flex', alignItems: 'center' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(255, 255, 255)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
          >
            {volume === 0 ? <VolumeX size={14} /> : volume < 0.5 ? <Volume1 size={14} /> : <Volume2 size={14} />}
          </button>

          <div
            className="group"
            style={{ width: 80, position: 'relative', height: 3, borderRadius: 999, background: 'rgba(255,255,255,0.08)', cursor: 'pointer', flexShrink: 0 }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              setVolume(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)))
            }}
          >
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 999, width: `${volume * 100}%`, background: 'rgba(255,255,255,0.7)', transition: 'background 0.15s' }} />
            <div className="group-hover:opacity-100" style={{ position: 'absolute', top: '50%', left: `${volume * 100}%`, transform: 'translate(-50%,-50%)', width: 10, height: 10, borderRadius: '50%', background: '#fff', opacity: 0, transition: 'opacity 0.12s', pointerEvents: 'none' }} />
          </div>
        </div>

      </div>
    </div>
  )
}
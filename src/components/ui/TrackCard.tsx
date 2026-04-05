'use client'

import { Track } from '@/lib/api'
import { Play, Plus } from 'lucide-react'

interface TrackCardProps {
  track: Track
  onPlay: (track: Track) => void
  isPlaying?: boolean
  isLoading?: boolean
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function TrackCard({ track, onPlay, isPlaying, isLoading }: TrackCardProps) {
  return (
    <div
      className="group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
      style={{
        background: isPlaying
          ? 'rgba(139,124,248,0.12)'
          : 'rgba(255,255,255,0.03)',
        border: isPlaying
          ? '1px solid rgba(139,124,248,0.25)'
          : '1px solid rgba(255,255,255,0.06)',
      }}
      onClick={() => onPlay(track)}
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="absolute inset-0 rounded-lg bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {isLoading
            ? <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
            : <Play size={16} className="text-white ml-0.5" />
          }
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isPlaying ? 'text-purple-300' : 'text-white'}`}>
          {track.title}
        </p>
        <p className="text-white/40 text-xs truncate mt-0.5">
          {track.artist}
        </p>
      </div>

      {/* Duration */}
      <span className="text-white/30 text-xs flex-shrink-0">
        {formatDuration(track.duration)}
      </span>
    </div>
  )
}
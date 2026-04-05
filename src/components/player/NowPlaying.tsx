'use client'

import { usePlayerStore } from '@/stores/playerStore'
import { Heart, ListMusic, Share2 } from 'lucide-react'

export default function NowPlaying() {
  const { currentTrack } = usePlayerStore()

  if (!currentTrack) return (
    <aside
      className="fixed right-0 top-0 h-screen w-72 flex flex-col items-center justify-center z-40"
      style={{
        background: 'rgba(10,10,15,0.8)',
        backdropFilter: 'blur(24px)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="text-4xl mb-3">🎵</div>
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.20)' }}>
        Nothing playing yet
      </p>
    </aside>
  )

  return (
    <aside
      className="fixed right-0 top-0 h-screen w-72 flex flex-col z-40 py-8 px-6"
      style={{
        background: 'rgba(10,10,15,0.8)',
        backdropFilter: 'blur(24px)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <p className="text-xs font-medium mb-6"
        style={{ color: 'rgba(255,255,255,0.20)', letterSpacing: '0.08em' }}>
        NOW PLAYING
      </p>

      {/* Album art */}
      <div className="relative mb-6">
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `url(${currentTrack.thumbnail})`,
            backgroundSize: 'cover',
            filter: 'blur(40px)',
            opacity: 0.4,
            transform: 'scale(0.85) translateY(16px)',
          }}
        />
        <img
          src={currentTrack.thumbnail}
          alt={currentTrack.title}
          className="relative w-full aspect-square rounded-2xl object-cover"
          style={{
            boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
          }}
        />
      </div>

      {/* Track info */}
      <div className="mb-6">
        <h3 className="text-white font-semibold text-base leading-tight mb-1 line-clamp-2">
          {currentTrack.title}
        </h3>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>
          {currentTrack.artist}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.40)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f472b6'
            e.currentTarget.style.borderColor = 'rgba(244,114,182,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.40)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
          }}
        >
          <Heart size={15} />
          <span>Like</span>
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.40)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.40)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
          }}
        >
          <Share2 size={15} />
          <span>Share</span>
        </button>
      </div>

      {/* Queue section */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <ListMusic size={15} style={{ color: 'rgba(255,255,255,0.25)' }} />
          <p className="text-xs font-medium"
            style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em' }}>
            UP NEXT
          </p>
        </div>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.20)' }}>
          Queue is empty
        </p>
      </div>
    </aside>
  )
}
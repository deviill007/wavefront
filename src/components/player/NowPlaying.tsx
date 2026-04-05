'use client'

import { usePlayerStore } from '@/stores/playerStore'
import { useThemeStore } from '@/stores/themeStore'
import { useUIStore } from '@/stores/uiStore'
import { getAudioRef } from '@/components/player/AudioManager'
import {
  Heart, Music2, MoreHorizontal,
  Radio, X, Plus, Clock, Disc3, Tv2, ImageIcon,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchRelated, resolveStream, Track } from '@/lib/api'

export default function NowPlaying() {
  const {
    currentTrack, queue, removeFromQueue,
    setCurrentTrack, setStreamUrl, setIsLoading,
    addToQueue, isPlaying, setIsPlaying,
  } = usePlayerStore()
  const { accentRgb } = useThemeStore()
  const { rightPanelTab: tab, setRightPanel: setTab } = useUIStore()

  const [liked, setLiked] = useState(false)
  const [videoMode, setVideoMode] = useState(false)
  const [related, setRelated] = useState<Track[]>([])
  const [loadingRelated, setLoadingRelated] = useState(false)

  // Reset video mode + fetch related when track changes
  useEffect(() => {
    if (!currentTrack) return
    // If we were in video mode from previous track, switch back to art
    // and resume audio for the new track
    setVideoMode(false)
    setRelated([])
    setLoadingRelated(true)
    fetchRelated(currentTrack.id, currentTrack.title, currentTrack.artist).then(tracks => {
      setRelated(tracks)
      setLoadingRelated(false)
    })
  }, [currentTrack?.id])

  function switchToVideo() {
    // Pause the audio player before handing over to YouTube iframe
    const audio = getAudioRef()
    if (audio && !audio.paused) {
      audio.pause()
      setIsPlaying(false)
    }
    setVideoMode(true)
  }

  function switchToArt() {
    setVideoMode(false)
    // Resume audio playback when returning to art mode
    const audio = getAudioRef()
    if (audio && audio.src) {
      audio.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  function formatDuration(s: number) {
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
  }

  async function playRelated(track: Track) {
    setCurrentTrack(track)
    setIsLoading(true)
    try {
      const stream = await resolveStream(track.id)
      setStreamUrl(stream.url!)
    } catch {}
    finally { setIsLoading(false) }
  }

  return (
    <aside
      className="fixed right-0 top-0 h-screen w-[400px] flex flex-col z-40 overflow-hidden"
      style={{
        background: 'rgba(8,8,13,0.94)',
        backdropFilter: 'blur(56px) saturate(180%)',
        WebkitBackdropFilter: 'blur(56px) saturate(180%)',
        borderLeft: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Ambient orbs */}
      <div aria-hidden style={{ position: 'absolute', top: -100, right: -80, width: 360, height: 360, borderRadius: '50%', background: `radial-gradient(circle, rgba(${accentRgb}, 0.13) 0%, transparent 65%)`, pointerEvents: 'none', transition: 'background 1.4s ease', zIndex: 0 }} />
      <div aria-hidden style={{ position: 'absolute', bottom: 60, left: -80, width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, rgba(${accentRgb}, 0.07) 0%, transparent 65%)`, pointerEvents: 'none', transition: 'background 1.4s ease', zIndex: 0 }} />

      {!currentTrack ? (
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, padding: '0 24px' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            <Radio size={22} style={{ color: 'rgba(255,255,255,0.16)' }} />
          </div>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.20)' }}>Nothing playing yet</p>
          <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.10)', textAlign: 'center', lineHeight: 1.65, maxWidth: 160 }}>Pick a track and it'll appear here</p>
        </div>
      ) : (
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 20px 0', flexShrink: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.16)', letterSpacing: '0.13em', textTransform: 'uppercase' }}>Now Playing</span>
            <button
              style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.24)', transition: 'all 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.24)' }}
            >
              <MoreHorizontal size={13} />
            </button>
          </div>

          {/* Art / Video area */}
          <div style={{ padding: '14px 20px 0', flexShrink: 0 }}>

            {/* Toggle pill */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
              <div style={{ display: 'flex', borderRadius: 99, padding: 3, gap: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  onClick={switchToArt}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '4px 11px', borderRadius: 99, border: 'none',
                    cursor: 'pointer', fontSize: 11, fontWeight: 500,
                    transition: 'all 0.18s',
                    background: !videoMode ? 'rgba(255,255,255,0.10)' : 'transparent',
                    color: !videoMode ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.30)',
                    boxShadow: !videoMode ? 'inset 0 1px 0 rgba(255,255,255,0.07)' : 'none',
                  }}
                >
                  <ImageIcon size={11} />
                  Art
                </button>
                <button
                  onClick={switchToVideo}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '4px 11px', borderRadius: 99, border: 'none',
                    cursor: 'pointer', fontSize: 11, fontWeight: 500,
                    transition: 'all 0.18s',
                    background: videoMode ? `rgba(${accentRgb}, 0.22)` : 'transparent',
                    color: videoMode ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.30)',
                    boxShadow: videoMode ? `inset 0 1px 0 rgba(255,255,255,0.07), 0 0 0 1px rgba(${accentRgb}, 0.28)` : 'none',
                  }}
                >
                  <Tv2 size={11} />
                  Video
                </button>
              </div>
            </div>

            {/* Media container */}
            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
              {videoMode ? (
                // YouTube embed — key={id} forces remount on track change
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                  <iframe
                    key={currentTrack.id}
                    src={`https://www.youtube-nocookie.com/embed/${currentTrack.id}?autoplay=1&rel=0&modestbranding=1`}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
                </div>
              ) : (
                // Album art
                <>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 18, backgroundImage: `url(${currentTrack.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(32px)', opacity: 0.45, transform: 'scale(0.87) translateY(18px)', zIndex: 0 }} />
                  <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', zIndex: 1 }}>
                    <img src={currentTrack.thumbnail} alt={currentTrack.title} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 45%, rgba(0,0,0,0.15) 100%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', inset: 0, borderRadius: 16, border: '1px solid rgba(255,255,255,0.10)', pointerEvents: 'none' }} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Track info */}
          <div style={{ padding: '14px 20px 0', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.92)', lineHeight: 1.3, letterSpacing: '-0.015em', marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {currentTrack.title}
                </h3>
                <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {currentTrack.artist}
                </p>
              </div>
              <button
                onClick={() => setLiked(!liked)}
                style={{ flexShrink: 0, marginTop: 2, width: 34, height: 34, borderRadius: 10, border: liked ? `1px solid rgba(${accentRgb}, 0.40)` : '1px solid rgba(255,255,255,0.08)', background: liked ? `rgba(${accentRgb}, 0.16)` : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.20s cubic-bezier(0.34,1.56,0.64,1)', color: liked ? `rgb(${accentRgb})` : 'rgba(255,255,255,0.28)' }}
              >
                <Heart size={13} style={{ fill: liked ? `rgb(${accentRgb})` : 'none', transition: 'fill 0.18s' }} />
              </button>
            </div>

            {/* Meta pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <Clock size={11} style={{ color: 'rgba(255,255,255,0.30)' }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.40)' }}>{formatDuration(currentTrack.duration)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <Disc3 size={11} style={{ color: 'rgba(255,255,255,0.30)' }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.40)' }}>YouTube Music</span>
              </div>
              {videoMode && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 99, background: `rgba(${accentRgb}, 0.10)`, border: `1px solid rgba(${accentRgb}, 0.22)` }}>
                  <Tv2 size={11} style={{ color: `rgba(${accentRgb}, 0.8)` }} />
                  <span style={{ fontSize: 11, color: `rgba(${accentRgb}, 0.9)` }}>Video mode</span>
                </div>
              )}
            </div>

            {/* Add to queue */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
              <button
                onClick={() => addToQueue(currentTrack)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
              >
                <Plus size={12} /> Add to queue
              </button>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '12px 20px 0', flexShrink: 0 }} />

          {/* Tabs */}
          <div style={{ padding: '12px 20px 0', flexShrink: 0 }}>
            <div style={{ display: 'flex', borderRadius: 12, padding: 3, gap: 3, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {(['info', 'queue'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px 0', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 11.5, fontWeight: 500, transition: 'all 0.18s', background: tab === t ? 'rgba(255,255,255,0.08)' : 'transparent', color: tab === t ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.24)', boxShadow: tab === t ? `0 1px 4px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(${accentRgb}, 0.14)` : 'none' }}
                >
                  <Music2 size={11} />
                  {t === 'info' ? 'Related' : 'Queue'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, padding: '12px 20px 80px', overflowY: 'auto' }}>
            {tab === 'queue' ? (
              <>
                <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.14)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Up Next</p>
                {queue.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', gap: 8 }}>
                    <Music2 size={18} style={{ color: 'rgba(255,255,255,0.13)' }} />
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.17)', textAlign: 'center' }}>Queue is empty</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.10)', textAlign: 'center' }}>Click + on any track to add</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {queue.map((track, i) => (
                      <div key={`${track.id}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <img src={track.thumbnail} alt={track.title} style={{ width: 34, height: 34, borderRadius: 7, objectFit: 'cover', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.80)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{track.title}</p>
                          <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.30)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{track.artist}</p>
                        </div>
                        <button
                          onClick={() => removeFromQueue(i)}
                          style={{ width: 22, height: 22, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(255,255,255,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'color 0.15s' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.20)'}
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.14)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Related Songs</p>
                {loadingRelated ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 0' }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid rgba(${accentRgb}, 0.25)`, borderTopColor: `rgba(${accentRgb}, 0.8)`, animation: 'spin 0.7s linear infinite' }} />
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.20)' }}>Finding related...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </div>
                ) : related.length === 0 ? (
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.17)' }}>No related songs found</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {related.map((track) => (
                      <div
                        key={track.id}
                        onClick={() => playRelated(track)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)' }}
                      >
                        <img src={track.thumbnail} alt={track.title} style={{ width: 34, height: 34, borderRadius: 7, objectFit: 'cover', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.80)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{track.title}</p>
                          <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.30)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{track.artist}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); addToQueue(track) }}
                          style={{ width: 22, height: 22, borderRadius: 6, border: '1px solid rgba(255,255,255,0.07)', background: 'transparent', cursor: 'pointer', color: 'rgba(255,255,255,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.20)'; e.currentTarget.style.background = 'transparent' }}
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      )}
    </aside>
  )
}
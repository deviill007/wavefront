"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/stores/playerStore";
import { useThemeStore } from "@/stores/themeStore";
import {
  Play, Pause, Volume2, Volume1, VolumeX,
  SkipBack, SkipForward, Shuffle, Repeat,
} from "lucide-react";
import { usePlayerShortcuts } from "@/hooks/usePlayerShortcuts";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  usePlayerShortcuts(audioRef);

  const {
    currentTrack, streamUrl, isPlaying, volume, progress, duration,
    setIsPlaying, setProgress, setDuration, setVolume,
  } = usePlayerStore();

  const { accentRgb, setFromImage } = useThemeStore();

  useEffect(() => {
    if (streamUrl && audioRef.current) {
      audioRef.current.src = streamUrl;
      audioRef.current.volume = volume;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [streamUrl]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Extract theme from thumbnail whenever track changes
  useEffect(() => {
    if (currentTrack?.thumbnail) {
      setFromImage(currentTrack.thumbnail);
    }
  }, [currentTrack?.thumbnail]);

  useEffect(() => {
    document.title = currentTrack
      ? `${currentTrack.title} • Wavefront`
      : "Wavefront";
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const progressPercent = duration ? (progress / duration) * 100 : 0;

  if (!currentTrack) return null;

  return (
    <div
      className="fixed bottom-0 z-50"
      style={{ left: "260px", right: "300px" }}
    >
      {/* Ambient accent glow leaking up from player */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: 80,
          background: `radial-gradient(ellipse at bottom, rgba(${accentRgb}, 0.12) 0%, transparent 70%)`,
          pointerEvents: 'none',
          transition: 'background 1.2s ease',
        }}
      />

      <div
        style={{
          background: "rgba(8, 8, 13, 0.88)",
          backdropFilter: "blur(56px) saturate(180%)",
          WebkitBackdropFilter: "blur(56px) saturate(180%)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          boxShadow: `0 -12px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05), 0 -1px 0 rgba(${accentRgb}, 0.08)`,
          padding: "16px 32px 18px",
          position: 'relative',
          transition: 'box-shadow 1.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>

          {/* Track info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: 220, flexShrink: 0 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {/* Thumbnail glow */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 12,
                  backgroundImage: `url(${currentTrack.thumbnail})`,
                  backgroundSize: 'cover',
                  filter: 'blur(20px)',
                  opacity: 0.5,
                  transform: 'scale(0.8) translateY(10px)',
                  zIndex: 0,
                }}
              />
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  objectFit: 'cover',
                  position: 'relative',
                  zIndex: 1,
                  border: '1px solid rgba(255,255,255,0.10)',
                  display: 'block',
                }}
              />
            </div>

            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.90)',
                  letterSpacing: '-0.01em',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  marginBottom: 3,
                }}
              >
                {currentTrack.title}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.35)',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {currentTrack.artist}
              </p>
            </div>
          </div>

          {/* Center — controls + progress */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>

            {/* Control buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {/* Shuffle */}
              <button
                style={{ color: 'rgba(255,255,255,0.22)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.22)')}
              >
                <Shuffle size={14} />
              </button>

              {/* Skip back */}
              <button
                style={{ color: 'rgba(255,255,255,0.45)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
              >
                <SkipBack size={18} />
              </button>

              {/* Play/Pause — accent-tinted glass pill */}
              <button
                onClick={togglePlay}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: `1px solid rgba(${accentRgb}, 0.45)`,
                  background: `linear-gradient(145deg, rgba(${accentRgb}, 0.32) 0%, rgba(${accentRgb}, 0.16) 100%)`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.14), 0 4px 20px rgba(${accentRgb}, 0.28)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.10)';
                  e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.14), 0 8px 28px rgba(${accentRgb}, 0.40)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.14), 0 4px 20px rgba(${accentRgb}, 0.28)`;
                }}
              >
                {isPlaying
                  ? <Pause size={15} style={{ color: 'rgba(255,255,255,0.92)' }} />
                  : <Play size={15} style={{ color: 'rgba(255,255,255,0.92)', marginLeft: 2 }} />
                }
              </button>

              {/* Skip forward */}
              <button
                style={{ color: 'rgba(255,255,255,0.45)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
              >
                <SkipForward size={18} />
              </button>

              {/* Repeat */}
              <button
                style={{ color: 'rgba(255,255,255,0.22)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.22)')}
              >
                <Repeat size={14} />
              </button>
            </div>

            {/* Progress bar */}
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.28)',
                  fontVariantNumeric: 'tabular-nums',
                  width: 36,
                  textAlign: 'right',
                  flexShrink: 0,
                }}
              >
                {formatTime(progress)}
              </span>

              {/* Track */}
              <div
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.07)',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                className="group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const ratio = (e.clientX - rect.left) / rect.width;
                  const time = ratio * (duration || 0);
                  if (audioRef.current) {
                    audioRef.current.currentTime = time;
                    setProgress(time);
                  }
                }}
              >
                {/* Fill */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    borderRadius: 999,
                    width: `${progressPercent}%`,
                    background: `linear-gradient(90deg, rgba(${accentRgb}, 0.9), rgba(${accentRgb}, 0.6))`,
                    transition: 'background 1.2s ease',
                  }}
                />
                {/* Scrubber thumb */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: `${progressPercent}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#fff',
                    opacity: 0,
                    transition: 'opacity 0.15s',
                    boxShadow: `0 0 10px rgba(${accentRgb}, 0.6)`,
                    pointerEvents: 'none',
                  }}
                  className="group-hover:opacity-100"
                />
              </div>

              <span
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.28)',
                  fontVariantNumeric: 'tabular-nums',
                  width: 36,
                  flexShrink: 0,
                }}
              >
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 148, flexShrink: 0 }}>
            <button
              onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.28)',
                padding: 4,
                flexShrink: 0,
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
            >
              {volume === 0
                ? <VolumeX size={14} />
                : volume < 0.5
                ? <Volume1 size={14} />
                : <Volume2 size={14} />
              }
            </button>

            <div
              style={{ flex: 1, position: 'relative', height: 3, borderRadius: 999, background: 'rgba(255,255,255,0.07)', cursor: 'pointer' }}
              className="group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                setVolume(Math.min(1, Math.max(0, ratio)));
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  borderRadius: 999,
                  width: `${volume * 100}%`,
                  background: `rgba(${accentRgb}, 0.75)`,
                  transition: 'background 1.2s ease',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${volume * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#fff',
                  opacity: 0,
                  transition: 'opacity 0.15s',
                  pointerEvents: 'none',
                }}
                className="group-hover:opacity-100"
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
  );
}
"use client";

import { Track } from "@/lib/api";
import { useThemeStore } from "@/stores/themeStore";
import { Play, Loader2, Music2, Plus } from "lucide-react";
import { usePlayerStore } from "@/stores/playerStore";

interface TrackCardProps {
  track: Track;
  onPlay: (track: Track) => void;
  isPlaying?: boolean;
  isLoading?: boolean;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TrackCard({
  track,
  onPlay,
  isPlaying,
  isLoading,
}: TrackCardProps) {
  const { accentRgb } = useThemeStore();
  const { addToQueue } = usePlayerStore();

  return (
    <div
      onClick={() => onPlay(track)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 14px",
        borderRadius: 14,
        border: isPlaying
          ? `1px solid rgba(${accentRgb}, 0.30)`
          : "1px solid rgba(255,255,255,0.06)",
        background: isPlaying
          ? `rgba(${accentRgb}, 0.10)`
          : "rgba(255,255,255,0.03)",
        cursor: "pointer",
        transition: "all 0.18s ease",
        boxShadow: isPlaying
          ? `0 2px 16px rgba(${accentRgb}, 0.12), inset 0 1px 0 rgba(255,255,255,0.04)`
          : "none",
      }}
      onMouseEnter={(e) => {
        if (!isPlaying) {
          e.currentTarget.style.background = "rgba(255,255,255,0.055)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isPlaying) {
          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        }
      }}
    >
      {/* Thumbnail */}
      <div
        className="group"
        style={{ position: "relative", flexShrink: 0, width: 46, height: 46 }}
      >
        <img
          src={track.thumbnail}
          alt={track.title}
          style={{
            width: 46,
            height: 46,
            borderRadius: 10,
            objectFit: "cover",
            display: "block",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />
        {/* Hover overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 10,
            background: "rgba(0,0,0,0.50)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isLoading ? 1 : 0,
            transition: "opacity 0.15s",
          }}
          className="group-hover:opacity-100"
        >
          {isLoading ? (
            <Loader2
              size={16}
              style={{
                color: "rgba(255,255,255,0.8)",
                animation: "spin 0.7s linear infinite",
              }}
            />
          ) : (
            <Play size={15} style={{ color: "#fff", marginLeft: 2 }} />
          )}
        </div>

        {/* Playing indicator bars */}
        {isPlaying && !isLoading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 10,
              background: `rgba(${accentRgb}, 0.45)`,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 2.5,
              paddingBottom: 9,
              transition: "background 1.2s ease",
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: 3,
                  borderRadius: 2,
                  background: "#fff",
                  height: `${10 + i * 4}px`,
                  animation: `eq-bar ${0.4 + i * 0.1}s ease-in-out infinite alternate`,
                  transformOrigin: "bottom",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Track info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 13.5,
            fontWeight: 500,
            letterSpacing: "-0.010em",
            color: isPlaying ? `rgb(${accentRgb})` : "rgba(255,255,255,0.88)",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            marginBottom: 3,
            transition: "color 1.2s ease",
          }}
        >
          {track.title}
        </p>
        <p
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.33)",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {track.artist}
        </p>
      </div>

      {/* Add to queue button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          addToQueue(track);
        }}
        title="Add to queue"
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "rgba(255,255,255,0.25)",
          flexShrink: 0,
          opacity: 0,
          transition: "all 0.15s",
        }}
        className="track-queue-btn"
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.8)";
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.25)";
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }}
      >
        <Plus size={13} />
      </button>

      {/* Duration */}
      <span
        style={{
          fontSize: 11.5,
          color: "rgba(255,255,255,0.22)",
          flexShrink: 0,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "0.01em",
        }}
      >
        {formatDuration(track.duration)}
      </span>

      {/* EQ bar keyframes injected once */}
      <style>{`
        @keyframes eq-bar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1.0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

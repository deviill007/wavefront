"use client";

import { useState } from "react";
import { searchTracks, resolveStream, Track } from "@/lib/api";
import { usePlayerStore } from "@/stores/playerStore";
import { useThemeStore } from "@/stores/themeStore";
import TrackCard from "@/components/ui/TrackCard";
import Player from "@/components/player/Player";
import { Search, Sparkles } from "lucide-react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const {
    currentTrack,
    isPlaying,
    setCurrentTrack,
    setStreamUrl,
    setIsLoading,
  } = usePlayerStore();
  const { accentRgb } = useThemeStore();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const tracks = await searchTracks(query);
      setResults(tracks);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlay = async (track: Track) => {
    if (loadingId === track.id) return;
    setLoadingId(track.id);
    setIsLoading(true);
    setCurrentTrack(track);
    try {
      const stream = await resolveStream(track.id);
      setStreamUrl(stream.url!);
    } catch (err) {
      console.error("Failed to play:", err);
    } finally {
      setLoadingId(null);
      setIsLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", paddingBottom: 120 }}>
      {/* Dynamic ambient wash — responds to accent color */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: `
            radial-gradient(ellipse 55% 45% at 30% 15%, rgba(${accentRgb}, 0.09) 0%, transparent 70%),
            radial-gradient(ellipse 45% 35% at 80% 5%, rgba(${accentRgb}, 0.05) 0%, transparent 65%)
          `,
          transition: "background 1.4s ease",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 680,
          margin: "0 auto",
          padding: "60px 28px 0",
        }}
      >
        {/* Page header */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "-0.030em",
                lineHeight: 1.1,
                display: "inline-block",
                backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(${accentRgb}, 0.85) 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Search
            </h1>
            <Sparkles
              size={18}
              style={{
                color: `rgba(${accentRgb}, 0.6)`,
                marginBottom: 2,
                transition: "color 1.4s ease",
              }}
            />
          </div>
          <p
            style={{
              fontSize: 13.5,
              color: "rgba(255,255,255,0.28)",
              letterSpacing: "-0.005em",
            }}
          >
            Find any song in the world
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ marginBottom: 36 }}>
          <div style={{ position: "relative" }}>
            <Search
              size={17}
              style={{
                position: "absolute",
                left: 18,
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.25)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Songs, artists, albums..."
              style={{
                width: "100%",
                paddingLeft: 48,
                paddingRight: 120,
                paddingTop: 16,
                paddingBottom: 16,
                borderRadius: 16,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.88)",
                fontSize: 14,
                outline: "none",
                letterSpacing: "-0.005em",
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = `rgba(${accentRgb}, 0.40)`;
                e.target.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 3px rgba(${accentRgb}, 0.10)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.09)";
                e.target.style.boxShadow =
                  "inset 0 1px 0 rgba(255,255,255,0.05)";
              }}
            />
            <button
              type="submit"
              disabled={isSearching}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                padding: "8px 18px",
                borderRadius: 11,
                border: `1px solid rgba(${accentRgb}, 0.35)`,
                background: `rgba(${accentRgb}, 0.22)`,
                color: "rgba(255,255,255,0.80)",
                fontSize: 13,
                fontWeight: 500,
                cursor: isSearching ? "not-allowed" : "pointer",
                letterSpacing: "-0.005em",
                transition: "all 0.18s ease",
                opacity: isSearching ? 0.6 : 1,
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (!isSearching) {
                  e.currentTarget.style.background = `rgba(${accentRgb}, 0.32)`;
                  e.currentTarget.style.color = "rgba(255,255,255,0.95)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `rgba(${accentRgb}, 0.22)`;
                e.currentTarget.style.color = "rgba(255,255,255,0.80)";
              }}
            >
              {isSearching ? "Searching…" : "Search"}
            </button>
          </div>
        </form>

        {/* Results */}
        {results.length > 0 && (
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(255,255,255,0.18)",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              {results.length} results — "{query}"
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {results.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  onPlay={handlePlay}
                  isPlaying={currentTrack?.id === track.id && isPlaying}
                  isLoading={loadingId === track.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {results.length === 0 && !isSearching && (
          <div style={{ textAlign: "center", marginTop: 80 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Search size={22} style={{ color: "rgba(255,255,255,0.14)" }} />
            </div>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.20)",
                marginBottom: 6,
              }}
            >
              Search for any song to start listening
            </p>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.10)" }}>
              Powered by YouTube Music
            </p>
          </div>
        )}
      </div>

      <Player />
    </main>
  );
}

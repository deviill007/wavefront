"use client";

import {
  Home,
  Search,
  Library,
  Heart,
  Download,
  Radio,
  Settings,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useThemeStore } from "@/stores/themeStore";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Library, label: "Library", href: "/library" },
  { icon: Heart, label: "Liked Songs", href: "/liked" },
  { icon: Radio, label: "Listen Together", href: "/room" },
  { icon: Download, label: "Downloads", href: "/downloads" },
];

const playlists = [
  "Late Night Mix",
  "Chill Vibes",
  "Workout 🔥",
  "Focus Mode",
  "Sunday Morning",
];

export default function Sidebar() {
  const [active, setActive] = useState("Home");
  const { accentRgb } = useThemeStore();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[260px] flex flex-col z-40"
      style={{
        background: "rgba(8, 8, 12, 0.92)",
        backdropFilter: "blur(48px) saturate(160%)",
        WebkitBackdropFilter: "blur(48px) saturate(160%)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Accent glow top-left */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -60,
          left: -60,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(${accentRgb}, 0.12) 0%, transparent 70%)`,
          pointerEvents: "none",
          transition: "background 1.2s ease",
        }}
      />

      {/* Logo */}
      <div style={{ padding: "28px 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: `linear-gradient(145deg, rgba(${accentRgb}, 0.9), rgba(${accentRgb}, 0.5))`,
              border: `1px solid rgba(${accentRgb}, 0.5)`,
              boxShadow: `0 4px 20px rgba(${accentRgb}, 0.3), inset 0 1px 0 rgba(255,255,255,0.15)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              transition: "all 1.2s ease",
              flexShrink: 0,
            }}
          >
            🌊
          </div>
          <span
            style={{
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: `rgba(255,255,255,0.92)`,
            }}
          >
            Wavefront
          </span>
        </div>
      </div>

      {/* Primary nav */}
      <nav
        style={{
          padding: "0 12px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {navItems.map(({ icon: Icon, label }) => {
          const isActive = active === label;
          return (
            <button
              key={label}
              onClick={() => setActive(label)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 11,
                border: isActive
                  ? `1px solid rgba(${accentRgb}, 0.25)`
                  : "1px solid transparent",
                background: isActive
                  ? `rgba(${accentRgb}, 0.14)`
                  : "transparent",
                color: isActive
                  ? `rgba(${accentRgb !== "32, 32, 40" ? "255,255,255" : "255,255,255"}, 0.90)`
                  : "rgba(255,255,255,0.33)",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                transition: "all 0.18s ease",
                boxShadow: isActive
                  ? `inset 0 1px 0 rgba(255,255,255,0.06)`
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.68)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.33)";
                }
              }}
            >
              <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
              <span
                style={{
                  fontSize: 13.5,
                  fontWeight: isActive ? 500 : 400,
                  letterSpacing: "-0.005em",
                }}
              >
                {label}
              </span>
              {isActive && (
                <div
                  style={{
                    marginLeft: "auto",
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: `rgba(${accentRgb}, 1)`,
                    boxShadow: `0 0 8px rgba(${accentRgb}, 0.7)`,
                    transition: "background 1.2s ease, box-shadow 1.2s ease",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "rgba(255,255,255,0.05)",
          margin: "16px 20px",
        }}
      />

      {/* Playlists */}
      <div style={{ padding: "0 12px", flex: 1, overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 8px",
            marginBottom: 10,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "rgba(255,255,255,0.18)",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
            }}
          >
            Playlists
          </span>
          <button
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "rgba(255,255,255,0.30)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.color = "rgba(255,255,255,0.30)";
            }}
          >
            <Plus size={12} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {playlists.map((name) => (
            <button
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 9,
                border: "1px solid transparent",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                color: "rgba(255,255,255,0.28)",
                transition: "all 0.14s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.color = "rgba(255,255,255,0.62)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(255,255,255,0.28)";
              }}
            >
              {/* Mini color swatch */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: `rgba(${accentRgb}, 0.12)`,
                  border: `1px solid rgba(${accentRgb}, 0.18)`,
                  flexShrink: 0,
                  transition: "background 1.2s ease",
                }}
              />
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 400,
                  letterSpacing: "-0.005em",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div style={{ padding: "12px 12px 20px" }}>
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.05)",
            marginBottom: 12,
          }}
        />
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            borderRadius: 11,
            border: "1px solid transparent",
            background: "transparent",
            color: "rgba(255,255,255,0.25)",
            cursor: "pointer",
            width: "100%",
            transition: "all 0.14s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.color = "rgba(255,255,255,0.55)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "rgba(255,255,255,0.25)";
          }}
        >
          <Settings size={16} strokeWidth={1.8} />
          <span style={{ fontSize: 13, fontWeight: 400 }}>Settings</span>
        </button>
      </div>
    </aside>
  );
}

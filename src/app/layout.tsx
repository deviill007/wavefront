// app/layout.tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Sidebar from "@/components/ui/Sidebar";
import AudioManager from "@/components/player/AudioManager";
import NowPlaying from "@/components/player/NowPlaying";
import Player from '@/components/player/Player'

export const metadata: Metadata = {
  title: "Wavefront",
  description: "Open source music streaming",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body
        style={{
          // Base background — charcoal black, overridden by dynamic theme
          background: "linear-gradient(160deg, #0a0a0f 0%, #0d0d14 100%)",
          minHeight: "100vh",
          colorScheme: "dark",
        }}
      >
        <AudioManager />
        <Sidebar />
        <NowPlaying />
        <Player />

        {/* Main content offset */}
        <div
          style={{
            marginLeft: "260px",
            marginRight: "300px",
            position: "relative",
            zIndex: 1,
            paddingBottom: "90px",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}

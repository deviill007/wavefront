// app/layout.tsx
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import Sidebar from '@/components/ui/Sidebar'
import NowPlaying from '@/components/player/NowPlaying'

export const metadata: Metadata = {
  title: 'Wavefront',
  description: 'Open source music streaming',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body
        style={{
          // Base background — charcoal black, overridden by dynamic theme
          background: 'linear-gradient(160deg, #0a0a0f 0%, #0d0d14 100%)',
          minHeight: '100vh',
          colorScheme: 'dark',
        }}
      >
        {/* Global grain overlay for tactile depth */}
        <div
          aria-hidden
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            opacity: 0.028,
          }}
        />

        <Sidebar />
        <NowPlaying />

        {/* Main content offset */}
        <div
          style={{
            marginLeft: '260px',
            marginRight: '300px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {children}
        </div>
      </body>
    </html>
  )
}
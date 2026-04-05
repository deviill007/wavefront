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
      <body>
        <Sidebar />
        <NowPlaying />
        {/* Main content — offset for sidebar and now playing panel */}
        <div style={{ marginLeft: '240px', marginRight: '288px' }}>
          {children}
        </div>
      </body>
    </html>
  )
}
'use client'

import { signIn } from 'next-auth/react'
import { useThemeStore } from '@/stores/themeStore'
import { Waves } from 'lucide-react'

export default function SignInPage() {
  const { accentRgb } = useThemeStore()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0a0a0f 0%, #0d0d14 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Ambient */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 60% 50% at 50% 40%, rgba(${accentRgb},0.12) 0%, transparent 70%)`,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 380,
        padding: '0 24px',
      }}>
        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 24,
          padding: '40px 36px',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 18,
              background: `linear-gradient(145deg, rgba(${accentRgb},0.9), rgba(${accentRgb},0.5))`,
              border: `1px solid rgba(${accentRgb},0.4)`,
              boxShadow: `0 8px 24px rgba(${accentRgb},0.3)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 24,
            }}>🌊</div>
            <h1 style={{
              fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em',
              color: 'rgba(255,255,255,0.92)', marginBottom: 6,
            }}>
              Sign in to Wavefront
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.30)' }}>
              Free music streaming, forever
            </p>
          </div>

          {/* Google button */}
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 12,
              padding: '13px 20px', borderRadius: 14,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.85)',
              fontSize: 14, fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.18s',
              letterSpacing: '-0.005em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.11)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {/* Google icon */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p style={{
            textAlign: 'center', marginTop: 24,
            fontSize: 12, color: 'rgba(255,255,255,0.18)',
            lineHeight: 1.6,
          }}>
            By signing in you agree to our terms.<br />
            Open source · Ad free · No tracking
          </p>
        </div>
      </div>
    </div>
  )
}
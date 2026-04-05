import { create } from 'zustand'
import { Track, LyricsData } from '@/lib/api'

type RepeatMode = 'none' | 'one' | 'all'

interface PlayerState {
  currentTrack: Track | null
  streamUrl: string | null
  isPlaying: boolean
  isLoading: boolean
  volume: number
  progress: number
  duration: number
  queue: Track[]
  playedHistory: Track[]
  lyrics: LyricsData | null
  activeLyricIndex: number
  shuffle: boolean
  repeat: RepeatMode

  setCurrentTrack: (track: Track) => void
  setStreamUrl: (url: string) => void
  setIsPlaying: (playing: boolean) => void
  setIsLoading: (loading: boolean) => void
  setVolume: (volume: number) => void
  setProgress: (progress: number) => void
  setDuration: (duration: number) => void
  setLyrics: (lyrics: LyricsData | null) => void
  setActiveLyricIndex: (index: number) => void
  addToQueue: (track: Track) => void
  removeFromQueue: (index: number) => void
  clearQueue: () => void
  moveInQueue: (from: number, to: number) => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  playNext: (audioRef: React.RefObject<HTMLAudioElement | null>) => void
  playPrev: (audioRef: React.RefObject<HTMLAudioElement | null>) => void
  playTrack: (track: Track) => void
}

async function resolveAndPlay(track: Track, set: any, get: any) {
  set({ currentTrack: track, isLoading: true, lyrics: null, activeLyricIndex: -1 })
  try {
    const { resolveStream } = await import('@/lib/api')
    const stream = await resolveStream(track.id)
    set({ streamUrl: stream.url, isLoading: false })
  } catch {
    set({ isLoading: false })
  }
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  streamUrl: null,
  isPlaying: false,
  isLoading: false,
  volume: 0.8,
  progress: 0,
  duration: 0,
  queue: [],
  playedHistory: [],
  lyrics: null,
  activeLyricIndex: -1,
  shuffle: false,
  repeat: 'none',

  setCurrentTrack: (track) => set({ currentTrack: track }),
  setStreamUrl: (url) => set({ streamUrl: url }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setLyrics: (lyrics) => set({ lyrics }),
  setActiveLyricIndex: (index) => set({ activeLyricIndex: index }),
  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
  toggleRepeat: () => set((s) => ({
    repeat: s.repeat === 'none' ? 'all' : s.repeat === 'all' ? 'one' : 'none'
  })),

  addToQueue: (track) => set((state) => {
    const alreadyInQueue = state.queue.some((t) => t.id === track.id)
    const isCurrentTrack = state.currentTrack?.id === track.id
    if (alreadyInQueue || isCurrentTrack) return state
    return { queue: [...state.queue, track] }
  }),

  removeFromQueue: (index) => set((state) => ({
    queue: state.queue.filter((_, i) => i !== index)
  })),

  clearQueue: () => set({ queue: [] }),

  moveInQueue: (from, to) => set((state) => {
    const queue = [...state.queue]
    const [moved] = queue.splice(from, 1)
    queue.splice(to, 0, moved)
    return { queue }
  }),

  playTrack: (track) => {
    const state = get()
    const newHistory = state.currentTrack
      ? [...state.playedHistory, state.currentTrack]
      : state.playedHistory
    set({ playedHistory: newHistory })
    resolveAndPlay(track, set, get)
  },

  playNext: async (audioRef) => {
    const { queue, currentTrack, playedHistory, shuffle, repeat } = get()

    // Repeat one — restart current
    if (repeat === 'one') {
      const audio = audioRef.current
      if (audio) {
        audio.currentTime = 0
        audio.play().catch(() => {})
      }
      return
    }

    // Pick next from queue
    if (queue.length > 0) {
      let nextIndex = 0
      if (shuffle) nextIndex = Math.floor(Math.random() * queue.length)
      const next = queue[nextIndex]
      const newQueue = queue.filter((_, i) => i !== nextIndex)
      const newHistory = currentTrack ? [...playedHistory, currentTrack] : playedHistory
      set({ queue: newQueue, playedHistory: newHistory })
      await resolveAndPlay(next, set, get)
      return
    }

    // Repeat all — refetch related
    if (repeat === 'all' || true) {
      if (!currentTrack) return
      try {
        const { fetchRelated } = await import('@/lib/api')
        const related = await fetchRelated(
          currentTrack.id,
          currentTrack.title,
          currentTrack.artist
        )
        if (!related.length) return
        const next = shuffle
          ? related[Math.floor(Math.random() * related.length)]
          : related[0]
        const rest = related.filter(t => t.id !== next.id)
        const newHistory = currentTrack ? [...playedHistory, currentTrack] : playedHistory
        set({ queue: rest, playedHistory: newHistory })
        await resolveAndPlay(next, set, get)
      } catch {
        set({ isLoading: false })
      }
    }
  },

  playPrev: async (audioRef) => {
    const { playedHistory, currentTrack, queue } = get()
    const audio = audioRef.current

    // If more than 3s in — restart
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0
      return
    }

    if (!playedHistory.length) {
      if (audio) audio.currentTime = 0
      return
    }

    const prev = playedHistory[playedHistory.length - 1]
    const newHistory = playedHistory.slice(0, -1)
    const newQueue = currentTrack ? [currentTrack, ...queue] : queue
    set({ queue: newQueue, playedHistory: newHistory })
    await resolveAndPlay(prev, set, get)
  },
}))
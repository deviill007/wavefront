import { create } from 'zustand'
import { Track } from '@/lib/api'

interface PlayerState {
  // Current track
  currentTrack: Track | null
  streamUrl: string | null
  isPlaying: boolean
  isLoading: boolean
  volume: number
  progress: number
  duration: number

  // Queue
  queue: Track[]

  // Actions
  setCurrentTrack: (track: Track) => void
  setStreamUrl: (url: string) => void
  setIsPlaying: (playing: boolean) => void
  setIsLoading: (loading: boolean) => void
  setVolume: (volume: number) => void
  setProgress: (progress: number) => void
  setDuration: (duration: number) => void
  addToQueue: (track: Track) => void
  clearQueue: () => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  streamUrl: null,
  isPlaying: false,
  isLoading: false,
  volume: 0.8,
  progress: 0,
  duration: 0,
  queue: [],

  setCurrentTrack: (track) => set({ currentTrack: track }),
  setStreamUrl: (url) => set({ streamUrl: url }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
  clearQueue: () => set({ queue: [] }),
}))
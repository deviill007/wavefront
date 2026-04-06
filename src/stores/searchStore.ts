import { create } from 'zustand'
import { Track } from '@/lib/api'

interface SearchStore {
  query: string
  results: Track[]
  isSearching: boolean
  setQuery: (q: string) => void
  setResults: (r: Track[]) => void
  setIsSearching: (v: boolean) => void
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  results: [],
  isSearching: false,
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
  setIsSearching: (isSearching) => set({ isSearching }),
}))
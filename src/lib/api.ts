import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
})

export interface Track {
  id: string
  title: string
  artist: string
  duration: number
  thumbnail: string
  url?: string
}

export async function searchTracks(query: string): Promise<Track[]> {
  const res = await api.get(`/api/search?q=${encodeURIComponent(query)}`)
  return res.data.data
}

export async function resolveStream(videoId: string): Promise<Track> {
  const res = await api.post('/api/stream/resolve', { videoId })
  return res.data.data
}

export default api
import axios from 'axios'

export interface LyricLine {
  time: number // in seconds
  text: string
}

export interface LyricsResult {
  synced: LyricLine[]
  plain: string
  source: string
}

// Parse .lrc format into array of { time, text }
function parseLRC(lrc: string): LyricLine[] {
  const lines = lrc.split('\n')
  const result: LyricLine[] = []

  for (const line of lines) {
    const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/)
    if (match) {
      const minutes = parseInt(match[1])
      const seconds = parseInt(match[2])
      const ms = parseInt(match[3])
      const text = match[4].trim()

      if (text) {
        result.push({
          time: minutes * 60 + seconds + ms / 1000,
          text,
        })
      }
    }
  }

  return result.sort((a, b) => a.time - b.time)
}

// Fetch from LrcLib — free, open, no API key needed
export async function fetchLyrics(
  title: string,
  artist: string,
  duration?: number
): Promise<LyricsResult | null> {
  try {
    // Try synced lyrics first
    const response = await axios.get('https://lrclib.net/api/get', {
      params: {
        track_name: title,
        artist_name: artist,
        duration: duration,
      },
      timeout: 8000,
    })

    const data = response.data

    if (data.syncedLyrics) {
      return {
        synced: parseLRC(data.syncedLyrics),
        plain: data.plainLyrics || '',
        source: 'lrclib',
      }
    }

    if (data.plainLyrics) {
      return {
        synced: [],
        plain: data.plainLyrics,
        source: 'lrclib',
      }
    }

    return null
  } catch (err) {
    // Try search endpoint as fallback
    try {
      const search = await axios.get('https://lrclib.net/api/search', {
        params: { q: `${artist} ${title}` },
        timeout: 8000,
      })

      const results = search.data
      if (!results?.length) return null

      // Pick best match
      const best = results[0]

      if (best.syncedLyrics) {
        return {
          synced: parseLRC(best.syncedLyrics),
          plain: best.plainLyrics || '',
          source: 'lrclib',
        }
      }

      if (best.plainLyrics) {
        return {
          synced: [],
          plain: best.plainLyrics,
          source: 'lrclib',
        }
      }
    } catch {
      return null
    }

    return null
  }
}
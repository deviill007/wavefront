import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface StreamResult {
  url: string
  title: string
  artist: string
  duration: number
  thumbnail: string
}

export async function resolveStream(videoId: string): Promise<StreamResult> {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`

  try {
    // Use yt-dlp directly as a subprocess — most reliable approach
    const { stdout } = await execAsync(
      `yt-dlp -f "bestaudio" --get-url --print "%(title)s||%(uploader)s||%(duration)s||%(thumbnail)s" --no-playlist "${videoUrl}"`,
      { timeout: 30000 }
    )

    const lines = stdout.trim().split('\n')
    
    // Last line is the stream URL, second to last is the metadata
    const streamUrl = lines[lines.length - 1]
    const metaLine = lines[lines.length - 2] || ''
    const [title, artist, duration, thumbnail] = metaLine.split('||')

    return {
      url: streamUrl,
      title: title || '',
      artist: artist || '',
      duration: parseInt(duration) || 0,
      thumbnail: thumbnail || '',
    }
  } catch (error) {
    console.error('yt-dlp error:', error)
    throw new Error(`Failed to resolve stream for ${videoId}`)
  }
}
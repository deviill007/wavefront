import { Router, Request, Response } from 'express'
import { fetchLyrics } from '../services/lyrics.service'

const router = Router()

// GET /api/lyrics?title=...&artist=...&duration=...
router.get('/', async (req: Request, res: Response) => {
  const { title, artist, duration } = req.query

  if (!title || !artist) {
    res.status(400).json({ error: 'title and artist are required' })
    return
  }

  try {
    const lyrics = await fetchLyrics(
      title as string,
      artist as string,
      duration ? parseInt(duration as string) : undefined
    )

    if (!lyrics) {
      res.status(404).json({ error: 'Lyrics not found' })
      return
    }

    res.json({ success: true, data: lyrics })
  } catch (err) {
    console.error('Lyrics error:', err)
    res.status(500).json({ error: 'Failed to fetch lyrics' })
  }
})

export default router
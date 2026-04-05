import { Router, Request, Response } from 'express'
import { resolveStream } from '../services/stream.service'

const router = Router()

// POST /api/stream/resolve
// Body: { videoId: string }
router.post('/resolve', async (req: Request, res: Response) => {
  const { videoId } = req.body

  if (!videoId) {
    res.status(400).json({ error: 'videoId is required' })
    return
  }

  try {
    console.log(`Resolving stream for: ${videoId}`)
    const stream = await resolveStream(videoId)
    res.json({ success: true, data: stream })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to resolve stream' })
  }
})

export default router
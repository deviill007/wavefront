import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import streamRouter from './routes/stream'
import searchRouter from './routes/search'
import lyricsRouter from './routes/lyrics'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '🎵 Wavefront API is running' 
  })
})

// Routes
app.use('/api/stream', streamRouter)
app.use('/api/search', searchRouter)
app.use('/api/lyrics', lyricsRouter)


httpServer.listen(PORT, () => {
  console.log(`🎵 Wavefront backend running on http://localhost:${PORT}`)
})

export default app
import axios from 'axios'

export interface LyricLine {
  time: number
  text: string
}

export interface LyricsResult {
  synced: LyricLine[]
  plain: string
  source: string
}

// ─── LRC parser ──────────────────────────────────────────────────────────────

function parseLRC(lrc: string): LyricLine[] {
  const result: LyricLine[] = []
  for (const line of lrc.split('\n')) {
    const m = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/)
    if (m) {
      const time = parseInt(m[1]) * 60 + parseInt(m[2]) + parseInt(m[3]) / 1000
      const text = m[4].trim()
      if (text) result.push({ time, text })
    }
  }
  return result.sort((a, b) => a.time - b.time)
}

// ─── Known label / YouTube channel names ─────────────────────────────────────

const LABEL_CHANNELS = new Set([
  't-series', 'tseries', 'yrf', 'yrf music', 'saregama music', 'saregama',
  'zee music company', 'zee music', 'sony music india', 'sony music',
  'universal music india', 'universal music', 'tips official', 'tips music',
  'speed records', 'white hill music', 'jjust music', 'desi melodies',
  'aditya music', 'lahari music', 'think music india', 'think music',
  'warner music', 'columbia records', 'atlantic records', 'interscope records',
  'republic records', 'island records', 'maddock films',
  'sony music india and maddock films', 't-series bhakti sagar',
  'shemaroo music', 'venus worldwide', '7clouds', 'pagal .m10..',
])

function isLabel(artist: string) {
  return LABEL_CHANNELS.has(artist.toLowerCase().trim())
}

// ─── Title cleaning ───────────────────────────────────────────────────────────

function stripMojibake(str: string): string {
  return str
    .replace(/\uFFFD/g, '')
    // Keep ASCII, Devanagari, Gurmukhi — strip other non-Latin like emoji
    .replace(/[^\x00-\x7F\u0900-\u097F\u0A00-\u0A7F ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Extract the actual song name from a messy YouTube title.
 *
 * Key rule: cut at the FIRST pipe. Everything before the first pipe
 * is the song name (possibly with junk appended). Everything after is credits.
 *
 * Examples:
 *   "Barbaad Reprise - Female | Full Song | Saiyaara | ..."  → "Barbaad Reprise - Female"
 *   "Barbaad Song | Saiyaara | Ahaan Panday | ..."           → "Barbaad Song"
 *   "Saiyaara Title Song | Ahaan Panday | ..."               → "Saiyaara Title Song"
 *   "Ed Sheeran - Shape of You (Official Music Video)"       → "Shape of You"
 *   '"Tum Hi Ho" Aashiqui 2 with Lyrics'                     → "Tum Hi Ho"
 *   "Raataan Lambiyan 🔥 Official Video"                     → "Raataan Lambiyan"
 *
 * The dash rule ONLY fires when the part before the dash is a short
 * single-word or two-word string with no spaces that looks like a standalone
 * artist name — e.g. "Ed Sheeran - Shape of You".
 * It does NOT fire for "Barbaad Reprise - Female" because "Barbaad Reprise"
 * is multi-word and contextually part of the song title.
 */
function extractSongName(raw: string): string {
  let t = stripMojibake(raw)

  // 1. Quoted phrase at start
  const quotedMatch = t.match(/^["'](.+?)["']/)
  if (quotedMatch) return quotedMatch[1].trim()

  // 2. Cut at first pipe — BUT only if what's before the pipe
  //    doesn't look like just a genre/type word (Lyrical, Audio, Video, Official)
  const pipeIdx = t.indexOf('|')
  if (pipeIdx !== -1) {
    const beforePipe = t.slice(0, pipeIdx).trim()
    const isBadBeforePipe = /^(lyrical|audio|video|official|full|lyrics|song)$/i.test(beforePipe)
    if (!isBadBeforePipe) {
      t = beforePipe
    } else {
      // Bad before pipe — try cutting at second pipe
      const secondPipe = t.indexOf('|', pipeIdx + 1)
      if (secondPipe !== -1) t = t.slice(pipeIdx + 1, secondPipe).trim()
      else t = t.slice(pipeIdx + 1).trim()
    }
  }

  // 3. Strip Bollywood "(Video):" colon pattern
  t = t.replace(/\s*\((video|audio|song|lyric|lyrics|official|lyrical)\)\s*:.*$/gi, '')

  // 4. Strip trailing type words that got appended without pipe
  //    e.g. "Barbaad Song Lyrical" → "Barbaad Song"
  t = t.replace(/\s+(lyrical|official\s*video|official\s*audio|full\s*video|full\s*song|audio|hd|4k)$/gi, '')

  // 5. "Artist - Song" dash rule — only strip if before dash is 1-2 words
  //    and doesn't look like part of the song title itself
  const dashMatch = t.match(/^(.+?)\s+-\s+(.+)$/)
  if (dashMatch) {
    const before = dashMatch[1].trim()
    const after = dashMatch[2].trim()
    const beforeWords = before.split(/\s+/)
    const songTitleWords = /reprise|version|mix|cover|remix|acoustic|live|full|feat|ft\b|female|male/i
    if (beforeWords.length <= 2 && !songTitleWords.test(before) && !songTitleWords.test(after)) {
      t = after
    }
  }

  // 6. Strip trailing noise in parens/brackets
  t = t
    .replace(/\(official\s*(music\s*)?video\)/gi, '')
    .replace(/\(official\s*audio\)/gi, '')
    .replace(/\(full\s*(audio|video|song)\)/gi, '')
    .replace(/\bwith\s+lyrics?\b/gi, '')
    .replace(/\(lyrics?\s*video\)/gi, '')
    .replace(/\(lyric\s*video\)/gi, '')
    .replace(/\(lyrical\)/gi, '')
    .replace(/\(audio\)/gi, '')
    .replace(/\(hd\)/gi, '')
    .replace(/\(4k\)/gi, '')
    .replace(/\(feat\..*?\)/gi, '')
    .replace(/\bft\..*$/gi, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\(बदी.*?\)/g, '') // Hindi bracket noise
    .replace(/^['"]|['"]$/g, '')

  return t.replace(/\s+/g, ' ').trim()
}

function cleanArtist(raw: string): string {
  return raw
    .replace(/VEVO$/gi, '')
    .replace(/\s*-\s*Topic$/gi, '')
    .replace(/\bofficial\b/gi, '')
    .replace(/\s+Music\s*$/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// ─── Build search candidates ──────────────────────────────────────────────────

function buildCandidates(rawTitle: string, rawArtist: string) {
  const song     = extractSongName(rawTitle)
  const artist   = cleanArtist(rawArtist)
  const noArtist = isLabel(artist)

  const seen  = new Set<string>()
  const pairs: Array<{ title: string; artist: string }> = []

  function add(title: string, a: string) {
    title = title.trim()
    a     = a.trim()
    const key = title.toLowerCase() + '|||' + a.toLowerCase()
    if (title && !seen.has(key)) {
      seen.add(key)
      pairs.push({ title, artist: a })
    }
  }

  if (!noArtist) add(song, artist)
  add(song, '')
  if (!noArtist) add(song + ' ' + artist, '')

  return pairs
}

// ─── Source 1: lrclib ─────────────────────────────────────────────────────────

async function lrclibGet(title: string, artist: string, duration?: number) {
  try {
    const params: Record<string, any> = { track_name: title }
    if (artist) params.artist_name = artist
    if (duration) params.duration = duration
    const res = await axios.get('https://lrclib.net/api/get', { params, timeout: 6000 })
    return res.data
  } catch { return null }
}

async function lrclibSearch(q: string) {
  try {
    const res = await axios.get('https://lrclib.net/api/search', { params: { q }, timeout: 6000 })
    return res.data?.[0] || null
  } catch { return null }
}

function toResult(data: any, source: string): LyricsResult | null {
  if (!data) return null
  if (data.syncedLyrics) return { synced: parseLRC(data.syncedLyrics), plain: data.plainLyrics || '', source }
  if (data.plainLyrics)  return { synced: [], plain: data.plainLyrics, source }
  return null
}

async function tryLrclib(candidates: Array<{ title: string; artist: string }>, duration?: number) {
  for (const { title, artist } of candidates) {
    const r = toResult(await lrclibGet(title, artist, duration), 'lrclib')
    if (r) return r
    const q = artist ? (artist + ' ' + title) : title
    const s = toResult(await lrclibSearch(q), 'lrclib')
    if (s) return s
  }
  return null
}

// ─── Source 2: KuGou ──────────────────────────────────────────────────────────

async function tryKugou(candidates: Array<{ title: string; artist: string }>, duration?: number) {
  for (const { title, artist } of candidates) {
    try {
      const keyword = artist ? (artist + ' ' + title) : title
      const params: Record<string, any> = { ver: 1, man: 'yes', client: 'mobi', keyword }
      if (duration) params.duration = duration * 1000
      const sr = await axios.get('https://krcs.kugou.com/search', {
        params, timeout: 7000, headers: { 'User-Agent': 'Mozilla/5.0' },
      })
      const c = sr.data?.candidates?.[0]
      if (!c) continue
      const dr = await axios.get('https://lyrics.kugou.com/download', {
        params: { ver: 1, client: 'pc', id: c.id, accesskey: c.accesskey, fmt: 'lrc', charset: 'utf8' },
        timeout: 7000, headers: { 'User-Agent': 'Mozilla/5.0' },
      })
      const content = dr.data?.content
      if (!content) continue
      const lrc    = Buffer.from(content, 'base64').toString('utf8')
      const synced = parseLRC(lrc)
      if (synced.length > 0) return { synced, plain: '', source: 'kugou' } as LyricsResult
    } catch { continue }
  }
  return null
}

// ─── Source 3: SimpMusic ──────────────────────────────────────────────────────

async function trySimpMusic(candidates: Array<{ title: string; artist: string }>) {
  for (const { title, artist } of candidates) {
    try {
      const q = artist ? (artist + ' ' + title) : title
      const res = await axios.get('https://lyrics.simpmusic.org/lyrics/search', {
        params: { q, limit: 1 }, timeout: 7000, headers: { 'User-Agent': 'Mozilla/5.0' },
      })
      const item = res.data?.data?.[0]
      if (!item) continue
      if (item.syncedLyrics) {
        const synced = parseLRC(item.syncedLyrics)
        if (synced.length > 0) return { synced, plain: item.plainLyric || '', source: 'simpmusic' } as LyricsResult
      }
      if (item.plainLyric) return { synced: [], plain: item.plainLyric, source: 'simpmusic' } as LyricsResult
    } catch { continue }
  }
  return null
}

// ─── Source 4: Netease Cloud Music ────────────────────────────────────────────

async function tryNetease(candidates: Array<{ title: string; artist: string }>) {
  for (const { title, artist } of candidates) {
    try {
      const keywords = artist ? (artist + ' ' + title) : title
      const searchRes = await axios.get('https://music.163.com/api/search/get', {
        params: { s: keywords, type: 1, limit: 1, offset: 0 },
        timeout: 7000,
        headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://music.163.com' },
      })
      const song = searchRes.data?.result?.songs?.[0]
      if (!song?.id) continue
      const lyricRes = await axios.get('https://music.163.com/api/song/lyric', {
        params: { id: song.id, lv: 1, kv: 1, tv: -1 },
        timeout: 7000,
        headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://music.163.com' },
      })
      const lrcBody = lyricRes.data?.lrc?.lyric
      if (!lrcBody) continue
      const synced = parseLRC(lrcBody)
      if (synced.length > 0) return { synced, plain: '', source: 'netease' } as LyricsResult
      const plain = lrcBody.replace(/\[.*?\]/g, '').replace(/\n+/g, '\n').trim()
      if (plain) return { synced: [], plain, source: 'netease' } as LyricsResult
    } catch { continue }
  }
  return null
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function fetchLyrics(
  rawTitle: string,
  rawArtist: string,
  duration?: number
): Promise<LyricsResult | null> {

  const song       = extractSongName(rawTitle)
  const artist     = cleanArtist(rawArtist)
  const candidates = buildCandidates(rawTitle, rawArtist)

  console.log('[lyrics] song:', JSON.stringify(song), '| artist:', JSON.stringify(artist))
  console.log('[lyrics] candidates:', candidates.map(c => JSON.stringify(c.title) + (c.artist ? ' / ' + JSON.stringify(c.artist) : '')))

  const lrc = await tryLrclib(candidates, duration)
  if (lrc)  { console.log('[lyrics] ✓ lrclib (' + (lrc.synced.length ? 'synced' : 'plain') + ')');     return lrc  }

  const kg = await tryKugou(candidates, duration)
  if (kg)   { console.log('[lyrics] ✓ kugou (' + (kg.synced.length ? 'synced' : 'plain') + ')');       return kg   }

  const simp = await trySimpMusic(candidates)
  if (simp) { console.log('[lyrics] ✓ simpmusic (' + (simp.synced.length ? 'synced' : 'plain') + ')'); return simp }

  const ne = await tryNetease(candidates)
  if (ne)   { console.log('[lyrics] ✓ netease (' + (ne.synced.length ? 'synced' : 'plain') + ')');     return ne   }

  console.log('[lyrics] ✗ not found')
  return null
}
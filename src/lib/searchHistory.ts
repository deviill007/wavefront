const KEY = 'wf_search_history'

export function getHistory(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') }
  catch { return [] }
}

export function saveHistory(q: string) {
  const h = getHistory().filter(x => x !== q)
  localStorage.setItem(KEY, JSON.stringify([q, ...h].slice(0, 8)))
}

export function removeHistory(q: string) {
  localStorage.setItem(KEY, JSON.stringify(getHistory().filter(x => x !== q)))
}
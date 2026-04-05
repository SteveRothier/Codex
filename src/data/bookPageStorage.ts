/** v2 : index sur les pages 1–2 après la couverture (anciennes clés ignorées). */
const STORAGE_KEY = 'codex-book-page-v2'

export function readStoredBookPage(maxIndex: number): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return 0
    const n = parseInt(raw, 10)
    if (!Number.isFinite(n)) return 0
    return Math.min(Math.max(0, n), maxIndex)
  } catch {
    return 0
  }
}

export function writeStoredBookPage(index: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(index))
  } catch {
    /* quota / private mode */
  }
}

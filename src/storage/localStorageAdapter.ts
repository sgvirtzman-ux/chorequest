import type { StorageAdapter } from './StorageAdapter'

export const STATE_KEY = 'chorequest:state'

export const localStorageAdapter: StorageAdapter = {
  async load() {
    // sandboxed embeds (e.g. hosted demos) may block storage entirely —
    // fall back to a fresh in-memory game rather than failing to boot
    try {
      return localStorage.getItem(STATE_KEY)
    } catch {
      return null
    }
  },
  async save(serialized: string) {
    try {
      localStorage.setItem(STATE_KEY, serialized)
    } catch {
      // storage unavailable or full — play on without persistence
    }
  },
}

/** Never silently destroy family data: copy unreadable state aside before reseeding. */
export function stashCorruptState(raw: string): void {
  try {
    localStorage.setItem(`${STATE_KEY}:corrupt-${Date.now()}`, raw)
  } catch {
    // storage full or unavailable — nothing more we can do
  }
}

import type { StorageAdapter } from './StorageAdapter'

export const STATE_KEY = 'chorequest:state'

export const localStorageAdapter: StorageAdapter = {
  async load() {
    return localStorage.getItem(STATE_KEY)
  },
  async save(serialized: string) {
    localStorage.setItem(STATE_KEY, serialized)
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

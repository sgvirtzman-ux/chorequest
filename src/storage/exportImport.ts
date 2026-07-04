import type { PersistedState } from '../types'
import { formatLocalDate } from '../utils/week'
import { parsePersistedState } from './migrations'

export function exportStateFile(data: PersistedState): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `chorequest-backup-${formatLocalDate(new Date())}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/** Throws with a human-readable message if the file isn't a valid save. */
export async function importStateFile(file: File): Promise<PersistedState> {
  const text = await file.text()
  return parsePersistedState(text)
}

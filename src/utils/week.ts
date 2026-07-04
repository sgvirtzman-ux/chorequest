import type { Weekday, WeekKey } from '../types'

/**
 * Local midnight of the first day of the week containing `date`.
 * Uses setDate (not ms arithmetic) so DST 23/25-hour days can't shift the result.
 */
export function getWeekStart(date: Date, weekStartDay: Weekday): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  d.setDate(d.getDate() - ((d.getDay() - weekStartDay + 7) % 7))
  return d
}

/** Local Y-M-D — never toISOString(), which shifts evening dates across the UTC boundary. */
export function formatLocalDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getWeekKey(date: Date, weekStartDay: Weekday): WeekKey {
  return formatLocalDate(getWeekStart(date, weekStartDay))
}

/** Re-derive a completion's week bucket from its claim timestamp. */
export function weekKeyFromISO(iso: string, weekStartDay: Weekday): WeekKey {
  return getWeekKey(new Date(iso), weekStartDay)
}

/** "Jun 29 – Jul 5" */
export function weekRangeLabel(weekKey: WeekKey): string {
  const [y, m, d] = weekKey.split('-').map(Number)
  const start = new Date(y, m - 1, d)
  const end = new Date(y, m - 1, d + 6)
  const fmt = (dt: Date) =>
    dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  return `${fmt(start)} – ${fmt(end)}`
}

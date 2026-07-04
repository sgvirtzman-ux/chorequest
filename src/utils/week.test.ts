import { describe, expect, it } from 'vitest'
import { formatLocalDate, getWeekKey, getWeekStart, weekKeyFromISO, weekRangeLabel } from './week'

const MON = 1
const SUN = 0

describe('getWeekStart / getWeekKey', () => {
  it('maps every day of a Monday-start week to that Monday', () => {
    // 2026-06-29 is a Monday
    for (let offset = 0; offset < 7; offset++) {
      const d = new Date(2026, 5, 29 + offset, 14, 30)
      expect(getWeekKey(d, MON)).toBe('2026-06-29')
    }
    expect(getWeekKey(new Date(2026, 6, 6), MON)).toBe('2026-07-06') // next Monday
  })

  it('maps a Sunday-start week to the preceding Sunday', () => {
    expect(getWeekKey(new Date(2026, 5, 29), SUN)).toBe('2026-06-28')
    expect(getWeekKey(new Date(2026, 5, 28), SUN)).toBe('2026-06-28')
    expect(getWeekKey(new Date(2026, 6, 4), SUN)).toBe('2026-06-28')
  })

  it('returns local midnight of the start day', () => {
    const start = getWeekStart(new Date(2026, 6, 3, 23, 59), MON)
    expect(start.getHours()).toBe(0)
    expect(start.getMinutes()).toBe(0)
    expect(start.getDay()).toBe(MON)
  })

  it('is stable across a DST spring-forward week (US 2026-03-08)', () => {
    // Monday 2026-03-02 starts the week containing the US DST jump
    for (let offset = 0; offset < 7; offset++) {
      const d = new Date(2026, 2, 2 + offset, 12)
      expect(getWeekKey(d, MON)).toBe('2026-03-02')
    }
  })

  it('handles claims late in the evening without UTC date shift', () => {
    // 23:30 local on Monday must stay in Monday's week regardless of timezone
    const lateNight = new Date(2026, 5, 29, 23, 30)
    expect(getWeekKey(lateNight, MON)).toBe('2026-06-29')
  })
})

describe('formatLocalDate', () => {
  it('zero-pads month and day', () => {
    expect(formatLocalDate(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('weekKeyFromISO', () => {
  it('re-buckets an ISO timestamp under a different week start day', () => {
    // Wednesday 2026-07-01 noon local
    const iso = new Date(2026, 6, 1, 12).toISOString()
    expect(weekKeyFromISO(iso, MON)).toBe('2026-06-29')
    expect(weekKeyFromISO(iso, SUN)).toBe('2026-06-28')
  })
})

describe('weekRangeLabel', () => {
  it('spans 7 days from the week key', () => {
    const label = weekRangeLabel('2026-06-29')
    expect(label).toContain('29')
    expect(label).toContain('5') // Jul 5 end
  })
})

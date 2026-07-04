import { useEffect, useState } from 'react'
import type { WeekKey } from '../types'
import { getWeekKey } from '../utils/week'
import { useAppState } from './AppStateContext'

/**
 * The current week key, self-updating: recomputed on window focus, tab
 * visibility and a 60s tick — so a tablet left open on the fridge rolls
 * into the new week on its own. There is no stored "current week" anywhere.
 */
export function useCurrentWeekKey(): WeekKey {
  const { data } = useAppState()
  const weekStartDay = data.settings.weekStartDay
  const [key, setKey] = useState<WeekKey>(() => getWeekKey(new Date(), weekStartDay))

  useEffect(() => {
    const update = () => setKey(getWeekKey(new Date(), weekStartDay))
    update()
    const interval = window.setInterval(update, 60_000)
    window.addEventListener('focus', update)
    document.addEventListener('visibilitychange', update)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', update)
      document.removeEventListener('visibilitychange', update)
    }
  }, [weekStartDay])

  return key
}

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
} from 'react'
import type { Action, AppState } from '../types'
import { sfx } from '../audio/chiptune'
import { seedState } from '../data/seed'
import { localStorageAdapter, stashCorruptState } from '../storage/localStorageAdapter'
import { parsePersistedState } from '../storage/migrations'
import { initialUiState, reducer } from './reducer'

const StateContext = createContext<AppState | null>(null)
const DispatchContext = createContext<Dispatch<Action> | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, () => ({
    data: seedState(),
    ui: initialUiState,
  }))
  const [ready, setReady] = useState(false)

  // boot: load -> migrate -> validate; corrupt data is stashed, never wiped
  useEffect(() => {
    let cancelled = false
    void (async () => {
      const raw = await localStorageAdapter.load()
      if (cancelled) return
      if (raw !== null) {
        try {
          dispatch({ type: 'IMPORT_STATE', data: parsePersistedState(raw) })
        } catch (err) {
          console.error('ChoreQuest: saved data unreadable, starting fresh', err)
          stashCorruptState(raw)
        }
      }
      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // persist debounced, with a flush when the tab hides or unloads
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => {
    if (!ready) return
    const serialized = JSON.stringify(state.data)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => void localStorageAdapter.save(serialized), 250)
    const flush = () => {
      window.clearTimeout(timer.current)
      void localStorageAdapter.save(serialized)
    }
    const onHide = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    window.addEventListener('beforeunload', flush)
    document.addEventListener('visibilitychange', onHide)
    return () => {
      window.removeEventListener('beforeunload', flush)
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [state.data, ready])

  // keep the sound module in sync with settings
  useEffect(() => {
    sfx.setMuted(state.data.settings.soundMuted)
  }, [state.data.settings.soundMuted])

  // black splash frame until the save is loaded (instant for localStorage)
  if (!ready) return null

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export function useAppState(): AppState {
  const state = useContext(StateContext)
  if (!state) throw new Error('useAppState must be used inside AppStateProvider')
  return state
}

export function useAppDispatch(): Dispatch<Action> {
  const dispatch = useContext(DispatchContext)
  if (!dispatch) throw new Error('useAppDispatch must be used inside AppStateProvider')
  return dispatch
}

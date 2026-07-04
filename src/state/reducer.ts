import type {
  Action,
  AppState,
  ChoreCompletion,
  PersistedState,
  PrizeRedemption,
  UiState,
} from '../types'
import { seedState } from '../data/seed'
import { newId } from '../utils/id'
import { weekKeyFromISO } from '../utils/week'

export const initialUiState: UiState = {
  screen: 'title',
  activePlayerId: null,
  adminUnlocked: false,
}

export function reducer(state: AppState, action: Action): AppState {
  const { data, ui } = state

  switch (action.type) {
    // ---- players -------------------------------------------------------
    case 'ADD_PLAYER':
      return withData(state, {
        players: [
          ...data.players,
          {
            id: newId(),
            ...action.player,
            pointsBank: 0,
            lifetimePoints: 0,
            createdAt: new Date().toISOString(),
          },
        ],
      })

    case 'UPDATE_PLAYER':
      return withData(state, {
        players: data.players.map((p) =>
          p.id === action.id ? { ...p, ...action.patch } : p,
        ),
      })

    case 'DELETE_PLAYER':
      return {
        data: {
          ...data,
          players: data.players.filter((p) => p.id !== action.id),
          assignments: data.assignments.filter((a) => a.playerId !== action.id),
          completions: data.completions.filter((c) => c.playerId !== action.id),
          redemptions: data.redemptions.filter((r) => r.playerId !== action.id),
        },
        ui: ui.activePlayerId === action.id ? { ...ui, activePlayerId: null } : ui,
      }

    // ---- chores ---------------------------------------------------------
    case 'ADD_CHORE':
      return withData(state, {
        chores: [...data.chores, { id: newId(), ...action.chore, archived: false }],
      })

    case 'UPDATE_CHORE':
      return withData(state, {
        chores: data.chores.map((c) =>
          c.id === action.id ? { ...c, ...action.patch } : c,
        ),
      })

    case 'DELETE_CHORE': {
      const hasHistory = data.completions.some((c) => c.choreId === action.id)
      return withData(state, {
        // archive when history references it so past completions keep context
        chores: hasHistory
          ? data.chores.map((c) => (c.id === action.id ? { ...c, archived: true } : c))
          : data.chores.filter((c) => c.id !== action.id),
        assignments: data.assignments.filter((a) => a.choreId !== action.id),
      })
    }

    // ---- prizes ---------------------------------------------------------
    case 'ADD_PRIZE':
      return withData(state, {
        prizes: [...data.prizes, { id: newId(), ...action.prize, archived: false }],
      })

    case 'UPDATE_PRIZE':
      return withData(state, {
        prizes: data.prizes.map((p) =>
          p.id === action.id ? { ...p, ...action.patch } : p,
        ),
      })

    case 'DELETE_PRIZE': {
      const hasHistory = data.redemptions.some((r) => r.prizeId === action.id)
      return withData(state, {
        prizes: hasHistory
          ? data.prizes.map((p) => (p.id === action.id ? { ...p, archived: true } : p))
          : data.prizes.filter((p) => p.id !== action.id),
      })
    }

    // ---- assignments ----------------------------------------------------
    case 'SET_PLAYER_ASSIGNMENTS': {
      // keep existing records for still-checked chores (stable assignment ids
      // keep this week's completions linked), drop unchecked, add new
      const mine = data.assignments.filter((a) => a.playerId === action.playerId)
      const others = data.assignments.filter((a) => a.playerId !== action.playerId)
      const kept = mine.filter((a) => action.choreIds.includes(a.choreId))
      const existingChoreIds = new Set(kept.map((a) => a.choreId))
      const added = action.choreIds
        .filter((choreId) => !existingChoreIds.has(choreId))
        .map((choreId) => ({ id: newId(), playerId: action.playerId, choreId }))
      return withData(state, { assignments: [...others, ...kept, ...added] })
    }

    // ---- gameplay -------------------------------------------------------
    case 'CLAIM_CHORE': {
      const assignment = data.assignments.find((a) => a.id === action.assignmentId)
      if (!assignment) return state
      const chore = data.chores.find((c) => c.id === assignment.choreId)
      if (!chore) return state
      // one completion per assignment per week; a rejected one may be retried
      const duplicate = data.completions.some(
        (c) =>
          c.assignmentId === action.assignmentId &&
          c.weekKey === action.weekKey &&
          c.status !== 'rejected',
      )
      if (duplicate) return state
      const completion: ChoreCompletion = {
        id: newId(),
        assignmentId: assignment.id,
        playerId: assignment.playerId,
        choreId: chore.id,
        choreName: chore.name,
        points: chore.points,
        weekKey: action.weekKey,
        status: 'pending',
        claimedAt: new Date().toISOString(),
        resolvedAt: null,
      }
      return withData(state, { completions: [...data.completions, completion] })
    }

    case 'APPROVE_COMPLETION': {
      const completion = data.completions.find((c) => c.id === action.id)
      if (!completion || completion.status !== 'pending') return state
      return withData(state, {
        completions: data.completions.map((c) =>
          c.id === action.id
            ? { ...c, status: 'approved' as const, resolvedAt: new Date().toISOString() }
            : c,
        ),
        players: data.players.map((p) =>
          p.id === completion.playerId
            ? {
                ...p,
                pointsBank: p.pointsBank + completion.points,
                lifetimePoints: p.lifetimePoints + completion.points,
              }
            : p,
        ),
      })
    }

    case 'REJECT_COMPLETION': {
      const completion = data.completions.find((c) => c.id === action.id)
      if (!completion || completion.status !== 'pending') return state
      return withData(state, {
        completions: data.completions.map((c) =>
          c.id === action.id
            ? { ...c, status: 'rejected' as const, resolvedAt: new Date().toISOString() }
            : c,
        ),
      })
    }

    // ---- shop -----------------------------------------------------------
    case 'REDEEM_PRIZE': {
      const player = data.players.find((p) => p.id === action.playerId)
      const prize = data.prizes.find((p) => p.id === action.prizeId && !p.archived)
      if (!player || !prize || player.pointsBank < prize.cost) return state
      const redemption: PrizeRedemption = {
        id: newId(),
        playerId: player.id,
        prizeId: prize.id,
        prizeName: prize.name,
        cost: prize.cost,
        status: 'pending',
        redeemedAt: new Date().toISOString(),
        resolvedAt: null,
      }
      return withData(state, {
        // deduct immediately so pending redemptions can't double-spend
        players: data.players.map((p) =>
          p.id === player.id ? { ...p, pointsBank: p.pointsBank - prize.cost } : p,
        ),
        redemptions: [...data.redemptions, redemption],
      })
    }

    case 'FULFILL_REDEMPTION': {
      const redemption = data.redemptions.find((r) => r.id === action.id)
      if (!redemption || redemption.status !== 'pending') return state
      return withData(state, {
        redemptions: data.redemptions.map((r) =>
          r.id === action.id
            ? { ...r, status: 'fulfilled' as const, resolvedAt: new Date().toISOString() }
            : r,
        ),
      })
    }

    case 'CANCEL_REDEMPTION': {
      const redemption = data.redemptions.find((r) => r.id === action.id)
      if (!redemption || redemption.status !== 'pending') return state
      return withData(state, {
        redemptions: data.redemptions.map((r) =>
          r.id === action.id
            ? { ...r, status: 'cancelled' as const, resolvedAt: new Date().toISOString() }
            : r,
        ),
        players: data.players.map((p) =>
          p.id === redemption.playerId
            ? { ...p, pointsBank: p.pointsBank + redemption.cost }
            : p,
        ),
      })
    }

    // ---- settings / data ------------------------------------------------
    case 'UPDATE_SETTINGS': {
      const settings = { ...data.settings, ...action.patch }
      const weekDayChanged =
        action.patch.weekStartDay !== undefined &&
        action.patch.weekStartDay !== data.settings.weekStartDay
      return withData(state, {
        settings,
        // weekKey is a cache of claimedAt + weekStartDay: re-stamp so leaderboard
        // buckets stay consistent under the new setting
        completions: weekDayChanged
          ? data.completions.map((c) => ({
              ...c,
              weekKey: weekKeyFromISO(c.claimedAt, settings.weekStartDay),
            }))
          : data.completions,
      })
    }

    case 'IMPORT_STATE':
      return { data: action.data, ui: { ...ui, activePlayerId: null } }

    case 'RESET_TO_SEED':
      return { data: seedState(), ui: { ...ui, activePlayerId: null } }

    // ---- ui (never persisted) --------------------------------------------
    case 'NAVIGATE':
      return {
        data,
        ui: {
          ...ui,
          screen: action.screen,
          // leaving the admin area always relocks it
          adminUnlocked: action.screen === 'admin' ? ui.adminUnlocked : false,
        },
      }

    case 'SELECT_PLAYER':
      return { data, ui: { ...ui, activePlayerId: action.playerId, screen: 'dashboard' } }

    case 'UNLOCK_ADMIN':
      return { data, ui: { ...ui, adminUnlocked: true } }

    case 'LOCK_ADMIN':
      return { data, ui: { ...ui, adminUnlocked: false } }
  }
}

function withData(state: AppState, patch: Partial<PersistedState>): AppState {
  return { data: { ...state.data, ...patch }, ui: state.ui }
}

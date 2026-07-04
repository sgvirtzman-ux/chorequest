import { describe, expect, it } from 'vitest'
import type { AppState } from '../types'
import { seedState } from '../data/seed'
import { initialUiState, reducer } from './reducer'

const WEEK = '2026-06-29'

function freshState(): AppState {
  return { data: seedState(), ui: { ...initialUiState } }
}

function claim(state: AppState, assignmentId = 'assign-zane-trash', weekKey = WEEK) {
  return reducer(state, { type: 'CLAIM_CHORE', assignmentId, weekKey })
}

describe('claim → approve flow', () => {
  it('creates a pending completion with snapshotted name and points', () => {
    const s = claim(freshState())
    expect(s.data.completions).toHaveLength(1)
    const c = s.data.completions[0]
    expect(c.status).toBe('pending')
    expect(c.choreName).toBe('Take Out the Trash')
    expect(c.points).toBe(10)
    expect(c.weekKey).toBe(WEEK)
    expect(c.playerId).toBe('player-zane')
  })

  it('approval credits bank and lifetime points', () => {
    let s = claim(freshState())
    const before = s.data.players.find((p) => p.id === 'player-zane')!
    s = reducer(s, { type: 'APPROVE_COMPLETION', id: s.data.completions[0].id })
    const after = s.data.players.find((p) => p.id === 'player-zane')!
    expect(after.pointsBank).toBe(before.pointsBank + 10)
    expect(after.lifetimePoints).toBe(before.lifetimePoints + 10)
    expect(s.data.completions[0].status).toBe('approved')
    expect(s.data.completions[0].resolvedAt).not.toBeNull()
  })

  it('rejection awards nothing', () => {
    let s = claim(freshState())
    const before = s.data.players.find((p) => p.id === 'player-zane')!
    s = reducer(s, { type: 'REJECT_COMPLETION', id: s.data.completions[0].id })
    const after = s.data.players.find((p) => p.id === 'player-zane')!
    expect(after.pointsBank).toBe(before.pointsBank)
    expect(s.data.completions[0].status).toBe('rejected')
  })

  it('blocks duplicate claims for the same assignment and week', () => {
    let s = claim(freshState())
    s = claim(s)
    expect(s.data.completions).toHaveLength(1)
  })

  it('allows re-claim after rejection, and in a new week', () => {
    let s = claim(freshState())
    s = reducer(s, { type: 'REJECT_COMPLETION', id: s.data.completions[0].id })
    s = claim(s)
    expect(s.data.completions).toHaveLength(2)
    s = claim(s, 'assign-zane-trash', '2026-07-06')
    expect(s.data.completions).toHaveLength(3)
  })

  it('snapshot survives later chore edits', () => {
    let s = claim(freshState())
    s = reducer(s, { type: 'UPDATE_CHORE', id: 'chore-trash', patch: { points: 999 } })
    expect(s.data.completions[0].points).toBe(10)
  })
})

describe('prize redemption', () => {
  it('deducts immediately and creates a pending redemption', () => {
    // Nova has 120 seeded points; Pocket Change costs 25
    const s = reducer(freshState(), {
      type: 'REDEEM_PRIZE',
      playerId: 'player-nova',
      prizeId: 'prize-coins-few',
    })
    expect(s.data.players.find((p) => p.id === 'player-nova')!.pointsBank).toBe(95)
    expect(s.data.redemptions).toHaveLength(1)
    expect(s.data.redemptions[0].status).toBe('pending')
    expect(s.data.redemptions[0].cost).toBe(25)
  })

  it('refuses redemption the player cannot afford', () => {
    // Luna has 45 points; Galactic Cash Pile costs 800
    const s = reducer(freshState(), {
      type: 'REDEEM_PRIZE',
      playerId: 'player-luna',
      prizeId: 'prize-cash-huge',
    })
    expect(s.data.redemptions).toHaveLength(0)
    expect(s.data.players.find((p) => p.id === 'player-luna')!.pointsBank).toBe(45)
  })

  it('cancel refunds the bank; fulfill does not', () => {
    let s = reducer(freshState(), {
      type: 'REDEEM_PRIZE',
      playerId: 'player-nova',
      prizeId: 'prize-coins-few',
    })
    const cancelled = reducer(s, { type: 'CANCEL_REDEMPTION', id: s.data.redemptions[0].id })
    expect(cancelled.data.players.find((p) => p.id === 'player-nova')!.pointsBank).toBe(120)
    expect(cancelled.data.redemptions[0].status).toBe('cancelled')

    s = reducer(s, { type: 'FULFILL_REDEMPTION', id: s.data.redemptions[0].id })
    expect(s.data.players.find((p) => p.id === 'player-nova')!.pointsBank).toBe(95)
    expect(s.data.redemptions[0].status).toBe('fulfilled')
  })
})

describe('CRUD safety rules', () => {
  it('deleting a chore with history archives it; without history removes it', () => {
    let s = claim(freshState())
    s = reducer(s, { type: 'DELETE_CHORE', id: 'chore-trash' })
    expect(s.data.chores.find((c) => c.id === 'chore-trash')!.archived).toBe(true)
    expect(s.data.assignments.some((a) => a.choreId === 'chore-trash')).toBe(false)

    const s2 = reducer(freshState(), { type: 'DELETE_CHORE', id: 'chore-car' })
    expect(s2.data.chores.some((c) => c.id === 'chore-car')).toBe(false)
  })

  it('deleting a player cascades their records and clears active selection', () => {
    let s = claim(freshState())
    s = { ...s, ui: { ...s.ui, activePlayerId: 'player-zane' } }
    s = reducer(s, { type: 'DELETE_PLAYER', id: 'player-zane' })
    expect(s.data.players.some((p) => p.id === 'player-zane')).toBe(false)
    expect(s.data.assignments.some((a) => a.playerId === 'player-zane')).toBe(false)
    expect(s.data.completions.some((c) => c.playerId === 'player-zane')).toBe(false)
    expect(s.ui.activePlayerId).toBeNull()
  })

  it('SET_PLAYER_ASSIGNMENTS keeps ids of retained chores and diffs the rest', () => {
    const before = freshState()
    const keptId = before.data.assignments.find(
      (a) => a.playerId === 'player-luna' && a.choreId === 'chore-bedroom',
    )!.id
    const s = reducer(before, {
      type: 'SET_PLAYER_ASSIGNMENTS',
      playerId: 'player-luna',
      choreIds: ['chore-bedroom', 'chore-vacuum'],
    })
    const mine = s.data.assignments.filter((a) => a.playerId === 'player-luna')
    expect(mine).toHaveLength(2)
    expect(mine.find((a) => a.choreId === 'chore-bedroom')!.id).toBe(keptId)
    expect(mine.some((a) => a.choreId === 'chore-trash')).toBe(false)
    expect(mine.some((a) => a.choreId === 'chore-vacuum')).toBe(true)
  })
})

describe('settings', () => {
  it('changing weekStartDay re-stamps completion week keys from claimedAt', () => {
    let s = claim(freshState()) // claimedAt = now
    const claimedAt = s.data.completions[0].claimedAt
    s = reducer(s, { type: 'UPDATE_SETTINGS', patch: { weekStartDay: 0 } })
    const restamped = s.data.completions[0]
    const d = new Date(claimedAt)
    const localMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    localMidnight.setDate(localMidnight.getDate() - localMidnight.getDay())
    const expected = `${localMidnight.getFullYear()}-${String(localMidnight.getMonth() + 1).padStart(2, '0')}-${String(localMidnight.getDate()).padStart(2, '0')}`
    expect(restamped.weekKey).toBe(expected)
    expect(s.data.settings.weekStartDay).toBe(0)
  })

  it('navigating away from admin relocks it', () => {
    let s = freshState()
    s = reducer(s, { type: 'NAVIGATE', screen: 'admin' })
    s = reducer(s, { type: 'UNLOCK_ADMIN' })
    expect(s.ui.adminUnlocked).toBe(true)
    s = reducer(s, { type: 'NAVIGATE', screen: 'title' })
    expect(s.ui.adminUnlocked).toBe(false)
  })
})

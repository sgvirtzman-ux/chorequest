export type ID = string

/** 0 = Sunday … 6 = Saturday (matches Date.getDay()) */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

/** Local date of the week's first day, "YYYY-MM-DD" */
export type WeekKey = string

export interface Player {
  id: ID
  name: string
  age: number
  gender: string
  avatarId: string
  pointsBank: number
  lifetimePoints: number
  createdAt: string
}

export interface Chore {
  id: ID
  name: string
  description: string
  iconId: string
  points: number
  /** soft-deleted (kept because history references it) */
  archived: boolean
}

export interface Prize {
  id: ID
  name: string
  description: string
  iconId: string
  cost: number
  archived: boolean
}

/** Recurring weekly template: this player does this chore every week. */
export interface Assignment {
  id: ID
  playerId: ID
  choreId: ID
}

export type CompletionStatus = 'pending' | 'approved' | 'rejected'

export interface ChoreCompletion {
  id: ID
  assignmentId: ID
  playerId: ID
  choreId: ID
  /** snapshots so later chore edits don't rewrite history */
  choreName: string
  points: number
  weekKey: WeekKey
  status: CompletionStatus
  claimedAt: string
  resolvedAt: string | null
}

export type RedemptionStatus = 'pending' | 'fulfilled' | 'cancelled'

export interface PrizeRedemption {
  id: ID
  playerId: ID
  prizeId: ID
  prizeName: string
  cost: number
  status: RedemptionStatus
  redeemedAt: string
  resolvedAt: string | null
}

export interface Settings {
  weekStartDay: Weekday
  soundMuted: boolean
  parentPin: string
}

export const CURRENT_VERSION = 1

export interface PersistedState {
  version: number
  players: Player[]
  chores: Chore[]
  prizes: Prize[]
  assignments: Assignment[]
  completions: ChoreCompletion[]
  redemptions: PrizeRedemption[]
  settings: Settings
}

export type Screen = 'title' | 'dashboard' | 'shop' | 'leaderboard' | 'admin'

/** Transient UI state — never persisted; app always reloads to the title screen. */
export interface UiState {
  screen: Screen
  activePlayerId: ID | null
  adminUnlocked: boolean
}

export interface AppState {
  data: PersistedState
  ui: UiState
}

export type Action =
  | { type: 'ADD_PLAYER'; player: Pick<Player, 'name' | 'age' | 'gender' | 'avatarId'> }
  | { type: 'UPDATE_PLAYER'; id: ID; patch: Partial<Pick<Player, 'name' | 'age' | 'gender' | 'avatarId'>> }
  | { type: 'DELETE_PLAYER'; id: ID }
  | { type: 'ADD_CHORE'; chore: Pick<Chore, 'name' | 'description' | 'iconId' | 'points'> }
  | { type: 'UPDATE_CHORE'; id: ID; patch: Partial<Pick<Chore, 'name' | 'description' | 'iconId' | 'points'>> }
  | { type: 'DELETE_CHORE'; id: ID }
  | { type: 'ADD_PRIZE'; prize: Pick<Prize, 'name' | 'description' | 'iconId' | 'cost'> }
  | { type: 'UPDATE_PRIZE'; id: ID; patch: Partial<Pick<Prize, 'name' | 'description' | 'iconId' | 'cost'>> }
  | { type: 'DELETE_PRIZE'; id: ID }
  | { type: 'SET_PLAYER_ASSIGNMENTS'; playerId: ID; choreIds: ID[] }
  | { type: 'CLAIM_CHORE'; assignmentId: ID; weekKey: WeekKey }
  | { type: 'APPROVE_COMPLETION'; id: ID }
  | { type: 'REJECT_COMPLETION'; id: ID }
  | { type: 'REDEEM_PRIZE'; playerId: ID; prizeId: ID }
  | { type: 'FULFILL_REDEMPTION'; id: ID }
  | { type: 'CANCEL_REDEMPTION'; id: ID }
  | { type: 'UPDATE_SETTINGS'; patch: Partial<Settings> }
  | { type: 'IMPORT_STATE'; data: PersistedState }
  | { type: 'RESET_TO_SEED' }
  | { type: 'NAVIGATE'; screen: Screen }
  | { type: 'SELECT_PLAYER'; playerId: ID }
  | { type: 'UNLOCK_ADMIN' }
  | { type: 'LOCK_ADMIN' }

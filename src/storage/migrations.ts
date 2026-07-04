import { CURRENT_VERSION, type PersistedState } from '../types'

/**
 * Stepwise migrations: MIGRATIONS[n] upgrades a version-n state to n+1.
 * Empty today (version 1 is the first schema); the machinery exists so a
 * future schema change is one entry here, never a data wipe.
 */
const MIGRATIONS: Record<number, (s: Record<string, unknown>) => Record<string, unknown>> = {}

const isStr = (v: unknown): v is string => typeof v === 'string'
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)
const isBool = (v: unknown): v is boolean => typeof v === 'boolean'
const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

function isValidRecordArray(
  v: unknown,
  check: (item: Record<string, unknown>) => boolean,
): boolean {
  return Array.isArray(v) && v.every((item) => isObj(item) && check(item))
}

export function validateState(s: unknown): s is PersistedState {
  if (!isObj(s)) return false
  if (!isNum(s.version)) return false
  if (
    !isValidRecordArray(
      s.players,
      (p) =>
        isStr(p.id) && isStr(p.name) && isNum(p.age) && isStr(p.gender) &&
        isStr(p.avatarId) && isNum(p.pointsBank) && isNum(p.lifetimePoints) &&
        isStr(p.createdAt),
    )
  ) {
    return false
  }
  if (
    !isValidRecordArray(
      s.chores,
      (c) =>
        isStr(c.id) && isStr(c.name) && isStr(c.description) && isStr(c.iconId) &&
        isNum(c.points) && isBool(c.archived),
    )
  ) {
    return false
  }
  if (
    !isValidRecordArray(
      s.prizes,
      (p) =>
        isStr(p.id) && isStr(p.name) && isStr(p.description) && isStr(p.iconId) &&
        isNum(p.cost) && isBool(p.archived),
    )
  ) {
    return false
  }
  if (
    !isValidRecordArray(
      s.assignments,
      (a) => isStr(a.id) && isStr(a.playerId) && isStr(a.choreId),
    )
  ) {
    return false
  }
  if (
    !isValidRecordArray(
      s.completions,
      (c) =>
        isStr(c.id) && isStr(c.assignmentId) && isStr(c.playerId) && isStr(c.choreId) &&
        isStr(c.choreName) && isNum(c.points) && isStr(c.weekKey) &&
        (c.status === 'pending' || c.status === 'approved' || c.status === 'rejected') &&
        isStr(c.claimedAt) && (c.resolvedAt === null || isStr(c.resolvedAt)),
    )
  ) {
    return false
  }
  if (
    !isValidRecordArray(
      s.redemptions,
      (r) =>
        isStr(r.id) && isStr(r.playerId) && isStr(r.prizeId) && isStr(r.prizeName) &&
        isNum(r.cost) &&
        (r.status === 'pending' || r.status === 'fulfilled' || r.status === 'cancelled') &&
        isStr(r.redeemedAt) && (r.resolvedAt === null || isStr(r.resolvedAt)),
    )
  ) {
    return false
  }
  if (!isObj(s.settings)) return false
  const st = s.settings
  if (!isNum(st.weekStartDay) || st.weekStartDay < 0 || st.weekStartDay > 6) return false
  if (!isBool(st.soundMuted) || !isStr(st.parentPin)) return false
  return true
}

/** Parse → migrate stepwise → validate. Throws on anything unusable. */
export function parsePersistedState(serialized: string): PersistedState {
  const parsed: unknown = JSON.parse(serialized)
  if (!isObj(parsed) || !isNum(parsed.version)) {
    throw new Error('Not a ChoreQuest save file')
  }
  if (parsed.version > CURRENT_VERSION) {
    throw new Error(`Save is from a newer app version (${parsed.version})`)
  }
  let state: Record<string, unknown> = parsed
  for (let v = parsed.version; v < CURRENT_VERSION; v++) {
    const step = MIGRATIONS[v]
    if (!step) throw new Error(`No migration path from version ${v}`)
    state = { ...step(state), version: v + 1 }
  }
  if (!validateState(state)) {
    throw new Error('Save data failed validation')
  }
  return state
}

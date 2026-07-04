import type {
  Assignment,
  Chore,
  ChoreCompletion,
  ID,
  PersistedState,
  Player,
  PrizeRedemption,
  WeekKey,
} from '../types'

export interface WeekChoreEntry {
  assignment: Assignment
  chore: Chore
  /** null = still to do this week (rejected completions read as retryable) */
  completion: ChoreCompletion | null
}

export function getPlayerWeekChores(
  data: PersistedState,
  playerId: ID,
  weekKey: WeekKey,
): WeekChoreEntry[] {
  return data.assignments
    .filter((a) => a.playerId === playerId)
    .flatMap((assignment) => {
      const chore = data.chores.find((c) => c.id === assignment.choreId)
      if (!chore || chore.archived) return []
      const completion =
        data.completions.find(
          (c) =>
            c.assignmentId === assignment.id &&
            c.weekKey === weekKey &&
            c.status !== 'rejected',
        ) ?? null
      return [{ assignment, chore, completion }]
    })
    .sort((a, b) => a.chore.name.localeCompare(b.chore.name))
}

export interface LeaderboardRow {
  player: Player
  weekPoints: number
  weekDone: number
}

export function getLeaderboard(data: PersistedState, weekKey: WeekKey): LeaderboardRow[] {
  return data.players
    .map((player) => {
      const approved = data.completions.filter(
        (c) => c.playerId === player.id && c.weekKey === weekKey && c.status === 'approved',
      )
      return {
        player,
        weekPoints: approved.reduce((sum, c) => sum + c.points, 0),
        weekDone: approved.length,
      }
    })
    .sort(
      (a, b) => b.weekPoints - a.weekPoints || a.player.name.localeCompare(b.player.name),
    )
}

export function getPendingCompletions(data: PersistedState): ChoreCompletion[] {
  return data.completions
    .filter((c) => c.status === 'pending')
    .sort((a, b) => a.claimedAt.localeCompare(b.claimedAt))
}

export function getPendingRedemptions(data: PersistedState): PrizeRedemption[] {
  return data.redemptions
    .filter((r) => r.status === 'pending')
    .sort((a, b) => a.redeemedAt.localeCompare(b.redeemedAt))
}

export function getPlayerPendingRedemptions(
  data: PersistedState,
  playerId: ID,
): PrizeRedemption[] {
  return getPendingRedemptions(data).filter((r) => r.playerId === playerId)
}

/** Badge count for the admin gear: everything a parent needs to look at. */
export function getPendingApprovalsCount(data: PersistedState): number {
  return getPendingCompletions(data).length + getPendingRedemptions(data).length
}

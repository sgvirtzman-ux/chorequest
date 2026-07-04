import { describe, expect, it } from 'vitest'
import { seedState } from '../data/seed'
import { parsePersistedState, validateState } from './migrations'

describe('validateState / parsePersistedState', () => {
  it('accepts the seed state round-tripped through JSON', () => {
    const raw = JSON.stringify(seedState())
    expect(parsePersistedState(raw)).toEqual(seedState())
  })

  it('rejects garbage, wrong shapes and missing fields', () => {
    expect(() => parsePersistedState('not json')).toThrow()
    expect(() => parsePersistedState('42')).toThrow()
    expect(() => parsePersistedState('{}')).toThrow()

    const noPlayers = { ...seedState(), players: 'nope' }
    expect(validateState(noPlayers)).toBe(false)

    const badPlayer = seedState() as unknown as Record<string, unknown>
    ;(badPlayer.players as Record<string, unknown>[])[0].age = 'eleven'
    expect(validateState(badPlayer)).toBe(false)

    const badSettings = { ...seedState(), settings: { weekStartDay: 9, soundMuted: false, parentPin: '1234' } }
    expect(validateState(badSettings)).toBe(false)
  })

  it('rejects saves from a newer version', () => {
    const future = JSON.stringify({ ...seedState(), version: 999 })
    expect(() => parsePersistedState(future)).toThrow(/newer/)
  })
})

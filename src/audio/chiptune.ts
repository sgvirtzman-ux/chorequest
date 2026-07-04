/**
 * Chiptune SFX straight from the Web Audio API — no audio files.
 * The AudioContext is created lazily on the first play() (always inside a
 * user gesture, satisfying autoplay policy).
 */

export type JingleName =
  | 'click'
  | 'claim'
  | 'coin'
  | 'fanfare'
  | 'reject'
  | 'error'
  | 'start'

let ctx: AudioContext | null = null
let master: GainNode | null = null
let muted = false

function ensure(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = 0.16
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function note(
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = 'square',
  vol = 1,
) {
  const ac = ensure()
  const osc = ac.createOscillator()
  osc.type = type
  osc.frequency.value = freq
  const gain = ac.createGain()
  const t0 = ac.currentTime + start
  gain.gain.setValueAtTime(0, t0)
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur)
  osc.connect(gain)
  gain.connect(master!)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

function noiseBurst(start: number, dur: number, vol = 0.4) {
  const ac = ensure()
  const buffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * dur), ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = ac.createBufferSource()
  src.buffer = buffer
  const gain = ac.createGain()
  const t0 = ac.currentTime + start
  gain.gain.setValueAtTime(vol, t0)
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur)
  src.connect(gain)
  gain.connect(master!)
  src.start(t0)
}

// note frequencies (equal temperament)
const C5 = 523.25
const E5 = 659.25
const G5 = 783.99
const B5 = 987.77
const C6 = 1046.5
const E6 = 1318.51
const G6 = 1567.98

const JINGLES: Record<JingleName, () => void> = {
  click: () => note(880, 0, 0.06, 'square', 0.5),
  claim: () => {
    note(C5, 0, 0.09)
    note(E5, 0.08, 0.09)
    note(G5, 0.16, 0.16)
  },
  coin: () => {
    note(B5, 0, 0.08)
    note(E6, 0.07, 0.24)
  },
  fanfare: () => {
    note(C5, 0, 0.11)
    note(E5, 0.1, 0.11)
    note(G5, 0.2, 0.11)
    note(C6, 0.3, 0.18)
    note(E6, 0.42, 0.3)
    note(C5, 0.3, 0.3, 'triangle', 0.8)
    note(G6, 0.56, 0.35, 'triangle', 0.6)
  },
  reject: () => {
    note(392, 0, 0.12, 'square', 0.6)
    note(311.13, 0.12, 0.22, 'square', 0.6)
    noiseBurst(0.12, 0.18, 0.25)
  },
  error: () => {
    note(130.81, 0, 0.18, 'triangle', 0.9)
    note(123.47, 0.16, 0.22, 'triangle', 0.9)
  },
  start: () => {
    note(C5, 0, 0.08)
    note(G5, 0.07, 0.08)
    note(C6, 0.14, 0.08)
    note(E6, 0.21, 0.22)
    note(G6, 0.32, 0.3, 'triangle', 0.7)
  },
}

export const sfx = {
  play(name: JingleName) {
    if (muted) return
    try {
      JINGLES[name]()
    } catch {
      // audio unavailable (old browser, blocked) — the game plays on silently
    }
  },
  setMuted(value: boolean) {
    muted = value
  },
}

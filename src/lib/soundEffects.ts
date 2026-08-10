// Web Audio API Synthesizer for Sinar Boutique Notifications
// 100% reliable, zero external MP3 dependencies, instant playback

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * Plays a gentle, elegant dual-harmonic boutique chime
 */
export function playLuxuryChime() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    // Oscillator 1: Main chime (High Bell)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = "sine"
    osc1.frequency.setValueAtTime(880, now) // A5
    osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.1) // E6
    gain1.gain.setValueAtTime(0.2, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8)

    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.8)

    // Oscillator 2: Soft harmonic shimmer
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = "triangle"
    osc2.frequency.setValueAtTime(1760, now + 0.08) // A6
    gain2.gain.setValueAtTime(0.12, now + 0.08)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9)

    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.08)
    osc2.stop(now + 0.9)
  } catch (err) {
    console.warn("Audio notification blocked by browser policy:", err)
  }
}

/**
 * Plays a pleasant order/slip confirmation chime
 */
export function playCashChime() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(523.25, now) // C5
    osc.frequency.setValueAtTime(659.25, now + 0.08) // E5
    osc.frequency.setValueAtTime(783.99, now + 0.16) // G5
    osc.frequency.setValueAtTime(1046.5, now + 0.24) // C6

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 1.2)
  } catch (err) {
    console.warn("Audio notification blocked:", err)
  }
}

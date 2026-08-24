import { useSyncExternalStore } from "react"

/**
 * The film owns the frame. While an act is on screen the floating chrome —
 * stylist button, social-proof toasts, install pill — is held back, and the
 * closer hands the screen over to them. Scenes call this every frame, so the
 * setter is a no-op unless the value actually flips.
 */
let held = false
const subs = new Set<() => void>()

export function holdOverlays(next: boolean) {
  if (next === held) return
  held = next
  subs.forEach((fn) => fn())
}

function subscribe(fn: () => void) {
  subs.add(fn)
  return () => subs.delete(fn)
}

const snapshot = () => held

export function useOverlaysHeld() {
  return useSyncExternalStore(subscribe, snapshot, snapshot)
}

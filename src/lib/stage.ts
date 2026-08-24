import { useEffect, type RefObject } from "react"

/**
 * A "stage" is a tall section wrapped around a sticky 100vh panel.
 * Progress runs 0 -> 1 as the section scrolls through the viewport, and is
 * reported inside rAF so a scene can move its layers every frame without ever
 * re-rendering React. Ported from the iSpice /v1 scroll.
 */
export function useStage(ref: RefObject<HTMLElement | null>, onFrame: (p: number) => void) {
  useEffect(() => {
    let raf = 0
    const tick = () => {
      const el = ref.current
      if (el) {
        const r = el.getBoundingClientRect()
        const span = r.height - window.innerHeight
        const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0
        const visible = r.top < window.innerHeight && r.bottom > 0
        if (visible) onFrame(p)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [ref, onFrame])
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** Map a sub-range of a stage to its own 0 -> 1. */
export const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a))

/**
 * Burmese sets wider than Latin at the same size and its stacked diacritics
 * need a taller line, so every display size ships as a pair and the language
 * picks one. Myanmar is the default here, so this is not optional.
 */
export const dsize = (lang: "mm" | "en", latin: string, mm: string) => (lang === "mm" ? mm : latin)

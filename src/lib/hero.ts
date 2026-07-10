import { useEffect, useState } from "react"
import { supabase, isConfigured } from "./supabase"

// Landing hero background slides. Managed from Admin → Landing.
// Global source of truth = a JSON file in the public storage bucket
// (product-images/hero-config.json); localStorage is a fast local cache.
export const DEFAULT_HERO_SLIDES: string[] = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1700&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1700&q=80",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1700&q=80",
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1700&q=80",
]

const KEY = "sinar_hero_slides"
const EVT = "sinar-hero-updated"
const CONFIG_PATH = "hero-config.json"

// Synchronous read for first paint (local cache → defaults)
export function getHeroSlides(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as string[]
      if (Array.isArray(parsed) && parsed.length) return parsed.filter(Boolean)
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_HERO_SLIDES
}

// Global read from storage bucket (all visitors see the same)
export async function fetchRemoteSlides(): Promise<string[] | null> {
  if (!isConfigured) return null
  try {
    const { data } = supabase.storage.from("product-images").getPublicUrl(CONFIG_PATH)
    const res = await fetch(`${data.publicUrl}?t=${Date.now()}`, { cache: "no-store" })
    if (!res.ok) return null
    const json = await res.json()
    return Array.isArray(json) && json.length ? json.filter(Boolean) : null
  } catch {
    return null
  }
}

export function saveHeroSlides(slides: string[]) {
  const clean = slides.map((s) => s.trim()).filter(Boolean)
  const value = clean.length ? clean : DEFAULT_HERO_SLIDES
  try {
    localStorage.setItem(KEY, JSON.stringify(value))
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVT))
  // Push global config so every visitor gets it
  if (isConfigured) {
    const blob = new Blob([JSON.stringify(value)], { type: "application/json" })
    supabase.storage.from("product-images").upload(CONFIG_PATH, blob, { upsert: true, contentType: "application/json" }).catch(() => {})
  }
}

export function resetHeroSlides() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVT))
  if (isConfigured) {
    const blob = new Blob([JSON.stringify(DEFAULT_HERO_SLIDES)], { type: "application/json" })
    supabase.storage.from("product-images").upload(CONFIG_PATH, blob, { upsert: true, contentType: "application/json" }).catch(() => {})
  }
}

export function useHeroSlides(): string[] {
  const [slides, setSlides] = useState<string[]>(getHeroSlides)
  useEffect(() => {
    let alive = true
    fetchRemoteSlides().then((remote) => {
      if (alive && remote) {
        setSlides(remote)
        try { localStorage.setItem(KEY, JSON.stringify(remote)) } catch { /* ignore */ }
      }
    })
    const handler = () => setSlides(getHeroSlides())
    window.addEventListener(EVT, handler)
    window.addEventListener("storage", handler)
    return () => {
      alive = false
      window.removeEventListener(EVT, handler)
      window.removeEventListener("storage", handler)
    }
  }, [])
  return slides
}

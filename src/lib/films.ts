import { useEffect, useState } from "react"

export type Film = {
  id: string
  title_en: string
  title_mm: string
  tag_en: string
  tag_mm: string
  runtime: string
  src: string
  poster: string
}

// Defaults — placeholder sample clips. Replace `src` with real Sinar films
// (drop .mp4 in /public/film/ and set src to "/film/xxx.mp4"), or manage
// everything from the Admin → Films tab (saved in the browser).
export const DEFAULT_FILMS: Film[] = [
  {
    id: "campaign",
    title_en: "Autumn / Winter Campaign",
    title_mm: "ဆောင်းဦး ကမ်ပိန်း",
    tag_en: "Campaign",
    tag_mm: "ကမ်ပိန်း",
    runtime: "1:12",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    poster: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80",
  },
  {
    id: "atelier",
    title_en: "Inside the Atelier",
    title_mm: "အက်တလီယာ အတွင်း",
    tag_en: "Behind the seams",
    tag_mm: "ချုပ်လုပ်မှု",
    runtime: "0:48",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=1200&q=80",
  },
  {
    id: "lookbook",
    title_en: "The Knitwear Edit",
    title_mm: "ဆွယ်တာ အစုအဝေး",
    tag_en: "Lookbook",
    tag_mm: "လုခ်ဘွတ်",
    runtime: "1:30",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    poster: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&q=80",
  },
  {
    id: "street",
    title_en: "Myitkyina, After Hours",
    title_mm: "မြစ်ကြီးနား ည",
    tag_en: "Film",
    tag_mm: "ရုပ်ရှင်တို",
    runtime: "0:56",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
  },
]

const KEY = "sinar_films"
const EVT = "sinar-films-updated"

export function getFilms(): Film[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Film[]
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_FILMS
}

export function saveFilms(films: Film[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(films))
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVT))
}

export function resetFilms() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVT))
}

export function useFilms(): Film[] {
  const [films, setFilms] = useState<Film[]>(getFilms)
  useEffect(() => {
    const handler = () => setFilms(getFilms())
    window.addEventListener(EVT, handler)
    window.addEventListener("storage", handler)
    return () => {
      window.removeEventListener(EVT, handler)
      window.removeEventListener("storage", handler)
    }
  }, [])
  return films
}

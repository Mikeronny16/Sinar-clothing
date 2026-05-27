import { supabase, isConfigured } from "./supabase"

const STORAGE_KEY = "sinar_analytics"

type DayRecord = { date: string; visits: number }

function todayStr() {
  return new Date().toISOString().split("T")[0]
}

export function trackVisit() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const records: DayRecord[] = raw ? JSON.parse(raw) : []
    const today = todayStr()
    const idx = records.findIndex((r) => r.date === today)
    if (idx >= 0) {
      records[idx].visits++
    } else {
      records.push({ date: today, visits: 1 })
    }
    // Keep last 30 days
    const trimmed = records.slice(-30)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))

    // Try Supabase upsert if configured
    if (isConfigured) {
      supabase
        .from("page_visits")
        .upsert({ date: today, visits: (records[idx]?.visits ?? 1) }, { onConflict: "date" })
        .then(() => {}, () => {})
    }
  } catch {}
}

export function getLocalAnalytics(): DayRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getTotalVisits(): number {
  return getLocalAnalytics().reduce((s, r) => s + r.visits, 0)
}

export function getTodayVisits(): number {
  const today = todayStr()
  return getLocalAnalytics().find((r) => r.date === today)?.visits ?? 0
}

export function getLast7Days(): DayRecord[] {
  const all = getLocalAnalytics()
  const days: DayRecord[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split("T")[0]
    const found = all.find((r) => r.date === dateStr)
    days.push({ date: dateStr, visits: found?.visits ?? 0 })
  }
  return days
}

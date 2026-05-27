import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

type Lang = "mm" | "en"

interface LangContextValue {
  lang: Lang
  toggle: () => void
  t: (mm: string, en: string) => string
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem("sinar-lang")
      return (stored === "en" || stored === "mm") ? stored : "mm"
    } catch {
      return "mm"
    }
  })

  const toggle = useCallback(() => {
    setLang((prev) => {
      const next = prev === "mm" ? "en" : "mm"
      try { localStorage.setItem("sinar-lang", next) } catch {}
      return next
    })
  }, [])

  const t = useCallback((mm: string, en: string) => lang === "mm" ? mm : en, [lang])

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error("useLang must be used within LangProvider")
  return ctx
}

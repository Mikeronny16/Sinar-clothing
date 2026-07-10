import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

const KEY = "sinar_wishlist"

type Ctx = {
  ids: string[]
  has: (id: string) => boolean
  toggle: (id: string) => void
  count: number
}

const WishlistContext = createContext<Ctx | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]")
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids))
    } catch {
      /* ignore */
    }
  }, [ids])

  const has = useCallback((id: string) => ids.includes(id), [ids])
  const toggle = useCallback(
    (id: string) => setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])),
    []
  )

  return (
    <WishlistContext.Provider value={{ ids, has, toggle, count: ids.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const c = useContext(WishlistContext)
  if (!c) throw new Error("useWishlist must be used within WishlistProvider")
  return c
}

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react"
import { viberLink } from "@/config"

const KEY = "sinar_cart"

export type CartItem = {
  id: string
  name_en: string
  name_mm: string
  price: number
  image_url: string
  size?: string
  color?: string
  qty: number
}

type AddInput = Omit<CartItem, "qty">

type Ctx = {
  items: CartItem[]
  add: (item: AddInput, qty?: number) => void
  remove: (id: string, size?: string, color?: string) => void
  setQty: (id: string, size: string | undefined, color: string | undefined, qty: number) => void
  clear: () => void
  count: number
  total: number
  open: boolean
  setOpen: (v: boolean) => void
  orderUrl: () => string
  orderText: () => string
}

const CartContext = createContext<Ctx | null>(null)

const lineKey = (id: string, size?: string, color?: string) => `${id}__${size ?? ""}__${color ?? ""}`

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]")
    } catch {
      return []
    }
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* ignore */
    }
  }, [items])

  const add = useCallback((item: AddInput, qty = 1) => {
    setItems((prev) => {
      const k = lineKey(item.id, item.size, item.color)
      const found = prev.find((p) => lineKey(p.id, p.size, p.color) === k)
      if (found) return prev.map((p) => (lineKey(p.id, p.size, p.color) === k ? { ...p, qty: p.qty + qty } : p))
      return [...prev, { ...item, qty }]
    })
    setOpen(true)
  }, [])

  const remove = useCallback((id: string, size?: string, color?: string) => {
    setItems((prev) => prev.filter((p) => lineKey(p.id, p.size, p.color) !== lineKey(id, size, color)))
  }, [])

  const setQty = useCallback((id: string, size: string | undefined, color: string | undefined, qty: number) => {
    setItems((prev) =>
      prev
        .map((p) => (lineKey(p.id, p.size, p.color) === lineKey(id, size, color) ? { ...p, qty: Math.max(0, qty) } : p))
        .filter((p) => p.qty > 0)
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items])
  const total = useMemo(() => items.reduce((n, i) => n + i.qty * (i.price || 0), 0), [items])

  const orderText = useCallback(() => {
    const lines = items.map((i) => `• ${i.qty}× ${i.name_en}${i.size ? ` / ${i.size}` : ""}${i.color ? ` / ${i.color}` : ""}${i.price ? ` — ${(i.price * i.qty).toLocaleString()} Ks` : ""}`)
    return `မင်္ဂလာပါ Sinar! Order တင်ချင်ပါတယ် 🛍️\n\n${lines.join("\n")}\n\nTotal: ${total.toLocaleString()} Ks`
  }, [items, total])

  const orderUrl = useCallback(() => viberLink(), [])

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, count, total, open, setOpen, orderUrl, orderText }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const c = useContext(CartContext)
  if (!c) throw new Error("useCart must be used within CartProvider")
  return c
}

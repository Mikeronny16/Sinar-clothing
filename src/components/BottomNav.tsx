import { Home, ShoppingBag, Heart, MessageCircle, ShoppingCart } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { viberLink } from "@/config"
import { useLang } from "@/lib/lang"
import { useWishlist } from "@/lib/wishlist"
import { useCart } from "@/lib/cart"

export default function BottomNav() {
  const { t, lang } = useLang()
  const { pathname } = useLocation()
  const nav = useNavigate()
  const { count: savedCount } = useWishlist()
  const { count: cartCount, setOpen } = useCart()

  const items = [
    { id: "home", icon: Home, mm: "ပင်မ", en: "Home", to: "/" },
    { id: "shop", icon: ShoppingBag, mm: "ဆိုင်", en: "Shop", to: "/shop" },
    { id: "saved", icon: Heart, mm: "သိမ်း", en: "Saved", to: "/saved", badge: savedCount },
    { id: "bag", icon: ShoppingCart, mm: "စျေးခြင်း", en: "Bag", badge: cartCount, action: () => setOpen(true) },
    { id: "chat", icon: MessageCircle, mm: "Viber", en: "Viber", href: viberLink() },
  ]

  const isActive = (to?: string) => to && (to === "/" ? pathname === "/" : pathname.startsWith(to))

  return (
    <nav
      className="fixed inset-x-0 z-[60] flex justify-center px-4"
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
      aria-label="Primary"
    >
      <div className="flex items-center gap-0.5 rounded-full border border-plum/10 bg-glass px-2 py-2 shadow-[0_10px_40px_-8px_rgba(47,25,72,0.35)] backdrop-blur-xl">
        {items.map((item) => {
          const on = !!isActive(item.to)
          const Icon = item.icon
          const inner = (
            <>
              <span className="relative">
                <Icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
                {!!item.badge && item.badge > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[9px] font-bold text-cream ring-2 ring-bg">
                    {item.badge}
                  </span>
                )}
              </span>
              <span className={`text-[12px] font-bold tracking-wide ${on ? "block" : "hidden sm:block"} ${lang === "mm" ? "font-mm" : ""}`}>
                {t(item.mm, item.en)}
              </span>
            </>
          )
          const cls = `relative flex items-center gap-1.5 rounded-full px-3 py-2 transition-all duration-300 ${
            on ? "bg-coral text-cream" : "text-plum/60 hover:text-plum"
          }`

          if (item.href) {
            return <a key={item.id} href={item.href} className={cls}>{inner}</a>
          }
          return (
            <button
              key={item.id}
              onClick={() => (item.action ? item.action() : item.to && nav(item.to))}
              className={cls}
            >
              {inner}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

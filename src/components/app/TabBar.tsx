import { Home, LayoutGrid, Heart, ShoppingBag, MessageCircle } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { viberLink } from "@/config"
import { useLang } from "@/lib/lang"
import { useWishlist } from "@/lib/wishlist"
import { useCart } from "@/lib/cart"

/** App tab bar, pinned to the bottom of the phone-width column. */
export default function TabBar() {
  const { t, lang } = useLang()
  const { pathname } = useLocation()
  const nav = useNavigate()
  const { count: savedCount } = useWishlist()
  const { count: cartCount, setOpen } = useCart()

  const items = [
    { id: "home", icon: Home, mm: "ပင်မ", en: "Home", on: pathname === "/", act: () => (pathname === "/" ? window.scrollTo({ top: 0, behavior: "smooth" }) : nav("/")) },
    { id: "shop", icon: LayoutGrid, mm: "အမျိုးအစား", en: "Category", on: pathname.startsWith("/shop"), act: () => nav("/shop") },
    { id: "saved", icon: Heart, mm: "သိမ်းထား", en: "Saved", badge: savedCount, on: pathname === "/saved", act: () => nav("/saved") },
    { id: "bag", icon: ShoppingBag, mm: "အိတ်", en: "Bag", badge: cartCount, act: () => setOpen(true) },
    { id: "viber", icon: MessageCircle, mm: "Viber", en: "Viber", href: viberLink() },
  ]

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 z-[60] mx-auto max-w-[480px] px-3"
      style={{ bottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      <div className="flex h-[66px] items-center justify-around rounded-[26px] border border-k-green/5 bg-white/90 shadow-[0_10px_30px_rgba(31,61,43,0.14)] backdrop-blur-xl">
        {items.map((it) => {
          const Icon = it.icon
          const inner = (
            <>
              <span className="relative">
                <Icon className={`h-[22px] w-[22px] ${it.on ? "text-k-pink" : ""}`} strokeWidth={it.on ? 2.3 : 1.9} />
                {!!it.badge && (
                  <motion.span
                    key={it.badge}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 600, damping: 15 }}
                    className="absolute -right-2.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full border-2 border-white bg-k-pink px-1 font-sans text-[9.5px] font-bold text-white"
                  >
                    {it.badge}
                  </motion.span>
                )}
              </span>
              <span className={`text-[10.5px] ${lang === "mm" ? "font-mm" : "font-sans"} ${it.on ? "font-semibold text-k-pink" : ""}`}>
                {t(it.mm, it.en)}
              </span>
            </>
          )
          const cls = "flex min-w-[56px] flex-col items-center gap-[3px] text-k-ink/55 active:scale-90 transition-transform"
          return it.href ? (
            <a key={it.id} href={it.href} className={cls}>{inner}</a>
          ) : (
            <button key={it.id} type="button" onClick={it.act} className={cls}>{inner}</button>
          )
        })}
      </div>
    </nav>
  )
}

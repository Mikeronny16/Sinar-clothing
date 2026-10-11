import { useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Heart } from "lucide-react"
import type { Product } from "@/lib/supabase"
import { useLang } from "@/lib/lang"
import { useWishlist } from "@/lib/wishlist"
import { FALLBACK_IMG } from "@/lib/products"

const NEW_DAYS = 14

export function isNew(p: Product) {
  if (!p.created_at) return false
  return Date.now() - new Date(p.created_at).getTime() < NEW_DAYS * 864e5
}

export const ks = (n: number) => `${n.toLocaleString("en-US")} Ks`

/** Image that sits on a shimmer until it has actually arrived. */
export function AppImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`k-shimmer relative overflow-hidden ${loaded ? "is-loaded" : ""} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          // a dead supplier link should not leave a shimmer running forever
          if (e.currentTarget.src !== FALLBACK_IMG) e.currentTarget.src = FALLBACK_IMG
        }}
        className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  )
}

export function HeartButton({ id, className = "", big = false }: { id: string; className?: string; big?: boolean }) {
  const { has, toggle } = useWishlist()
  const on = has(id)
  return (
    <motion.button
      type="button"
      aria-label="Save"
      aria-pressed={on}
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(id)
      }}
      className={`relative grid place-items-center ${big ? "h-12 w-12 rounded-2xl border border-k-ink/10 bg-white" : "h-8 w-8 rounded-full bg-white/90 shadow-sm backdrop-blur"} ${className}`}
    >
      {on && (
        <motion.span
          key="burst"
          initial={{ scale: 0.4, opacity: 0.7 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute h-8 w-8 rounded-full border-2 border-k-pink"
        />
      )}
      <motion.span
        key={String(on)}
        initial={{ scale: on ? 0.3 : 1 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 520, damping: 14 }}
        className="grid place-items-center"
      >
        <Heart className={`${big ? "h-6 w-6" : "h-4 w-4"} ${on ? "fill-k-pink text-k-pink" : "text-k-ink/60"}`} strokeWidth={2.2} />
      </motion.span>
    </motion.button>
  )
}

export function Price({ p, size = "sm" }: { p: Product; size?: "sm" | "md" }) {
  const off = p.original_price && p.original_price > p.price ? Math.round((1 - p.price / p.original_price) * 100) : 0
  return (
    <div className={`flex items-baseline gap-1.5 font-sans ${size === "md" ? "text-[15px]" : "text-[13.5px]"}`}>
      {off > 0 && <span className="font-bold text-k-pink">{off}%</span>}
      <span className="font-bold text-k-ink">{ks(p.price)}</span>
      {off > 0 && <span className="text-[11px] text-k-ink/35 line-through">{p.original_price!.toLocaleString("en-US")}</span>}
    </div>
  )
}

/** Grid tile: picture, heart, name, price. */
export default function ProductTile({ p }: { p: Product }) {
  const { t, lang } = useLang()
  const tag = p.badge || (isNew(p) ? "NEW" : "")
  return (
    <Link to={`/product/${p.id}`} className="group block">
      <div className="relative">
        <AppImage src={p.image_url} alt={p.name_en} className="aspect-[4/5] rounded-2xl" />
        {tag && (
          <span className="absolute left-2 top-2 rounded-md bg-k-pink px-1.5 py-0.5 font-sans text-[9.5px] font-bold uppercase tracking-wider text-white">
            {tag}
          </span>
        )}
        {p.sold_out && (
          <div className="absolute inset-0 grid place-items-center rounded-2xl bg-white/55">
            <span className="rounded-full bg-k-ink px-3 py-1 font-mm text-[11px] font-semibold text-white">
              {t("ကုန်သွားပြီ", "Sold out")}
            </span>
          </div>
        )}
        <HeartButton id={p.id} className="absolute bottom-2 right-2" />
      </div>
      <p className={`mt-2 truncate text-[12.5px] leading-relaxed text-k-ink/80 ${lang === "mm" ? "font-mm" : "font-sans"}`}>
        {t(p.name_mm, p.name_en)}
      </p>
      <Price p={p} />
    </Link>
  )
}

/** Two-column grid whose tiles glide into place when a filter changes. */
export function ProductGrid({ items }: { items: Product[] }) {
  const { t, lang } = useLang()
  if (items.length === 0) {
    return (
      <p className={`px-5 py-16 text-center text-[13px] text-k-ink/50 ${lang === "mm" ? "font-mm" : "font-sans"}`}>
        {t("ရှာမတွေ့ပါ — တခြားစကားလုံးနဲ့ ရှာကြည့်ပါ", "Nothing found — try another word")}
      </p>
    )
  }
  return (
    <motion.div layout className="grid grid-cols-2 gap-x-3 gap-y-5 px-5">
      <AnimatePresence mode="popLayout">
        {items.map((p) => (
          <motion.div
            key={p.id}
            layout
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <ProductTile p={p} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

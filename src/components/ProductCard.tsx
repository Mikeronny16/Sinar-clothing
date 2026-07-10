import { motion } from "framer-motion"
import { Heart, ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"
import { FALLBACK_IMG } from "@/lib/products"
import { useLang } from "@/lib/lang"
import { useWishlist } from "@/lib/wishlist"
import { useCart } from "@/lib/cart"
import type { Product } from "@/lib/supabase"

const SERIF = '"Playfair Display", "Lora", Georgia, serif'

interface Props {
  p: Product | (typeof import("@/lib/products").FALLBACK_PRODUCTS)[number]
  index?: number
}

export default function ProductCard({ p, index = 0 }: Props) {
  const { t, lang } = useLang()
  const { has, toggle } = useWishlist()
  const { add } = useCart()
  const id = String(p.id ?? p.name_en)
  const liked = has(id)
  const prod = p as Product
  const colors = Array.isArray(prod.colors) ? prod.colors : []

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (p.sold_out) return
    add({
      id,
      name_en: p.name_en,
      name_mm: p.name_mm,
      price: p.price,
      image_url: p.image_url,
      size: p.sizes?.[0],
    })
  }

  const idx = String(index + 1).padStart(2, "0")

  return (
    <motion.article
      className="group flex flex-col transition-transform duration-500 ease-out hover:-translate-y-1.5"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 5) * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Image */}
      <Link
        to={`/product/${id}`}
        className="relative block overflow-hidden rounded-[3px] bg-bg-mid"
        style={{ aspectRatio: "3 / 4" }}
      >
        <img
          src={p.image_url || FALLBACK_IMG}
          alt={p.name_en}
          loading="lazy"
          onError={(e) => {
            const el = e.currentTarget
            if (!el.dataset.fb) { el.dataset.fb = "1"; el.src = FALLBACK_IMG }
          }}
          className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.08]"
        />

        {/* cinematic scrim + View cue on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1A1611]/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {!p.sold_out && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-4 items-center gap-2 p-4 text-[#F3EEE4] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="text-[10px] font-medium uppercase tracking-[0.3em]">{t("ကြည့်ရန်", "View")}</span>
            <span className="h-px flex-1" style={{ background: "#C28773" }} />
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
          </div>
        )}

        {p.sold_out && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1A1611]/45">
            <span className="border border-[#F3EEE4] px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-[#F3EEE4]">
              {t("ရောင်းပြီး", "Sold Out")}
            </span>
          </div>
        )}

        {prod.badge && (
          <span className="absolute left-3 top-3 bg-[#1A1611] px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-[#F3EEE4]">
            {prod.badge}
          </span>
        )}

        {/* Wishlist heart — minimal */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(id) }}
          aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
          className={`absolute right-3 top-3 transition-colors ${liked ? "text-coral" : "text-[#F3EEE4] drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] hover:text-coral"}`}
        >
          <Heart className="h-[17px] w-[17px]" fill={liked ? "currentColor" : "none"} strokeWidth={1.6} />
        </button>
      </Link>

      {/* Info below image */}
      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[9px] uppercase tracking-[0.28em] text-text-muted">{idx}</span>
          {p.category && (
            <span className="text-[9px] uppercase tracking-[0.28em] text-text-muted">{p.category}</span>
          )}
        </div>

        <h3
          className={`mt-2 text-[17px] leading-snug text-text ${lang === "mm" ? "font-mm" : ""}`}
          style={lang === "mm" ? undefined : { fontFamily: SERIF, fontWeight: 500 }}
        >
          {lang === "mm" ? p.name_mm : p.name_en}
        </h3>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm text-coral">
            {p.price > 0 ? `${p.price.toLocaleString()} ${t("ကျပ်", "Ks")}` : t("ဈေးမေးရန်", "Ask for price")}
          </span>
          {prod.original_price && prod.original_price > p.price && (
            <span className="text-xs text-text-muted line-through">
              {prod.original_price.toLocaleString()} {t("ကျပ်", "Ks")}
            </span>
          )}
        </div>

        {colors.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            {colors.slice(0, 6).map((c, ci) => (
              <span
                key={ci}
                title={c.name}
                className="h-3.5 w-3.5 rounded-full border border-text/20"
                style={{ background: c.hex }}
              />
            ))}
            {colors.length > 6 && <span className="text-[10px] text-text-muted">+{colors.length - 6}</span>}
          </div>
        )}

        {/* Editorial add button */}
        <button
          onClick={quickAdd}
          disabled={p.sold_out}
          className="mt-4 w-full border border-text/20 py-2.5 text-[10px] font-medium uppercase tracking-[0.28em] text-text transition-all duration-300 hover:bg-text hover:text-bg disabled:cursor-not-allowed disabled:opacity-40"
        >
          {p.sold_out ? t("ရောင်းပြီး", "Sold Out") : t("ခြင်းထဲ ထည့်ရန်", "Add to Bag")}
        </button>
      </div>
    </motion.article>
  )
}

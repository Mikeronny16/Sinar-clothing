import { motion } from "framer-motion"
import { Eye, MessageCircle, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { FALLBACK_IMG } from "@/lib/products"
import { messengerUrl } from "@/config"
import { useLang } from "@/lib/lang"
import { useTheme } from "@/lib/theme"
import type { Product } from "@/lib/supabase"

interface Props {
  p: Product | (typeof import("@/lib/products").FALLBACK_PRODUCTS)[number]
  index: number
  onQuickView: (p: Product) => void
  /** large = takes double column on first row */
  large?: boolean
}

function useWishlist(productId: string) {
  const [liked, setLiked] = useState(false)
  const key = `sinar_wishlist_${productId}`

  useEffect(() => {
    setLiked(localStorage.getItem(key) === "1")
  }, [key])

  function toggle(e: React.MouseEvent) {
    e.stopPropagation()
    const next = !liked
    setLiked(next)
    if (next) localStorage.setItem(key, "1")
    else localStorage.removeItem(key)
  }

  return { liked, toggle }
}

export default function ProductCard({ p, index, onQuickView, large = false }: Props) {
  const dmUrl = messengerUrl(p.name_en)
  const { t, lang } = useLang()
  const { isDark } = useTheme()
  const { liked, toggle: toggleWishlist } = useWishlist(String(p.id ?? p.name_en))

  const bgCard = isDark ? "bg-[#122B19]" : "bg-white"
  const border = isDark ? "border-[rgba(255,255,255,0.06)]" : "border-[rgba(45,90,61,0.10)]"
  const hoverBorder = "hover:border-pink/30"
  const textMain = isDark ? "text-[#F5F0E8]" : "text-[#1A2E1F]"
  const textSub = isDark ? "text-[#7A8F7D]" : "text-[#3D5A45]"

  return (
    <motion.article
      className={`group relative ${bgCard} rounded-2xl overflow-hidden border ${border} ${hoverBorder} transition-all duration-500 flex flex-col shadow-card hover:shadow-editorial`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 5) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
    >
      {/* Image container — 75% height */}
      <div className={`relative overflow-hidden bg-[#0F2415] ${large ? "aspect-[3/4] sm:aspect-[2/3]" : "aspect-[3/4]"}`}>
        <img
          src={p.image_url || FALLBACK_IMG}
          alt={p.name_en}
          loading="lazy"
          onError={(e) => {
            const el = e.currentTarget
            if (!el.dataset.fb) { el.dataset.fb = "1"; el.src = FALLBACK_IMG }
          }}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Soft vignette overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Sold out overlay */}
        {p.sold_out && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <span className="bg-pink text-white text-[10px] font-bold px-5 py-2 rounded-full uppercase tracking-[0.3em]">
              {t("ရောင်းပြီး", "SOLD OUT")}
            </span>
          </div>
        )}

        {/* Status badge — top left */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold backdrop-blur-md uppercase tracking-wider ${
            p.sold_out
              ? "bg-pink/20 border border-pink/40 text-pink"
              : p.status === "In Stock"
              ? "bg-emerald-dim border border-emerald/20 text-emerald"
              : "bg-yellow-500/20 border border-yellow-500/30 text-yellow-400"
          }`}>
            <span className="w-1 h-1 rounded-full bg-current" />
            {p.sold_out ? t("ရောင်းပြီး", "Sold Out") : p.status}
          </span>
        </div>

        {/* Top-right: Wishlist + Size chips */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          {/* Wishlist button */}
          <button
            onClick={toggleWishlist}
            className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200"
            style={{
              background: liked ? "rgba(255,31,110,0.85)" : "rgba(0,0,0,0.45)",
              border: liked ? "1px solid #FF1F6E" : "1px solid rgba(255,255,255,0.2)",
            }}
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className="w-4 h-4 transition-transform duration-200"
              style={{ color: liked ? "white" : "rgba(255,255,255,0.8)", fill: liked ? "white" : "none", transform: liked ? "scale(1.15)" : "scale(1)" }}
            />
          </button>
          {/* Size chips */}
          <div className="flex flex-wrap gap-1 justify-end max-w-[80px]">
            {p.sizes.slice(0, 3).map((s) => (
              <span
                key={s}
                className="bg-black/50 backdrop-blur text-white/90 text-[9px] font-bold w-6 h-6 rounded-full flex items-center justify-center border border-white/20"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Hover action buttons — slide up */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out flex flex-col gap-2">
          {!p.sold_out && (
            <a
              href={dmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-pink text-white py-2.5 rounded-xl text-xs font-semibold hover:shadow-pink transition-shadow"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className={lang === "mm" ? "font-mm" : ""}>{t("မှာရန်", "Order")}</span>
            </a>
          )}
          <button
            onClick={() => onQuickView(p as Product)}
            className="flex items-center justify-center gap-2 w-full bg-black/50 backdrop-blur border border-white/20 text-white py-2.5 rounded-xl text-xs font-medium hover:border-pink transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className={lang === "mm" ? "font-mm" : ""}>{t("အသေးစိတ်", "Quick View")}</span>
          </button>
        </div>
      </div>

      {/* Card info — minimal, magazine-style */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className={`font-mm font-semibold text-sm sm:text-base leading-snug truncate ${textMain}`}>
              {p.name_mm}
            </h3>
            <p className={`text-[11px] mt-0.5 truncate ${textSub}`}>{p.name_en}</p>
          </div>

          {/* Quick view icon */}
          <button
            onClick={() => onQuickView(p as Product)}
            className={`flex-shrink-0 p-1.5 rounded-full border transition-all duration-200 hover:border-pink/40 hover:text-pink ${
              isDark
                ? "border-[rgba(255,255,255,0.08)] text-[#7A8F7D]"
                : "border-[rgba(45,90,61,0.12)] text-[#3D5A45]"
            }`}
            aria-label="Quick view"
          >
            <Eye className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          {p.price > 0 ? (
            <p className="font-mm font-bold text-pink text-sm sm:text-base">
              {p.price.toLocaleString()} ကျပ်
            </p>
          ) : (
            <p className={`font-mm text-xs ${textSub}`}>{t("ဈေးနှုန်းမေးရန်", "Ask for price")}</p>
          )}

          {/* Category pill */}
          <span className={`editorial-label text-[9px] px-2 py-1 rounded-full border ${
            isDark
              ? "border-[rgba(255,255,255,0.08)] text-[#7A8F7D]"
              : "border-[rgba(45,90,61,0.12)] text-[#3D5A45]"
          }`}>
            {p.category}
          </span>
        </div>
      </div>
    </motion.article>
  )
}

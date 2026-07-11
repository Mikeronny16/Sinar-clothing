import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react"
import Shell from "@/components/Shell"
import ProductCard from "@/components/ProductCard"
import { useProducts } from "@/lib/useProducts"
import { useLang } from "@/lib/lang"
import { useCart } from "@/lib/cart"
import { useWishlist } from "@/lib/wishlist"
import { viberLink } from "@/config"
import { FALLBACK_IMG } from "@/lib/products"

export default function ProductDetail() {
  const { id } = useParams()
  const all = useProducts()
  const nav = useNavigate()
  const { t, lang } = useLang()
  const { add, setOpen } = useCart()
  const { has, toggle } = useWishlist()

  const p = all.find((x) => String(x.id ?? x.name_en) === id)
  const [size, setSize] = useState<string | undefined>(undefined)
  const [color, setColor] = useState<string | undefined>(undefined)
  const colors = Array.isArray(p?.colors) ? p!.colors! : []

  if (!p) {
    return (
      <Shell>
        <div className="mx-auto max-w-md px-5 py-24 text-center">
          <p className="font-mm text-text-muted">{t("ပစ္စည်း မတွေ့ပါ", "Product not found.")}</p>
          <Link to="/shop" className="pill mt-6">{t("ဆိုင်သို့", "Back to shop")}</Link>
        </div>
      </Shell>
    )
  }

  const pid = String(p.id ?? p.name_en)
  const liked = has(pid)
  const related = all.filter((x) => x.category === p.category && String(x.id ?? x.name_en) !== pid).slice(0, 4)

  const addToBag = () => {
    add({
      id: pid,
      name_en: p.name_en,
      name_mm: p.name_mm,
      price: p.price,
      image_url: p.image_url,
      size: size ?? p.sizes?.[0],
      color: color ?? colors[0]?.name,
    })
  }

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <button onClick={() => nav(-1)} className="mb-6 inline-flex items-center gap-2 text-sm text-text-sub hover:text-coral">
          <ArrowLeft className="h-4 w-4" /> {t("နောက်သို့", "Back")}
        </button>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Image */}
          <div className="relative overflow-hidden rounded-[28px] bg-bg-mid" style={{ aspectRatio: "3 / 4" }}>
            <img
              src={p.image_url || FALLBACK_IMG}
              alt={p.name_en}
              onError={(e) => { const el = e.currentTarget; if (!el.dataset.fb) { el.dataset.fb = "1"; el.src = FALLBACK_IMG } }}
              className="h-full w-full object-cover"
            />
            {p.sold_out && (
              <div className="absolute inset-0 flex items-center justify-center bg-plum/45">
                <span className="rounded-full bg-cream px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-plum">{t("ရောင်းပြီး", "Sold Out")}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="editorial-label text-coral">{p.category}</p>
            <h1 className={`mt-3 text-4xl sm:text-5xl ${lang === "mm" ? "font-mm" : "display uppercase"}`}>
              {lang === "mm" ? p.name_mm : p.name_en}
            </h1>
            <p className="mt-2 text-sm text-text-muted">{lang === "mm" ? p.name_en : p.name_mm}</p>

            <div className="mt-5 flex items-baseline gap-3">
              <p className="text-2xl font-bold text-coral">
                {p.price > 0 ? `${p.price.toLocaleString()} ${t("ကျပ်", "Ks")}` : t("ဈေးမေးရန်", "Ask for price")}
              </p>
              {p.original_price && p.original_price > p.price && (
                <p className="text-base text-text-muted line-through">{p.original_price.toLocaleString()} {t("ကျပ်", "Ks")}</p>
              )}
            </div>

            {colors.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-xs uppercase tracking-wide text-text-muted">
                  {t("အရောင် ရွေးပါ", "Colour")}{color ? ` — ${color}` : ""}
                </p>
                <div className="flex flex-wrap items-center gap-2.5">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      title={c.name}
                      aria-label={c.name}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${
                        color === c.name ? "border-plum scale-110" : "border-plum/20 hover:border-plum/50"
                      }`}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            <p className="mt-5 max-w-md font-mm text-sm leading-relaxed text-text-sub">
              {t(
                "ရွေးချယ်ထားသော အရည်အသွေးမြင့် ဝတ်စုံလေးတစ်ခု။ အသေးစိတ်နှင့် အရွယ်အစားအတွက် DM ကနေ မေးမြန်းနိုင်ပါတယ်။",
                "A carefully curated, quality piece. Message us on DM for more details or size help."
              )}
            </p>

            {/* Sizes */}
            {p.sizes?.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-xs uppercase tracking-wide text-text-muted">{t("အရွယ် ရွေးပါ", "Select size")}</p>
                <div className="flex flex-wrap gap-2">
                  {p.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`h-10 min-w-10 rounded-full border px-3 text-sm font-semibold transition-colors ${
                        (size ?? p.sizes[0]) === s ? "border-plum bg-plum text-cream" : "border-plum/20 text-text-sub hover:border-plum"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={addToBag} disabled={p.sold_out} className="pill flex-1 disabled:opacity-40">
                <ShoppingBag className="h-4 w-4" /> {t("စျေးခြင်းထဲ ထည့်မယ်", "Add to Bag")}
              </button>
              <button
                onClick={() => toggle(pid)}
                aria-label="Wishlist"
                className={`flex h-[52px] w-[52px] items-center justify-center rounded-full border transition-colors ${
                  liked ? "border-coral bg-coral text-cream" : "border-plum/20 text-plum hover:border-coral"
                }`}
              >
                <Heart className="h-5 w-5" fill={liked ? "currentColor" : "none"} />
              </button>
            </div>
            <button onClick={() => { addToBag(); setOpen(true) }} className="pill-outline mt-3 justify-center text-plum">
              {t("ချက်ချင်း Order တင်မယ်", "Buy now — order via bag")}
            </button>
            <a href={viberLink()} className="mt-3 text-center text-xs text-text-muted underline hover:text-coral">
              {t("ဒီ ဝတ်စုံအကြောင်း Viber မေးမယ်", "Ask about this piece on Viber")}
            </a>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="display mb-8 text-3xl uppercase sm:text-4xl">{t("ဆင်တူ ဝတ်စုံများ", "You may also like")}</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
              {related.map((r, i) => (
                <ProductCard key={String(r.id ?? r.name_en)} p={r} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Shell>
  )
}

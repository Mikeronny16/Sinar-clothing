import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { MessageCircle, Minus, Plus, Ruler } from "lucide-react"
import { toast } from "sonner"
import { useProducts } from "@/lib/useProducts"
import { useLang } from "@/lib/lang"
import { useCart } from "@/lib/cart"
import { viberLink } from "@/config"
import { AppFrame, AppHeader, SectionHead } from "@/components/app/AppShell"
import ProductTile, { AppImage, HeartButton, Price, ks } from "@/components/app/ProductTile"
import BottomSheet from "@/components/app/BottomSheet"
import SizeGuide from "@/components/SizeGuide"
import { CATS } from "@/components/app/categories"

export default function ProductDetail() {
  const { id } = useParams()
  // a fresh screen per product, so picks and scroll don't leak between pieces
  return <ProductScreen key={id} id={id} />
}

function ProductScreen({ id }: { id?: string }) {
  const all = useProducts()
  const { t, lang } = useLang()
  const mm = lang === "mm" ? "font-mm" : "font-sans"
  const { add, setOpen: openBag } = useCart()
  const [sheet, setSheet] = useState<null | "bag" | "buy">(null)
  const [size, setSize] = useState<string>()
  const [color, setColor] = useState<string>()
  const [qty, setQty] = useState(1)
  const [guide, setGuide] = useState(false)

  const p = all.find((x) => String(x.id ?? x.name_en) === id)

  if (!p) {
    return (
      <AppFrame>
        <AppHeader back title="" />
        <div className={`px-8 pt-24 text-center ${mm}`}>
          <p className="text-[14px] text-k-ink/55">{t("ပစ္စည်း မတွေ့ပါ", "Product not found")}</p>
          <Link to="/shop" className="mt-6 inline-block rounded-full bg-k-green px-6 py-3 text-[13px] font-semibold text-white">
            {t("ဆိုင်သို့", "Back to shop")}
          </Link>
        </div>
      </AppFrame>
    )
  }

  const pid = String(p.id ?? p.name_en)
  const colors = Array.isArray(p.colors) ? p.colors : []
  const sizes = p.sizes ?? []
  const pickedSize = size ?? sizes[0]
  const pickedColor = color ?? colors[0]?.name
  const cat = CATS.find((c) => c.id !== "all" && c.match(p))
  const related = all.filter((x) => x.category === p.category && String(x.id ?? x.name_en) !== pid).slice(0, 8)

  const confirm = () => {
    add({ id: pid, name_en: p.name_en, name_mm: p.name_mm, price: p.price, image_url: p.image_url, size: pickedSize, color: pickedColor }, qty)
    const buying = sheet === "buy"
    setSheet(null)
    setQty(1)
    if (buying) setTimeout(() => openBag(true), 280)
    else toast(t("အိတ်ထဲ ထည့်ပြီးပါပြီ ✓", "Added to your bag ✓"))
  }

  const chip = (on: boolean) =>
    `rounded-xl border px-4 py-2 text-[13px] font-semibold transition-colors ${on ? "border-k-green bg-k-green text-white" : "border-[#EBE3DD] bg-white text-k-ink/75"}`

  return (
    <AppFrame tabs={false}>
      <AppHeader back title={cat ? t(cat.mm, cat.en) : p.category} />

      <div className="relative">
        <AppImage src={p.image_url} alt={p.name_en} className="aspect-[4/5] w-full" />
        {p.badge && (
          <span className="absolute left-4 top-4 rounded-md bg-k-pink px-2 py-1 font-sans text-[10.5px] font-bold uppercase tracking-wider text-white">
            {p.badge}
          </span>
        )}
        {p.sold_out && (
          <div className="absolute inset-0 grid place-items-center bg-white/50">
            <span className={`rounded-full bg-k-ink px-5 py-2 text-[13px] font-semibold text-white ${mm}`}>{t("ကုန်သွားပြီ", "Sold out")}</span>
          </div>
        )}
      </div>

      <div className="px-5 pt-5">
        <h1 className={`text-[21px] font-bold leading-snug text-k-ink ${mm}`}>{t(p.name_mm, p.name_en)}</h1>
        <p className={`mt-0.5 text-[13px] text-k-ink/45 ${lang === "mm" ? "font-sans" : "font-mm"}`}>{lang === "mm" ? p.name_en : p.name_mm}</p>
        <div className="mt-3">
          <Price p={p} size="md" />
        </div>
      </div>

      <div className="mx-5 my-5 h-px bg-k-ink/[0.08]" />

      {colors.length > 0 && (
        <Row label={t("အရောင်", "Colour")} mm={mm}>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <span key={c.name} className="flex items-center gap-1.5 rounded-full border border-[#EBE3DD] bg-white py-1 pl-1 pr-3 text-[12px] text-k-ink/75">
                <span className="h-5 w-5 rounded-full border border-black/10" style={{ background: c.hex }} />
                {c.name}
              </span>
            ))}
          </div>
        </Row>
      )}

      {sizes.length > 0 && (
        <Row label="Size" mm={mm}>
          <div className="flex flex-wrap items-center gap-2">
            {sizes.map((s) => (
              <span key={s} className="rounded-xl border border-[#EBE3DD] bg-white px-3.5 py-1.5 font-sans text-[12.5px] font-semibold text-k-ink/75">
                {s}
              </span>
            ))}
            <button type="button" onClick={() => setGuide(true)} className={`ml-1 flex items-center gap-1 text-[12px] text-k-green underline underline-offset-2 ${mm}`}>
              <Ruler className="h-3.5 w-3.5" /> {t("Size ကြည့်ရန်", "Size guide")}
            </button>
          </div>
        </Row>
      )}

      <p className={`px-5 pt-1 text-[13px] leading-relaxed text-k-ink/60 ${mm}`}>
        {t(
          "ရွေးချယ်ထားသော အရည်အသွေးမြင့် ဝတ်စုံလေးတစ်ခု။ အသေးစိတ်နှင့် အရွယ်အစားအတွက် Viber ကနေ မေးမြန်းနိုင်ပါတယ်။",
          "A carefully chosen, quality piece. Ask us on Viber for details or size help.",
        )}
      </p>

      <a href={viberLink()} className="mx-5 mt-5 flex items-center gap-3 rounded-2xl bg-[#F1EEFE] px-4 py-3.5 text-[#5B49D6]">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#7360F2] text-white">
          <MessageCircle className="h-[18px] w-[18px]" />
        </span>
        <span className={`text-[13px] font-semibold ${mm}`}>{t("ဒီဝတ်စုံအကြောင်း Viber မှာ မေးမယ်", "Ask about this piece on Viber")}</span>
      </a>

      {related.length > 0 && (
        <section className="mt-9">
          <SectionHead title={t("ဆင်တူ ဝတ်စုံများ", "You may also like")} />
          <div className="no-scrollbar mt-3 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pb-1">
            {related.map((r) => (
              <div key={r.id} className="w-[148px] shrink-0 snap-start">
                <ProductTile p={r} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* buy bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-[60] mx-auto flex max-w-[480px] gap-2.5 border-t border-k-ink/[0.06] bg-white/95 px-4 pt-3 backdrop-blur-xl"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <HeartButton id={pid} big />
        {p.sold_out ? (
          <button disabled className={`h-12 flex-1 rounded-2xl bg-k-ink/10 text-[14px] font-semibold text-k-ink/40 ${mm}`}>
            {t("ကုန်သွားပြီ", "Sold out")}
          </button>
        ) : (
          <>
            <button type="button" onClick={() => setSheet("bag")} className={`h-12 flex-1 rounded-2xl border border-k-green text-[14px] font-semibold text-k-green active:scale-[0.98] ${mm}`}>
              {t("အိတ်ထဲထည့်", "Add to bag")}
            </button>
            <button type="button" onClick={() => setSheet("buy")} className={`h-12 flex-1 rounded-2xl bg-k-pink text-[14px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(232,115,154,0.7)] active:scale-[0.98] ${mm}`}>
              {t("ဝယ်မယ်", "Buy now")}
            </button>
          </>
        )}
      </div>

      {/* options sheet */}
      <BottomSheet open={!!sheet} onClose={() => setSheet(null)}>
        <div className={`overflow-y-auto px-5 pb-5 ${mm}`}>
          <div className="flex gap-3">
            <AppImage src={p.image_url} alt="" className="h-20 w-16 shrink-0 rounded-xl" />
            <div className="min-w-0 pt-1">
              <p className="truncate text-[14px] font-semibold text-k-ink">{t(p.name_mm, p.name_en)}</p>
              <Price p={p} />
            </div>
          </div>

          {colors.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-[12px] text-k-ink/50">{t("အရောင် ရွေးပါ", "Choose a colour")}</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button key={c.name} type="button" onClick={() => setColor(c.name)} className={`flex items-center gap-2 ${chip(pickedColor === c.name)}`}>
                    <span className="h-4 w-4 rounded-full border border-black/10" style={{ background: c.hex }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-[12px] text-k-ink/50">{t("Size ရွေးပါ", "Choose a size")}</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button key={s} type="button" onClick={() => setSize(s)} className={`font-sans ${chip(pickedSize === s)}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-k-chip px-4 py-3">
            <div className="flex items-center gap-3">
              <button type="button" aria-label="-" onClick={() => setQty((n) => Math.max(1, n - 1))} className="grid h-8 w-8 place-items-center rounded-full bg-white">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-5 text-center font-sans text-[15px] font-bold">{qty}</span>
              <button type="button" aria-label="+" onClick={() => setQty((n) => n + 1)} className="grid h-8 w-8 place-items-center rounded-full bg-white">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <span className="font-sans text-[17px] font-bold text-k-ink">{ks(p.price * qty)}</span>
          </div>

          <button type="button" onClick={confirm} className={`mt-4 h-12 w-full rounded-2xl text-[14.5px] font-semibold text-white active:scale-[0.99] ${sheet === "buy" ? "bg-k-pink" : "bg-k-green"}`}>
            {sheet === "buy" ? t("ဝယ်မယ် — Viber နဲ့ မှာမယ်", "Buy — order on Viber") : t("အိတ်ထဲ ထည့်မယ်", "Add to bag")}
          </button>
        </div>
      </BottomSheet>

      <SizeGuide open={guide} onClose={() => setGuide(false)} />
    </AppFrame>
  )
}

function Row({ label, mm, children }: { label: string; mm: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 px-5 pb-4">
      <p className={`w-14 shrink-0 pt-1.5 text-[12px] text-k-ink/45 ${mm}`}>{label}</p>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

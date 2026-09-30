import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingBag, X } from "lucide-react"
import { toast } from "sonner"
import { Boutique as Engine } from "@/boutique/engine"
import { useProducts } from "@/lib/useProducts"
import { useLang } from "@/lib/lang"
import { useCart } from "@/lib/cart"
import { holdOverlays } from "@/lib/overlays"
import { FALLBACK_IMG } from "@/lib/products"

const ks = (n: number) => `${n.toLocaleString("en-US")} Ks`

/**
 * /boutique — walk into Sinar. The room and every framed piece come from the same catalogue as
 * /shop; tapping a frame opens this card, which adds to the same bag and links to the same
 * product page, so ordering still happens on Viber exactly as before.
 */
export default function BoutiquePage() {
  const { t, lang } = useLang()
  const products = useProducts()
  const { add, count, setOpen } = useCart()
  const canvas = useRef<HTMLCanvasElement>(null)
  const engine = useRef<Engine | null>(null)
  const [sel, setSel] = useState<number | null>(null)
  const [size, setSize] = useState<string | undefined>()
  const [progress, setProgress] = useState<[number, number]>([0, 1])
  const [ready, setReady] = useState(false)
  const [hint, setHint] = useState(true)

  const items = useMemo(() => products.map((p) => ({
    id: p.id, img: p.image_url || FALLBACK_IMG, soldOut: !!p.sold_out, category: p.category,
  })), [products])

  // the floating stylist / toasts / install pill would sit on top of the room
  useEffect(() => {
    holdOverlays(true)
    document.documentElement.style.overflow = "hidden"
    return () => { holdOverlays(false); document.documentElement.style.overflow = "" }
  }, [])

  useEffect(() => {
    let alive = true
    // the sign is drawn in her script font: wait for it so the canvas doesn't fall back
    Promise.all([
      document.fonts.load('250px "Kaushan Script"'),
      document.fonts.load('500 38px "Noto Sans Myanmar"'),
    ]).catch(() => undefined).finally(() => {
      if (!alive || !canvas.current) return
      engine.current = new Engine(canvas.current, {
        onSelect: (i) => { setSel(i); setSize(undefined); setHint(false) },
        onProgress: (l, n) => setProgress([l, n]),
      })
      if (import.meta.env.DEV) (window as unknown as { __boutique: Engine }).__boutique = engine.current // test hook
      setReady(true)
    })
    return () => { alive = false; engine.current?.dispose(); engine.current = null }
  }, [])

  useEffect(() => { if (ready) engine.current?.setItems(items) }, [ready, items])

  useEffect(() => {
    const id = window.setTimeout(() => setHint(false), 9000)
    return () => window.clearTimeout(id)
  }, [])

  const p = sel !== null ? products[sel] : null
  const loaded = ready && progress[0] >= Math.min(progress[1], 8)
  const name = (x: { name_mm: string; name_en: string }) => (lang === "mm" ? x.name_mm || x.name_en : x.name_en || x.name_mm)

  const addToBag = () => {
    if (!p) return
    if (p.sizes?.length && !size) { toast(t("ဆိုဒ် ရွေးပေးပါ", "Pick a size first")); return }
    add({ id: p.id, name_en: p.name_en, name_mm: p.name_mm, price: p.price, image_url: p.image_url, size })
    toast(t("ခြင်းထဲ ထည့်ပြီးပါပြီ", "Added to your bag"))
  }

  return (
    <div className="fixed inset-0 z-[65] bg-[#1b2a20] text-[#F3EEE4]">
      <canvas ref={canvas} className="block h-full w-full cursor-grab active:cursor-grabbing" />

      {/* top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4" style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}>
        <Link to="/" className="pointer-events-auto flex items-center gap-2 rounded-full bg-[#1A1611]/70 px-4 py-2 text-sm backdrop-blur">
          <ArrowLeft size={16} /> {t("ပြန်မယ်", "Back")}
        </Link>
        <div className="text-center">
          <p className="font-script text-3xl leading-none text-[#ffd9e0] drop-shadow">Sinar</p>
          <p className={`mt-1 text-[11px] tracking-[0.2em] opacity-80 ${lang === "mm" ? "font-mm tracking-normal" : ""}`}>{t("3D ဆိုင်ခန်း", "3D BOUTIQUE")}</p>
        </div>
        <button onClick={() => setOpen(true)} className="pointer-events-auto relative flex items-center gap-2 rounded-full bg-[#1A1611]/70 px-4 py-2 text-sm backdrop-blur" aria-label={t("စျေးခြင်း", "Bag")}>
          <ShoppingBag size={16} />
          {count > 0 && <span className="rounded-full bg-[#e79aa8] px-1.5 text-xs font-semibold text-[#2A0E17]">{count}</span>}
        </button>
      </div>

      {/* how to move */}
      {hint && loaded && !p && (
        <div className={`pointer-events-none absolute inset-x-4 bottom-8 mx-auto max-w-md rounded-2xl bg-[#1A1611]/75 px-5 py-3 text-center text-sm backdrop-blur ${lang === "mm" ? "font-mm" : ""}`}>
          {t("ဆွဲပြီး လှည့်ကြည့်ပါ · ကြမ်းပြင်ကို နှိပ်ရင် လျှောက်သွားမယ် · အဝတ်ပုံကို နှိပ်ရင် ကြည့်မယ်",
            "Drag to look around · tap the floor to walk · tap a piece to see it")}
          <span className="mt-1 hidden text-xs opacity-70 md:block">{t("Computer: W A S D နဲ့ လမ်းလျှောက်", "On a computer: W A S D to walk")}</span>
        </div>
      )}

      {/* browse without walking */}
      {loaded && !p && (
        <button onClick={() => engine.current?.step(1)} className={`absolute bottom-24 right-4 rounded-full bg-[#e79aa8] px-5 py-2.5 text-sm font-semibold text-[#2A0E17] shadow-lg ${lang === "mm" ? "font-mm" : ""}`}>
          {t("တစ်ခုချင်း ကြည့်မယ်", "Browse one by one")} →
        </button>
      )}

      {/* product card */}
      {p && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center p-3" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
          <div className="w-full max-w-md rounded-3xl bg-[#F3EEE4] p-5 text-[#1A1611] shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#C28773]">{p.category}{p.badge ? ` · ${p.badge}` : ""}</p>
                <h2 className={`mt-1 text-xl leading-snug ${lang === "mm" ? "font-mm font-semibold" : "display"}`}>{name(p)}</h2>
                <p className="mt-1 text-lg font-semibold">
                  {ks(p.price)}
                  {p.original_price && p.original_price > p.price && <span className="ml-2 text-sm font-normal text-[#8a7f72] line-through">{ks(p.original_price)}</span>}
                </p>
              </div>
              <button onClick={() => engine.current?.select(null)} className="rounded-full p-1.5 hover:bg-black/5" aria-label={t("ပိတ်မယ်", "Close")}><X size={20} /></button>
            </div>
            {p.sold_out ? (
              <p className={`mt-3 rounded-xl bg-[#1A1611] px-3 py-2 text-center text-sm text-[#F3EEE4] ${lang === "mm" ? "font-mm" : ""}`}>{t("ကုန်သွားပါပြီ", "Sold out")}</p>
            ) : p.sizes?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {p.sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)} className={`min-w-10 rounded-full border px-3 py-1.5 text-sm ${size === s ? "border-[#1A1611] bg-[#1A1611] text-[#F3EEE4]" : "border-[#1A1611]/25"}`}>{s}</button>
                ))}
              </div>
            ) : null}
            <div className="mt-4 flex items-center gap-2">
              <button onClick={() => engine.current?.step(-1)} className="rounded-full border border-[#1A1611]/20 p-2.5" aria-label={t("ရှေ့တစ်ခု", "Previous")}><ChevronLeft size={18} /></button>
              {!p.sold_out && (
                <button onClick={addToBag} className={`flex-1 whitespace-nowrap rounded-full bg-[#1A1611] px-3 py-2.5 text-sm font-semibold text-[#F3EEE4] ${lang === "mm" ? "font-mm" : ""}`}>{t("ခြင်းထဲထည့်", "Add to bag")}</button>
              )}
              <Link to={`/product/${p.id}`} className={`flex-1 rounded-full border border-[#1A1611] px-4 py-2.5 text-center text-sm ${lang === "mm" ? "font-mm" : ""}`}>{t("အသေးစိတ်", "Details")}</Link>
              <button onClick={() => engine.current?.step(1)} className="rounded-full border border-[#1A1611]/20 p-2.5" aria-label={t("နောက်တစ်ခု", "Next")}><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      )}

      {/* doors opening */}
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1b2a20]">
          <p className="font-script text-6xl text-[#ffd9e0]">Sinar</p>
          <p className={`mt-3 text-sm opacity-80 ${lang === "mm" ? "font-mm" : ""}`}>{t("ဆိုင်တံခါး ဖွင့်နေပါတယ်…", "Opening the shop…")}</p>
          <div className="mt-5 h-0.5 w-48 overflow-hidden rounded bg-white/15">
            <div className="h-full bg-[#e79aa8] transition-all" style={{ width: `${Math.round((progress[0] / Math.max(1, Math.min(progress[1], 8))) * 100)}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}

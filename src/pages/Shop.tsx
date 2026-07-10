import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import Shell from "@/components/Shell"
import ProductCard from "@/components/ProductCard"
import { useProducts } from "@/lib/useProducts"
import { useLang } from "@/lib/lang"

type Sort = "default" | "price_asc" | "price_desc"

const CATS: { key: string; mm: string; en: string }[] = [
  { key: "All", mm: "အားလုံး", en: "All" },
  { key: "Tops", mm: "ရှပ်အကျီ", en: "Tops" },
  { key: "Cardigans", mm: "ကာဒီဂင်", en: "Cardigans" },
  { key: "Dresses", mm: "ဝတ်စုံ", en: "Dresses" },
  { key: "Jeans", mm: "ဂျင်း", en: "Jeans" },
  { key: "Sweaters", mm: "ဆွယ်တာ", en: "Sweaters" },
]

export default function Shop() {
  const all = useProducts()
  const { t, lang } = useLang()
  const [cat, setCat] = useState("All")
  const [size, setSize] = useState<string | null>(null)
  const [sort, setSort] = useState<Sort>("default")
  const [search, setSearch] = useState("")

  const sizes = useMemo(() => Array.from(new Set(all.flatMap((p) => p.sizes || []))).slice(0, 10), [all])

  const items = useMemo(() => {
    let r = cat === "All" ? all : all.filter((p) => p.category === cat)
    if (size) r = r.filter((p) => p.sizes?.includes(size))
    if (search.trim()) {
      const q = search.toLowerCase()
      r = r.filter((p) => p.name_en.toLowerCase().includes(q) || p.name_mm.includes(q))
    }
    if (sort === "price_asc") r = [...r].sort((a, b) => a.price - b.price)
    if (sort === "price_desc") r = [...r].sort((a, b) => b.price - a.price)
    return r
  }, [all, cat, size, sort, search])

  return (
    <Shell>
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="editorial-label text-coral">{t("ဆိုင်", "SHOP")}</p>
        <h1 className="display mt-3 text-5xl uppercase sm:text-7xl">
          {t("ဝတ်စုံ", "The")} <span className="text-coral">{t("အားလုံး", "Collection")}</span>
        </h1>
        <p className="mt-3 max-w-md font-mm text-sm text-text-sub">
          {t("ရွေးချယ်ထားသော ဝတ်စုံလေးများ အားလုံး", "Every curated piece, all in one place.")}
        </p>

        {/* Search */}
        <div className="relative mt-8 max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("ရှာဖွေရန်...", "Search products...")}
            className="w-full rounded-full border border-plum/15 bg-bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-coral"
          />
        </div>

        {/* Category chips */}
        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
          {CATS.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                cat === c.key ? "border-coral bg-coral text-cream" : "border-plum/15 text-text-sub hover:border-coral"
              }`}
            >
              {t(c.mm, c.en)}
            </button>
          ))}
        </div>

        {/* Size + sort row */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-wide text-text-muted">{t("အရွယ်", "Size")}:</span>
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(size === s ? null : s)}
              className={`h-8 min-w-8 rounded-full border px-2 text-xs font-semibold transition-colors ${
                size === s ? "border-plum bg-plum text-cream" : "border-plum/15 text-text-sub hover:border-plum"
              }`}
            >
              {s}
            </button>
          ))}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="ml-auto rounded-full border border-plum/15 bg-bg-card px-4 py-2 text-xs outline-none"
          >
            <option value="default">{t("မူလ", "Featured")}</option>
            <option value="price_asc">{t("ဈေး: နိမ့်→မြင့်", "Price: Low → High")}</option>
            <option value="price_desc">{t("ဈေး: မြင့်→နိမ့်", "Price: High → Low")}</option>
          </select>
        </div>

        {/* Grid */}
        {items.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p, i) => (
              <ProductCard key={String(p.id ?? p.name_en)} p={p} index={i} />
            ))}
          </div>
        ) : (
          <p className="mt-20 text-center font-mm text-sm text-text-muted">
            {t("ပစ္စည်း မတွေ့ပါ", "No products match your filters.")}
          </p>
        )}
        <p className={`mt-8 text-xs text-text-muted ${lang === "mm" ? "font-mm" : ""}`}>
          {items.length} {t("ခု", "items")}
        </p>
      </section>
    </Shell>
  )
}

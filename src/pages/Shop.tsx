import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { ChevronDown } from "lucide-react"
import { useProducts } from "@/lib/useProducts"
import { useLang } from "@/lib/lang"
import { AppFrame, AppHeader } from "@/components/app/AppShell"
import { CategoryChips, SearchBar, matchesSearch } from "@/components/app/Filters"
import { ProductGrid } from "@/components/app/ProductTile"
import { CATS, type CatId } from "@/components/app/categories"

type Sort = "new" | "price_asc" | "price_desc"

const SORTS: { id: Sort; mm: string; en: string }[] = [
  { id: "new", mm: "အသစ်ဆုံး", en: "Newest" },
  { id: "price_asc", mm: "ဈေးနည်း → များ", en: "Price: low → high" },
  { id: "price_desc", mm: "ဈေးများ → နည်း", en: "Price: high → low" },
]

export default function Shop() {
  const all = useProducts()
  const { t, lang } = useLang()
  const mm = lang === "mm" ? "font-mm" : "font-sans"
  const [params] = useSearchParams()
  const initial = CATS.some((c) => c.id === params.get("cat")) ? (params.get("cat") as CatId) : "all"
  const [cat, setCat] = useState<CatId>(initial)
  const [size, setSize] = useState("")
  const [sort, setSort] = useState<Sort>("new")
  const [q, setQ] = useState("")

  const sizes = useMemo(() => Array.from(new Set(all.flatMap((p) => p.sizes || []))).slice(0, 10), [all])

  const items = useMemo(() => {
    const match = CATS.find((c) => c.id === cat)!.match
    const r = all.filter((p) => match(p) && matchesSearch(p, q) && (!size || p.sizes?.includes(size)))
    if (sort === "price_asc") return [...r].sort((a, b) => a.price - b.price)
    if (sort === "price_desc") return [...r].sort((a, b) => b.price - a.price)
    return [...r].sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""))
  }, [all, cat, size, sort, q])

  return (
    <AppFrame>
      <AppHeader title={t("အမျိုးအစား", "Category")} />
      <SearchBar value={q} onChange={setQ} />
      <CategoryChips value={cat} onChange={setCat} />

      <div className={`flex items-center justify-between px-5 pb-3 text-[12px] ${mm}`}>
        <span className="text-k-ink/45">
          {items.length} {t("ထည်", "pieces")}
        </span>
        <div className="flex gap-2">
          <Picker value={size} onChange={setSize} label={t("Size", "Size")}>
            <option value="">{t("Size အားလုံး", "All sizes")}</option>
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Picker>
          <Picker value={sort} onChange={(v) => setSort(v as Sort)} label={t("စီရန်", "Sort")}>
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {t(s.mm, s.en)}
              </option>
            ))}
          </Picker>
        </div>
      </div>

      <ProductGrid items={items} />
    </AppFrame>
  )
}

/** A native select dressed as a pill — on a phone it opens the system picker, which is the app feel for free. */
function Picker({ value, onChange, label, children }: { value: string; onChange: (v: string) => void; label: string; children: React.ReactNode }) {
  const on = value !== "" && value !== "new"
  return (
    <label className={`relative flex items-center rounded-full border py-1.5 pl-3 pr-7 ${on ? "border-k-green bg-k-green text-white" : "border-[#EBE3DD] bg-white text-k-ink/75"}`}>
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none bg-transparent outline-none [&>option]:text-k-ink">
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5" />
    </label>
  )
}

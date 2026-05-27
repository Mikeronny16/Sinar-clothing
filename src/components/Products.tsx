import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { supabase, isConfigured, type Product } from "@/lib/supabase"
import { FALLBACK_PRODUCTS, type Category } from "@/lib/products"
import ProductCard from "./ProductCard"
import QuickViewModal from "./QuickViewModal"
import OrderInstructions from "./OrderInstructions"
import SizeGuide from "./SizeGuide"
import { HelpCircle, Ruler, Search, X } from "lucide-react"
import { useLang } from "@/lib/lang"
import { useTheme } from "@/lib/theme"

type Filter = "All" | Category
type SortOption = "default" | "price_asc" | "price_desc" | "newest"

const FILTERS: { key: Filter; mm: string; en: string }[] = [
  { key: "All", mm: "အားလုံး", en: "All" },
  { key: "Tops", mm: "ရှပ်အကျီ", en: "Tops" },
  { key: "Cardigans", mm: "ကာဒီဂင်", en: "Cardigans" },
  { key: "Dresses", mm: "ဝတ်စုံ", en: "Dresses" },
  { key: "Jeans", mm: "ဂျင်းဘောင်းဘီ", en: "Jeans" },
  { key: "Sweaters", mm: "ဆွယ်တာ", en: "Sweaters" },
]

export default function Products() {
  const [filter, setFilter] = useState<Filter>("All")
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [showInstructions, setShowInstructions] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("default")
  const { t, lang } = useLang()
  const { isDark } = useTheme()

  const { data: live } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
      if (error) throw error
      return data as Product[]
    },
    enabled: isConfigured,
  })

  const all = live && live.length > 0 ? live : (FALLBACK_PRODUCTS as unknown as Product[])
  const items = useMemo(() => {
    let result = filter === "All" ? all : all.filter((p) => p.category === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p => p.name_en.toLowerCase().includes(q) || p.name_mm.includes(q))
    }
    if (sortBy === "price_asc") result = [...result].sort((a, b) => a.price - b.price)
    else if (sortBy === "price_desc") result = [...result].sort((a, b) => b.price - a.price)
    else if (sortBy === "newest") result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return result
  }, [filter, all, search, sortBy])

  const bgSection = isDark ? "bg-[#0A1A0F]" : "bg-[#FAF7F2]"
  const textMain = isDark ? "text-[#F5F0E8]" : "text-[#1A2E1F]"
  const textMuted = isDark ? "text-[#7A8F7D]" : "text-[#3D5A45]"
  const filterBg = isDark ? "bg-[#0F2415] border-[rgba(255,255,255,0.06)]" : "bg-white border-[rgba(45,90,61,0.10)]"
  const filterBtn = isDark ? "text-[#7A8F7D] hover:text-[#F5F0E8]" : "text-[#3D5A45] hover:text-[#1A2E1F]"

  return (
    <section id="shop" className={`py-24 lg:py-36 ${bgSection} grain-texture`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Editorial header — left-aligned on desktop */}
        <div className="mb-14 lg:flex lg:items-end lg:justify-between lg:gap-8">
          <div>
            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="w-8 h-px bg-pink" />
              <span className="editorial-label text-pink">
                {t("ကျွန်မတို့ရဲ့", "OUR")} COLLECTION
              </span>
            </motion.div>

            <motion.h2
              className={`font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight ${textMain}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              {t("ဝတ်စုံ", "The")}{" "}
              <span className="italic text-pink">{t("လှပသော", "Beautiful")}</span>
              <br className="hidden sm:block" />
              {t("ရွေးချယ်မှုများ", "Selection")}
            </motion.h2>

            <motion.p
              className={`font-mm text-sm mt-3 max-w-sm ${textMuted}`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t(
                "ရွေးချယ်ထားသော ချစ်စရာ ဝတ်စုံလေးများ",
                "Carefully curated pieces for every occasion"
              )}
            </motion.p>
          </div>

          {/* Right: helper buttons */}
          <motion.div
            className="flex items-center gap-3 mt-6 lg:mt-0 flex-shrink-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
          >
            <button
              onClick={() => setShowSizeGuide(true)}
              className={`inline-flex items-center gap-2 text-xs border px-4 py-2 rounded-full transition-colors hover:border-pink/40 hover:text-pink ${
                isDark
                  ? "border-[rgba(255,255,255,0.10)] text-[#7A8F7D]"
                  : "border-[rgba(45,90,61,0.15)] text-[#3D5A45]"
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span className={lang === "mm" ? "font-mm" : ""}>{t("အရွယ်အစားဇယား", "Size Guide")}</span>
            </button>
            <button
              onClick={() => setShowInstructions(true)}
              className={`inline-flex items-center gap-2 text-xs border px-4 py-2 rounded-full transition-colors hover:border-pink/40 hover:text-pink ${
                isDark
                  ? "border-[rgba(255,255,255,0.10)] text-[#7A8F7D]"
                  : "border-[rgba(45,90,61,0.15)] text-[#3D5A45]"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className={lang === "mm" ? "font-mm" : ""}>{t("မှာနည်း", "How to Order")}</span>
            </button>
          </motion.div>
        </div>

        {/* Search + Sort bar */}
        <motion.div
          className="mb-6 flex gap-3 flex-wrap items-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Search input */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: isDark ? "#7A8F7D" : "#3D5A45" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("ရှာဖွေရန်...", "Search products...")}
              className={`w-full pl-9 pr-8 py-2.5 rounded-full text-sm outline-none border transition-colors font-mm ${
                isDark
                  ? "bg-[#0F2415] border-[rgba(255,255,255,0.08)] text-[#F5F0E8] placeholder:text-[#7A8F7D] focus:border-pink/40"
                  : "bg-white border-[rgba(45,90,61,0.12)] text-[#1A2E1F] placeholder:text-[#3D5A45] focus:border-pink/40"
              }`}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5" style={{ color: isDark ? "#7A8F7D" : "#3D5A45" }} />
              </button>
            )}
          </div>

          {/* Sort select */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            className={`px-4 py-2.5 rounded-full text-xs border outline-none cursor-pointer transition-colors ${
              isDark
                ? "bg-[#0F2415] border-[rgba(255,255,255,0.08)] text-[#F5F0E8]"
                : "bg-white border-[rgba(45,90,61,0.12)] text-[#1A2E1F]"
            }`}
          >
            <option value="default">{t("မူလစဉ်", "Default")}</option>
            <option value="newest">{t("အသစ်ဆုံး", "Newest")}</option>
            <option value="price_asc">{t("ဈေးသက်သာ", "Price: Low → High")}</option>
            <option value="price_desc">{t("ဈေးကြီး", "Price: High → Low")}</option>
          </select>

          {/* Count */}
          <span className={`text-xs ${isDark ? "text-[#7A8F7D]" : "text-[#3D5A45]"}`}>
            {items.length} {t("ခု", "items")}
          </span>
        </motion.div>

        {/* Filter tabs — horizontal scroll on mobile */}
        <motion.div
          className="mb-10 -mx-5 px-5 overflow-x-auto no-scrollbar"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={`inline-flex gap-1.5 border rounded-full p-1.5 ${filterBg}`}>
            {FILTERS.map((f) => {
              const active = filter === f.key
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`relative whitespace-nowrap px-4 sm:px-5 py-2 rounded-full text-xs transition-all duration-300 font-medium ${
                    active ? "text-white" : filterBtn
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 bg-pink rounded-full"
                      transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    />
                  )}
                  <span className={`relative z-10 font-mm`}>{f.mm}</span>
                  <span className="relative z-10 ml-1.5 text-[9px] opacity-60">{f.en}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Editorial masonry-ish grid */}
        {items.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {items.map((p, i) => (
              <ProductCard
                key={p.id}
                p={p}
                index={i}
                onQuickView={setQuickViewProduct}
                large={i === 0}
              />
            ))}
          </div>
        ) : (
          <motion.div
            className={`text-center py-24 text-sm font-mm ${textMuted}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {search
              ? t(`"${search}" အတွက် ပစ္စည်းမတွေ့ပါ`, `No results for "${search}"`)
              : t("ဤ category တွင် ပစ္စည်းမရှိသေးပါ", "No items in this category yet")}
            {search && (
              <button onClick={() => setSearch("")} className="block mx-auto mt-3 text-pink text-xs underline">
                {t("ရှာဖွေမှု ဖယ်ရှားရန်", "Clear search")}
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      <OrderInstructions open={showInstructions} onClose={() => setShowInstructions(false)} />
      <SizeGuide open={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </section>
  )
}

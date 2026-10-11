import { motion } from "framer-motion"
import { Search, X } from "lucide-react"
import { useLang } from "@/lib/lang"
import { CATS, type CatId } from "./categories"

export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { t, lang } = useLang()
  return (
    <label className="mx-5 mt-1 flex h-11 items-center gap-2 rounded-2xl bg-k-chip px-4 text-k-ink/45">
      <Search className="h-[18px] w-[18px] shrink-0" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("ဘာရှာမလဲ… ဇာ၊ jeans၊ knit", "Search… lace, jeans, knit")}
        className={`w-full bg-transparent text-[13.5px] text-k-ink outline-none placeholder:text-k-ink/40 ${lang === "mm" ? "font-mm" : "font-sans"}`}
      />
      {value && (
        <button type="button" onClick={() => onChange("")} aria-label="Clear">
          <X className="h-4 w-4" />
        </button>
      )}
    </label>
  )
}

/** Category chips, pinned under the 56px header. `id` keeps two chip rows from sharing a pill. */
export function CategoryChips({ value, onChange, id = "chip" }: { value: CatId; onChange: (c: CatId) => void; id?: string }) {
  const { t, lang } = useLang()
  return (
    <div className="sticky top-14 z-30 bg-k-cream/95 py-3 backdrop-blur-xl">
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5">
        {CATS.map((c) => {
          const on = c.id === value
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onChange(c.id)}
              className={`relative shrink-0 rounded-full border px-4 py-2 text-[12.5px] transition-colors ${lang === "mm" ? "font-mm" : "font-sans"} ${
                on ? "border-k-green text-white" : "border-[#EBE3DD] bg-white text-k-ink/75"
              }`}
            >
              {on && (
                <motion.span
                  layoutId={id}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-full bg-k-green"
                />
              )}
              <span className="relative">{t(c.mm, c.en)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function matchesSearch(p: { name_en: string; name_mm: string }, q: string) {
  const needle = q.trim()
  return !needle || p.name_en.toLowerCase().includes(needle.toLowerCase()) || p.name_mm.includes(needle)
}

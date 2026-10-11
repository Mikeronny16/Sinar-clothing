import { useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useProducts } from "@/lib/useProducts"
import { useLang } from "@/lib/lang"
import { viberLink } from "@/config"
import Banner from "@/components/app/Banner"
import { AppFrame, AppHeader, SectionHead } from "@/components/app/AppShell"
import { AppImage, HeartButton, Price, ProductGrid } from "@/components/app/ProductTile"
import { CATS, type CatId } from "@/components/app/categories"
import { CategoryChips, SearchBar, matchesSearch } from "@/components/app/Filters"

/**
 * The front door is a Korean-style shopping app: search, category chips, a campaign
 * banner, this week's picks and the newest pieces, with a tab bar under your thumb.
 * On a desktop it stays a phone-width column. The film homepage lives at /story.
 */
export default function Home() {
  const { t, lang } = useLang()
  const products = useProducts()
  const [cat, setCat] = useState<CatId>("all")
  const [q, setQ] = useState("")
  const newRef = useRef<HTMLElement>(null)
  const mm = lang === "mm" ? "font-mm" : "font-sans"

  const shown = useMemo(() => {
    const match = CATS.find((c) => c.id === cat)!.match
    return products.filter((p) => match(p) && matchesSearch(p, q))
  }, [products, cat, q])

  const picks = useMemo(
    () => shown.filter((p) => !p.sold_out).sort((a, b) => Number(!!b.badge) - Number(!!a.badge)).slice(0, 10),
    [shown],
  )
  const newest = useMemo(
    () => [...shown].sort((a, b) => (b.created_at || "").localeCompare(a.created_at || "")),
    [shown],
  )

  const pickCat = (c: CatId) => {
    setCat(c)
    requestAnimationFrame(() => {
      const top = (newRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 120
      window.scrollTo({ top, behavior: "smooth" })
    })
  }

  return (
    <AppFrame>
        <AppHeader logo />

        <SearchBar value={q} onChange={setQ} />
        <CategoryChips value={cat} onChange={setCat} />

        <Banner onPick={pickCat} />

        {/* this week's picks */}
        {picks.length > 0 && (
          <section className="mt-8">
            <SectionHead
              title={
                <>
                  {t("ဒီအပတ် ", "This week's ")}
                  <i className="font-['Playfair_Display'] text-k-pink">Top</i> {t("Picks", "picks")}
                </>
              }
              more={t("အားလုံး →", "See all →")}
            />
            <div className="no-scrollbar mt-3 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pb-1">
              {picks.map((p, n) => (
                <Link key={p.id} to={`/product/${p.id}`} className="w-[132px] shrink-0 snap-start">
                  <div className="relative">
                    <AppImage src={p.image_url} alt={p.name_en} className="h-[165px] rounded-2xl" />
                    <span className="absolute left-2.5 top-1 font-['Playfair_Display'] text-[34px] font-bold italic text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.45)]">
                      {n + 1}
                    </span>
                    <HeartButton id={p.id} className="absolute bottom-2 right-2 h-7 w-7" />
                  </div>
                  <p className={`mt-2 truncate text-[12px] text-k-ink/80 ${mm}`}>{t(p.name_mm, p.name_en)}</p>
                  <Price p={p} />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* newest */}
        <section ref={newRef} className="mt-8 scroll-mt-32">
          <SectionHead
            title={
              <>
                {t("အသစ် ", "Just ")}
                <i className="font-['Playfair_Display'] text-k-pink">New</i>
              </>
            }
            more={`${newest.length} ${t("ထည်", "pieces")}`}
          />
          <div className="mt-3">
            <ProductGrid items={newest} />
          </div>
        </section>

        {/* more of the shop */}
        <section className="mt-10 grid grid-cols-2 gap-3 px-5">
          <SpecialCard to="/boutique" img="/story/plate-01-rack.jpg" kicker="3D" label={t("ဆိုင်ထဲ ဝင်ကြည့်", "Walk into the shop")} mm={mm} />
          <SpecialCard to="/story" img="/story/cover.jpg" kicker="FILM" label={t("Sinar ဇာတ်လမ်း", "The Sinar story")} mm={mm} />
        </section>

        <footer className={`mt-10 px-5 text-center text-[11.5px] leading-relaxed text-k-ink/45 ${mm}`}>
          <p>
            Sinar Clothing · {t("မြစ်ကြီးနား", "Myitkyina")} ·{" "}
            <Link to="/about" className="underline-offset-2 hover:underline">
              {t("ဆိုင်အကြောင်း", "About")}
            </Link>
          </p>
          <a href={viberLink()} className="font-semibold text-k-green underline-offset-2 hover:underline">
            {t("Viber ဖြင့် မှာယူရန်", "Order on Viber")}
          </a>
          <p className="mt-1 font-sans text-[10.5px]">Site by Mike Ronny</p>
        </footer>

    </AppFrame>
  )
}

function SpecialCard({ to, img, kicker, label, mm }: { to: string; img: string; kicker: string; label: string; mm: string }) {
  return (
    <Link to={to} className="relative block h-[110px] overflow-hidden rounded-2xl bg-k-green">
      <img src={img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#12281b]/90 to-transparent" />
      <div className="absolute bottom-3 left-3 text-white">
        <p className="font-sans text-[9.5px] font-bold tracking-[0.22em] text-k-blush">{kicker}</p>
        <p className={`text-[13px] font-semibold ${mm}`}>{label}</p>
      </div>
    </Link>
  )
}

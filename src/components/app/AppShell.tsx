import { useEffect, useState, type ReactNode } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronLeft, ShoppingBag, Sparkles } from "lucide-react"
import { holdOverlays } from "@/lib/overlays"
import { useLang } from "@/lib/lang"
import { useCart } from "@/lib/cart"
import { openStylist } from "@/components/AiStylistBot"
import TabBar from "./TabBar"

export function useScrolled(px = 8) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > px)
    on()
    window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [px])
  return scrolled
}

/**
 * Every app screen sits in one phone-width column (centred on a desktop). The app
 * owns the screen, so the floating launcher / install pill / popups are held back.
 */
export function AppFrame({ children, tabs = true }: { children: ReactNode; tabs?: boolean }) {
  useEffect(() => {
    holdOverlays(true)
    return () => holdOverlays(false)
  }, [])
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-[#EDE6E1]">
      <div className="relative mx-auto min-h-screen max-w-[480px] bg-k-cream pb-28 md:shadow-[0_0_60px_rgba(31,61,43,0.12)]">
        {children}
        {tabs && <TabBar />}
      </div>
    </div>
  )
}

export function AppHeader({ title, back = false, logo = false }: { title?: string; back?: boolean; logo?: boolean }) {
  const { t, lang, toggle } = useLang()
  const { count, setOpen } = useCart()
  const nav = useNavigate()
  const scrolled = useScrolled()

  return (
    <header
      className={`sticky top-0 z-40 flex h-14 items-center justify-between px-5 transition-all duration-300 ${
        scrolled ? "bg-k-cream/90 shadow-[0_1px_0_rgba(31,61,43,0.08)] backdrop-blur-xl" : "bg-k-cream"
      }`}
    >
      <div className="flex min-w-0 items-center">
        {back && (
          <button
            type="button"
            aria-label={t("နောက်သို့", "Back")}
            onClick={() => (window.history.length > 1 ? nav(-1) : nav("/"))}
            className="-ml-2 mr-1 grid h-9 w-9 place-items-center rounded-full text-k-green active:bg-k-chip"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2} />
          </button>
        )}
        {logo ? (
          <Link to="/" className="font-['Playfair_Display'] text-[28px] font-bold italic leading-none text-k-green">
            Sinar<span className="not-italic text-k-pink">.</span>
          </Link>
        ) : (
          <h1 className={`truncate text-[17px] font-bold text-k-ink ${lang === "mm" ? "font-mm" : "font-sans"}`}>{title}</h1>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5 text-k-green">
        <button
          type="button"
          onClick={toggle}
          className="mr-1 rounded-full border border-k-green/15 px-2.5 py-1 font-mm text-[11px] font-semibold"
        >
          {lang === "mm" ? "EN" : "မြန်မာ"}
        </button>
        <button type="button" onClick={openStylist} aria-label="AI Stylist" className="grid h-9 w-9 place-items-center rounded-full active:bg-k-chip">
          <Sparkles className="h-[21px] w-[21px] text-k-pink" strokeWidth={1.9} />
        </button>
        <button type="button" onClick={() => setOpen(true)} aria-label={t("အိတ်", "Bag")} className="relative grid h-9 w-9 place-items-center rounded-full active:bg-k-chip">
          <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.9} />
          {count > 0 && (
            <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-k-pink px-1 font-sans text-[9.5px] font-bold text-white">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}

export function SectionHead({ title, more, to = "/shop" }: { title: ReactNode; more?: string; to?: string }) {
  const { lang } = useLang()
  const mm = lang === "mm" ? "font-mm" : "font-sans"
  return (
    <div className="flex items-baseline justify-between px-5">
      <h2 className={`text-[17px] font-bold text-k-ink ${mm}`}>{title}</h2>
      {more && (
        <Link to={to} className={`text-[12px] text-k-ink/45 ${mm}`}>
          {more}
        </Link>
      )}
    </div>
  )
}

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useLang } from "@/lib/lang"
import { viberLink } from "@/config"

/**
 * Acts write document.documentElement.dataset.tone as they scroll past, so the
 * fixed chrome never goes invisible against the scene sitting under it.
 */
export default function Chrome() {
  const { t, lang, toggle } = useLang()
  const [dark, setDark] = useState(true)

  useEffect(() => {
    let raf = 0
    const tick = () => {
      setDark(document.documentElement.dataset.tone !== "light")
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      delete document.documentElement.dataset.tone
    }
  }, [])

  return (
    <header
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        dark ? "text-[#FCF5F3]" : "text-[color:var(--st-ink)]"
      }`}
    >
      <div className="flex items-start justify-between px-5 pt-5 md:px-10 md:pt-8">
        <Link to="/" className="pointer-events-auto flex items-baseline gap-3">
          <span className="display text-[21px] leading-none tracking-tight">Sinar</span>
          <span className="film-micro hidden opacity-60 md:inline">Clothing</span>
        </Link>

        <div className="pointer-events-auto flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={toggle}
            className="film-micro rounded-full border border-current px-3 py-2 opacity-70 transition-opacity hover:opacity-100"
          >
            {lang === "mm" ? "EN" : "မြန်မာ"}
          </button>
          <a
            href={viberLink()}
            className="film-micro hidden rounded-full border border-current px-4 py-2 opacity-80 transition-opacity hover:opacity-100 sm:inline-block"
          >
            Viber
          </a>
          <Link
            to="/shop"
            className="film-micro rounded-full border border-current bg-current px-4 py-2 transition-opacity hover:opacity-80"
          >
            <span className={dark ? "text-[color:var(--st-ink)]" : "text-[#FCF5F3]"}>
              {t("ဆိုင်", "The shop")}
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}

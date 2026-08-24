import { useCallback, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useLang } from "@/lib/lang"
import { dsize, range, useStage } from "@/lib/stage"
import { viberLink } from "@/config"
import { holdOverlays } from "@/lib/overlays"

/** The last frame: the season laid out, and the only thing left to do. */
export default function Closer() {
  const { t, lang } = useLang()
  const stage = useRef<HTMLElement>(null)
  const art = useRef<HTMLDivElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const [missing, setMissing] = useState(false)

  const onFrame = useCallback((p: number) => {
    document.documentElement.dataset.tone = "dark"
    // the film is over here — the floating chrome comes back
    holdOverlays(p < 0.12)
    const phone = window.innerWidth < 768
    if (art.current) {
      art.current.style.transform = phone
        ? "none"
        : `translate3d(0, ${(p * -5).toFixed(2)}%, 0) scale(${(1.1 - p * 0.06).toFixed(3)})`
    }
    if (img.current) {
      if (phone) {
        // the last plate drifts too, ending centred on the closing line
        const overflow = Math.max(0, img.current.offsetWidth - window.innerWidth)
        const e = 1 - Math.pow(1 - range(p, 0, 1), 2)
        const x = -overflow * (0.12 + e * 0.76)
        img.current.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`
      } else if (img.current.style.transform) {
        img.current.style.transform = ""
      }
    }
    if (copy.current) {
      copy.current.style.opacity = String(range(p, 0.1, 0.4))
      copy.current.style.transform = `translate3d(0, ${((1 - range(p, 0.1, 0.45)) * 40).toFixed(1)}px, 0)`
    }
  }, [])

  useStage(stage, onFrame)

  return (
    <section ref={stage} className="relative h-[190vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[color:var(--st-ink)]">
        <div
          ref={art}
          className="absolute inset-0 will-change-transform"
        >
          {!missing ? (
            <img
              src="/story/plate-07-flatlay.jpg"
              alt=""
              onError={() => setMissing(true)}
              ref={img}
              className="h-full w-auto max-w-none object-cover will-change-transform md:w-full"
            />
          ) : (
            <div className="story-plate-empty absolute inset-0" />
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,36,24,0.94),rgba(10,36,24,0.6)_55%,rgba(10,36,24,0.28))]" />

        <div className="relative z-40 flex h-full flex-col items-center justify-center px-5 text-center text-[#FCF5F3]">
          <div ref={copy} className="will-change-transform">
            <p className="film-micro text-[color:var(--st-pink)]">{t("ဒီရာသီ", "The season")}</p>
            <h2
              className={`mx-auto mt-5 max-w-[18ch] ${lang === "mm" ? "font-mm font-semibold" : "display"} ${dsize(
                lang,
                "text-[13vw] leading-[0.94] md:text-[5.6vw]",
                "text-[8vw] leading-[1.3] md:text-[3.2vw]"
              )}`}
            >
              {t("အခုတော့ သင့်အလှည့်", "Now it is your turn")}
            </h2>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/shop"
                className="rounded-full bg-[color:var(--st-pink)] px-8 py-3.5 text-sm font-semibold text-[#2A0E17] transition-transform duration-300 hover:scale-105"
              >
                {t("ဆိုင်ကြည့်မယ်", "Shop the collection")}
              </Link>
              <a
                href={viberLink()}
                className="film-micro rounded-full border border-current px-6 py-3.5 opacity-80 transition-opacity hover:opacity-100"
              >
                {t("Viber ကနေ မှာမယ်", "Order on Viber")}
              </a>
            </div>

            {/* On a phone the floor belongs to the install pill, the stylist
                button and the nav, so the credits ride with the copy. */}
            <div className="mt-12 md:hidden">
              <p className="film-micro opacity-50">
                {t("ဝတ်စုံ ၄၉ မျိုး · တစ်ယောက်တည်း ရွေးသည်", "49 pieces · chosen by one person")}
              </p>
              <p className="film-micro mt-2.5 opacity-75">Site by Mike Ronny</p>
            </div>
          </div>
        </div>

        {/* End credits, centred — both bottom corners belong to the floating
            chrome, which comes back on this exact frame. */}
        <div className="film-foot absolute inset-x-0 bottom-0 z-40 hidden px-5 text-center text-[#FCF5F3] md:block md:px-10">
          <p className="film-micro opacity-55">
            {t("ဝတ်စုံ ၄၉ မျိုး · တစ်ယောက်တည်း ရွေးသည်", "49 pieces · chosen by one person")}
          </p>
          <p className="film-micro mt-2.5 opacity-75">Site by Mike Ronny</p>
        </div>
      </div>
    </section>
  )
}

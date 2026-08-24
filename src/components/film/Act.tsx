import { useCallback, useRef, useState } from "react"
import { useLang } from "@/lib/lang"
import { dsize, range, useStage } from "@/lib/stage"
import { holdOverlays } from "@/lib/overlays"

export type ActData = {
  n: number
  kicker_mm: string
  kicker_en: string
  /** Headline as lines — they break where the writer says, not where the box says. */
  head_mm: string[]
  head_en: string[]
  body_mm: string
  body_en: string
  sign_mm?: string
  sign_en?: string
  art: string
  tone: "dark" | "light"
  align: "left" | "right"
}

/**
 * One act of the film: a tall section wrapped around a sticky full-screen
 * stage. Scrolling it drifts the art, lifts the copy off the floor and fades
 * the readout — every frame, without a single React render.
 */
export default function Act({ act, total }: { act: ActData; total: number }) {
  const { t, lang } = useLang()
  const stage = useRef<HTMLElement>(null)
  const art = useRef<HTMLDivElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  const foot = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const [missing, setMissing] = useState(false)

  const dark = act.tone === "dark"
  const right = act.align === "right"

  const onFrame = useCallback(
    (p: number) => {
      document.documentElement.dataset.tone = act.tone
      holdOverlays(true)
      const phone = window.innerWidth < 768
      if (art.current) {
        art.current.style.transform = phone
          ? "none"
          : `translate3d(0, ${(p * -4).toFixed(2)}%, 0) scale(${(1.08 - p * 0.05).toFixed(3)})`
      }
      if (img.current) {
        if (phone) {
          // The plate is far wider than the screen, so instead of cropping it the
          // camera trucks across it: the act opens on the empty side the words sit
          // over, and she arrives in frame as you finish reading.
          const overflow = Math.max(0, img.current.offsetWidth - window.innerWidth)
          // eased out, so the move carries you into the frame early and then
          // settles on her rather than arriving only at the very end
          const t = range(p, 0.04, 0.92)
          const e = 1 - Math.pow(1 - t, 2)
          const x = right ? -overflow * (1 - e) : -overflow * e
          img.current.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`
        } else if (img.current.style.transform) {
          img.current.style.transform = ""
        }
      }
      if (copy.current) {
        const lift = range(p, 0.15, 1) * -90
        copy.current.style.transform = `translate3d(0, ${lift.toFixed(1)}px, 0)`
        copy.current.style.opacity = String(1 - range(p, 0.62, 0.98))
      }
      if (foot.current) foot.current.style.opacity = String(1 - range(p, 0.35, 0.7))
    },
    [act.tone, right]
  )

  useStage(stage, onFrame)

  // the copy side gets the weight of the wash so the words always hold
  const scrim = dark
    ? `linear-gradient(${right ? 260 : 100}deg, rgba(10,36,24,0.86) 0%, rgba(10,36,24,0.42) 38%, rgba(10,36,24,0.05) 66%)`
    : `linear-gradient(${right ? 260 : 100}deg, rgba(252,245,243,0.94) 0%, rgba(252,245,243,0.62) 38%, rgba(252,245,243,0.05) 68%)`

  /**
   * A phone screen is nearly the inverse of 16:9. Filling it crops away half the
   * plate; boxing the plate and captioning it underneath is worse — it stops
   * being a film. So the phone keeps the full-bleed frame and MOVES: see the
   * truck in onFrame. The words sit at the floor under a vertical wash.
   */
  const scrimPhone = dark
    ? "linear-gradient(to top, rgba(10,36,24,0.95) 0%, rgba(10,36,24,0.66) 38%, rgba(10,36,24,0.12) 76%)"
    : "linear-gradient(to top, rgba(252,245,243,0.96) 0%, rgba(252,245,243,0.72) 38%, rgba(252,245,243,0.14) 76%)"

  return (
    <section ref={stage} className="relative h-[210vh]" data-act={act.n}>
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ background: dark ? "var(--st-ink)" : "var(--st-paper)" }}
      >
        <div ref={art} className="absolute inset-0 will-change-transform">
          {!missing ? (
            <img
              src={act.art}
              alt=""
              // the opening frame is the paint; the rest can arrive as they are scrolled to
              loading={act.n === 1 ? "eager" : "lazy"}
              fetchPriority={act.n === 1 ? "high" : "auto"}
              decoding="async"
              onError={() => setMissing(true)}
              ref={img}
              className="h-full w-auto max-w-none object-cover will-change-transform md:w-full"
            />
          ) : (
            <div className="story-plate-empty absolute inset-0 grid place-items-center">
              <p className="film-micro text-[#FCF5F3]/40">{act.art.replace("/story/", "")}</p>
            </div>
          )}
        </div>

        <div
          className="pointer-events-none absolute inset-0 md:hidden"
          style={{ background: scrimPhone }}
        />
        <div
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{ background: scrim }}
        />

        <div
          className={`relative z-40 flex h-full flex-col items-start justify-end px-5 pb-[calc(var(--foot)+4rem)] md:justify-center md:px-10 md:pb-0 ${
            right ? "md:items-end md:text-right" : ""
          }`}
          style={{ color: dark ? "#FCF5F3" : "var(--st-ink)" }}
        >
          <div ref={copy} className="max-w-[46ch] will-change-transform">
            <div className="film-micro mb-7 text-[color:var(--st-pink)] opacity-90">
              {t(act.kicker_mm, act.kicker_en)}
            </div>

            <h2
              className={`${lang === "mm" ? "font-mm font-semibold" : "display"} ${dsize(
                lang,
                "text-[11vw] leading-[0.94] md:text-[5.4vw]",
                "text-[7vw] leading-[1.34] md:text-[3.1vw]"
              )}`}
            >
              {(lang === "mm" ? act.head_mm : act.head_en).map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h2>

            <div className={`mt-9 max-w-[34ch] md:mt-11 ${right ? "ml-auto" : ""}`}>
              <p className="font-mm text-[13px] leading-[1.75] opacity-75">
                {t(act.body_mm, act.body_en)}
              </p>
              {act.sign_en ? (
                <p className="film-micro mt-5 text-[color:var(--st-pink)] opacity-90">
                  {t(act.sign_mm ?? act.sign_en, act.sign_en)}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div
          ref={foot}
          className="film-foot absolute inset-x-0 bottom-0 z-40 px-5 pt-20 md:px-10"
          style={{
            color: dark ? "#FCF5F3" : "var(--st-ink)",
            background: dark
              ? "linear-gradient(to top, rgba(10,36,24,0.75), transparent)"
              : "linear-gradient(to top, rgba(252,245,243,0.75), transparent)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="film-micro opacity-70">{t("အောက်ဆွဲပါ", "Scroll")}</span>
            <span className="film-micro opacity-70">
              {String(act.n).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

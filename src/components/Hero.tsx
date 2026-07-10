import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { useLang } from "@/lib/lang"
import { useHeroSlides } from "@/lib/hero"

const SERIF = '"Playfair Display", "Lora", Georgia, serif'
const ACCENT = "#C28773"
const ease = [0.16, 1, 0.3, 1] as const

const WORD = "SINAR".split("")

export default function Hero() {
  const { t, lang } = useLang()
  const SLIDES = useHeroSlides()
  const [i, setI] = useState(0)

  useEffect(() => {
    setI(0)
    if (SLIDES.length < 2) return
    const id = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 4800)
    return () => clearInterval(id)
  }, [SLIDES.length])

  return (
    <section className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-[#14110c] text-[#F3EEE4]">
      {/* ── Rotating full-bleed imagery ── */}
      {SLIDES.map((src, idx) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
          style={{ opacity: idx === i ? 1 : 0 }}
        >
          <img
            src={src}
            alt=""
            className={`h-full w-full object-cover ${idx === i ? "animate-kenburns" : ""}`}
            loading={idx === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* ── Cinematic scrims ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#14110c] via-[#14110c]/45 to-[#14110c]/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#14110c]/80 via-transparent to-transparent" />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 sm:px-10">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-5 flex items-center gap-3"
        >
          <span className="h-px w-12" style={{ background: ACCENT }} />
          <span className="text-[11px] font-medium uppercase tracking-[0.42em] text-[#F3EEE4]/80">
            {t("မြန်မာ့ ဖက်ရှင် အက်တလီယာ", "Myanmar Atelier")} · {t("ဆောင်းဦး ၂၀၂၅", "AW 2025")}
          </span>
        </motion.div>

        {/* Kinetic wordmark */}
        <h1 className="flex leading-none" style={{ fontFamily: SERIF, fontWeight: 700 }} aria-label="Sinar">
          {WORD.map((ch, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 90, rotateX: -70 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.9, delay: 0.25 + idx * 0.08, ease }}
              className="text-sheen inline-block text-[24vw] leading-[0.8] sm:text-[19vw] lg:text-[15rem]"
            >
              {ch}
            </motion.span>
          ))}
        </h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease }}
          className="mt-4 max-w-md text-lg text-[#F3EEE4]/85"
          style={{ fontFamily: SERIF }}
        >
          <span className="italic">Lovely little things,</span>{" "}
          <span className="italic" style={{ color: ACCENT }}>made in Yangon.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <a href="#shop" className="pill" style={{ background: ACCENT, color: "#14110c" }}>
            <span className={lang === "mm" ? "font-mm" : ""}>{t("ဝတ်စုံများ ကြည့်ရန်", "Shop the Collection")}</span>
          </a>
          <a
            href="/film"
            className="pill-outline"
            style={{ borderColor: "rgba(243,238,228,0.5)", color: "#F3EEE4" }}
          >
            <span className={lang === "mm" ? "font-mm" : ""}>{t("ဗီဒီယို ကြည့်ရန်", "Watch the Film")}</span>
          </a>
        </motion.div>
      </div>

      {/* ── Bottom kinetic marquee ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-[#F3EEE4]/15 bg-[#14110c]/40 py-3 backdrop-blur-sm overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, r) => (
            <div key={r} className="flex items-center">
              {["LOVELY LITTLE THINGS", "MADE IN YANGON", "SOFT & CHIC", "NEW SEASON 2025", "ORDER VIA DM"].map((w) => (
                <span key={w + r} className="flex items-center">
                  <span className="px-6 text-[11px] font-medium uppercase tracking-[0.32em] text-[#F3EEE4]/70">{w}</span>
                  <span style={{ color: ACCENT }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Slide dots + scroll cue ── */}
      <div className="absolute bottom-16 right-6 z-10 hidden items-center gap-2 sm:flex">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{ width: idx === i ? 28 : 10, background: idx === i ? ACCENT : "rgba(243,238,228,0.4)" }}
          />
        ))}
      </div>

      <motion.a
        href="#shop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.2, duration: 0.8 }, y: { repeat: Infinity, duration: 1.8, ease: "easeInOut" } }}
        className="absolute bottom-16 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-[#F3EEE4]/70 sm:flex"
        aria-label="Scroll"
      >
        <span className="text-[9px] uppercase tracking-[0.3em]">{t("အောက်သို့", "Scroll")}</span>
        <ArrowDown className="h-4 w-4" />
      </motion.a>
    </section>
  )
}

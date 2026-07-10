import { useState } from "react"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { Link } from "react-router-dom"
import Shell from "@/components/Shell"
import { useLang } from "@/lib/lang"
import { useFilms } from "@/lib/films"

const SERIF = '"Playfair Display", "Lora", Georgia, serif'
const ACCENT = "#C28773"

export default function Film() {
  const { t, lang } = useLang()
  const FILMS = useFilms()
  const [active, setActive] = useState(0)
  const [started, setStarted] = useState(false)
  const film = FILMS[Math.min(active, FILMS.length - 1)] ?? FILMS[0]

  const select = (i: number) => {
    setActive(i)
    setStarted(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Shell>
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-10">
        {/* Masthead */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between border-t border-text/15 pt-4 mb-10"
        >
          <span className="text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-text-sub">
            {t("ဗီဒီယို", "Motion")} — {t("လုခ်ဘွတ်", "The Lookbook")}
          </span>
          <span className="text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-text-sub">
            {t("ဆောင်းဦး ၂၀၂၅", "AW 2025")}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-text leading-[0.85] mb-3"
          style={{ fontFamily: SERIF, fontWeight: 700 }}
        >
          <span className="block text-6xl sm:text-8xl lg:text-[9rem]">Film</span>
        </motion.h1>
        <p className={`max-w-lg text-sm text-text-sub mb-12 ${lang === "mm" ? "font-mm" : ""}`}>
          {t(
            "Sinar ၏ ဆောင်းဦးဝတ်စုံများကို လှုပ်ရှားမှုဖြင့် ကြည့်ရှုပါ — ကမ်ပိန်း၊ အက်တလီယာ အတွင်းပိုင်းနှင့် လမ်းပေါ် ရုပ်ရှင်တိုများ။",
            "Our collection, in motion — campaigns, atelier stories and short films shot around Yangon.",
          )}
        </p>

        {/* Featured player */}
        <motion.div
          key={film.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="relative w-full overflow-hidden rounded-[4px] bg-bg-mid" style={{ aspectRatio: "16 / 9" }}>
            {started ? (
              <video
                key={film.src}
                className="h-full w-full object-cover"
                src={film.src}
                poster={film.poster}
                controls
                autoPlay
                playsInline
              />
            ) : (
              <button
                onClick={() => setStarted(true)}
                className="group absolute inset-0 h-full w-full"
                aria-label="Play film"
              >
                <img src={film.poster} alt={film.title_en} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[#1A1611]/25 transition-colors group-hover:bg-[#1A1611]/10" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="flex h-20 w-20 items-center justify-center rounded-full backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
                    style={{ background: ACCENT }}
                  >
                    <Play className="h-7 w-7 translate-x-[2px]" fill="#1A1611" stroke="none" />
                  </span>
                </span>
                <span className="absolute bottom-5 left-5 text-[10px] uppercase tracking-[0.35em] text-[#F3EEE4] drop-shadow">
                  {t("ကြည့်ရန် နှိပ်ပါ", "Press to play")}
                </span>
              </button>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-text/15 pb-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
                {String(active + 1).padStart(2, "0")} — {lang === "mm" ? film.tag_mm : film.tag_en}
              </span>
              <h2
                className={`mt-1 text-2xl sm:text-3xl text-text ${lang === "mm" ? "font-mm" : ""}`}
                style={lang === "mm" ? undefined : { fontFamily: SERIF, fontWeight: 500 }}
              >
                {lang === "mm" ? film.title_mm : film.title_en}
              </h2>
            </div>
            <span className="text-[11px] tracking-[0.25em] uppercase text-text-muted">{film.runtime}</span>
          </div>
        </motion.div>

        {/* Thumbnail rail */}
        <div className="mt-10">
          <span className="text-[10px] uppercase tracking-[0.35em] text-text-muted">
            {t("ဗီဒီယိုများ အားလုံး", "All Films")}
          </span>
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {FILMS.map((f, i) => {
              const isActive = i === active
              return (
                <motion.button
                  key={f.id}
                  onClick={() => select(i)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group text-left"
                >
                  <div
                    className="relative overflow-hidden rounded-[3px] bg-bg-mid"
                    style={{ aspectRatio: "4 / 3" }}
                  >
                    <img
                      src={f.poster}
                      alt={f.title_en}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 transition-colors ${isActive ? "bg-[#1A1611]/10" : "bg-[#1A1611]/35 group-hover:bg-[#1A1611]/15"}`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
                        style={{ background: isActive ? ACCENT : "rgba(243,238,228,0.85)" }}
                      >
                        <Play className="h-4 w-4 translate-x-[1px]" fill="#1A1611" stroke="none" />
                      </span>
                    </div>
                    {isActive && (
                      <span
                        className="absolute left-3 top-3 text-[9px] uppercase tracking-[0.25em] px-2 py-0.5"
                        style={{ background: ACCENT, color: "#1A1611" }}
                      >
                        {t("ဖွင့်နေသည်", "Now Playing")}
                      </span>
                    )}
                    <span className="absolute bottom-3 right-3 text-[10px] tracking-[0.2em] text-[#F3EEE4] drop-shadow">{f.runtime}</span>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-2">
                    <h3
                      className={`text-[15px] text-text ${lang === "mm" ? "font-mm" : ""}`}
                      style={lang === "mm" ? undefined : { fontFamily: SERIF, fontWeight: 500 }}
                    >
                      {lang === "mm" ? f.title_mm : f.title_en}
                    </h3>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-text-muted">
                    {lang === "mm" ? f.tag_mm : f.tag_en}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Closing CTA */}
        <div className="mt-20 border-t border-text/15 pt-10 flex flex-wrap items-center justify-between gap-6">
          <p className="text-2xl sm:text-3xl text-text max-w-md" style={{ fontFamily: SERIF, fontWeight: 500 }}>
            {t("ကြိုက်နှစ်သက်တာကို ဝယ်ယူလိုက်ပါ။", "Shop the pieces you just watched.")}
          </p>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 text-sm font-medium tracking-wide text-text"
          >
            <span className={lang === "mm" ? "font-mm" : ""}>{t("ဆိုင်သို့", "Enter the Shop")}</span>
            <span className="block w-8 h-px transition-all duration-300 group-hover:w-12" style={{ backgroundColor: ACCENT }} />
          </Link>
        </div>
      </section>
    </Shell>
  )
}

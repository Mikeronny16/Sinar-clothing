import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { SITE } from "@/config"
import { useLang } from "@/lib/lang"
import { useTheme } from "@/lib/theme"

// Elegant editorial fashion images
const HERO_IMG = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=80"
const HERO_IMG_ACCENT = "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80"

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { t, lang } = useLang()
  const { isDark } = useTheme()

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] })
  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  const bgClass = isDark
    ? "bg-[#0A1A0F]"
    : "bg-[#FAF7F2]"
  const textPrimary = isDark ? "text-[#F5F0E8]" : "text-[#1A2E1F]"
  const textMuted = isDark ? "text-[#7A8F7D]" : "text-[#3D5A45]"
  const borderColor = isDark ? "border-[rgba(255,255,255,0.08)]" : "border-[rgba(45,90,61,0.15)]"

  return (
    <section
      ref={containerRef}
      className={`relative min-h-screen ${bgClass} overflow-hidden grain-texture`}
    >
      {/* ── Desktop: Asymmetric split layout ── */}
      <div className="hidden lg:flex min-h-screen">
        {/* LEFT: Editorial text — 45% */}
        <motion.div
          className="relative z-10 flex flex-col justify-end pb-20 pl-12 xl:pl-20 pr-8 w-[45%] flex-shrink-0"
          style={{ y: yText, opacity }}
        >
          {/* Small editorial season label */}
          <motion.div
            className="mb-8 flex items-center gap-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 2.2 }}
          >
            <span className="w-8 h-px bg-pink" />
            <span className="editorial-label text-pink tracking-[0.45em]">
              {t("ရာသီ အသစ် ၂၀၂၅", "New Season 2025")}
            </span>
          </motion.div>

          {/* Main headline — mixed typography */}
          <div className="mb-6">
            <div className="overflow-hidden">
              <motion.p
                className={`editorial-label tracking-[0.3em] mb-2 ${textMuted}`}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 2.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {t("မြန်မာ", "MYANMAR")} · FASHION
              </motion.p>
            </div>

            <div className="overflow-hidden">
              <motion.h1
                className={`font-serif text-7xl xl:text-[90px] 2xl:text-[110px] leading-none font-black ${textPrimary}`}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.1, delay: 2.35, ease: [0.16, 1, 0.3, 1] }}
              >
                SI<span className="italic text-pink">NA</span>R
              </motion.h1>
            </div>

            <div className="overflow-hidden mt-1">
              <motion.div
                className={`font-serif text-3xl xl:text-4xl italic font-normal ${isDark ? "text-[#C8D8CB]" : "text-[#3D5A45]"} leading-tight`}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.0, delay: 2.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {t("ချစ်စရာ ဝတ်စုံများ", "Curated Clothing")}
              </motion.div>
            </div>
          </div>

          {/* Thin accent line */}
          <motion.div
            className="h-px w-24 bg-pink mb-8"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 2.7, ease: [0.76, 0, 0.24, 1] }}
            style={{ transformOrigin: "left" }}
          />

          {/* Tagline */}
          <motion.p
            className={`font-mm text-sm leading-relaxed mb-10 max-w-xs ${textMuted}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.85 }}
          >
            {t(
              "ရွေးချယ်ထားသော ချစ်စရာ ဝတ်စုံလေးများ — DM ဖြင့် မှာယူနိုင်ပါသည်",
              "Carefully curated clothing for every occasion — Order via DM"
            )}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-start gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3.0 }}
          >
            <a
              href="#shop"
              className="group relative inline-flex items-center gap-2 bg-pink text-white px-8 py-3.5 rounded-full text-sm font-semibold overflow-hidden hover:shadow-pink transition-shadow duration-300"
            >
              <span className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-full" />
              <span className={`relative ${lang === "mm" ? "font-mm" : ""}`}>
                {t("ဝတ်စုံများကြည့်ရန်", "View Collection")}
              </span>
            </a>
            <a
              href={SITE.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium border transition-colors duration-300 hover:border-pink hover:text-pink ${
                isDark
                  ? "border-[rgba(255,255,255,0.12)] text-[#C8D8CB]"
                  : "border-[rgba(45,90,61,0.2)] text-[#3D5A45]"
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </a>
          </motion.div>

          {/* Small vertical text decoration */}
          <div
            className={`absolute bottom-20 right-0 hidden xl:block editorial-label opacity-30 ${textMuted}`}
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            MYANMAR FASHION BRAND
          </div>
        </motion.div>

        {/* RIGHT: Full-height image — 55% */}
        <div className="flex-1 relative overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{ y: yImg }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 2.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={HERO_IMG}
              alt="Sinar Fashion"
              className="w-full h-[115%] object-cover object-top"
            />
            {/* Gradient fade to bg color on left edge */}
            <div
              className={`absolute inset-y-0 left-0 w-32 bg-gradient-to-r ${
                isDark ? "from-[#0A1A0F]" : "from-[#FAF7F2]"
              } to-transparent`}
            />
            {/* Bottom fade */}
            <div
              className={`absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t ${
                isDark ? "from-[#0A1A0F]" : "from-[#FAF7F2]"
              } to-transparent`}
            />
          </motion.div>

          {/* Accent floating card */}
          <motion.div
            className={`absolute bottom-20 left-8 w-40 h-52 rounded-2xl overflow-hidden border shadow-editorial-dark tilt-2 ${borderColor}`}
            initial={{ opacity: 0, y: 40, rotate: 3 }}
            animate={{ opacity: 1, y: 0, rotate: 1.2 }}
            transition={{ duration: 1.0, delay: 3.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={HERO_IMG_ACCENT}
              alt="Sinar Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-white text-[9px] tracking-widest uppercase font-medium editorial-label">
                {t("ဝတ်စုံသစ်", "New Arrivals")}
              </p>
            </div>
          </motion.div>

          {/* Floating stat pill */}
          <motion.div
            className={`absolute top-24 right-8 px-4 py-3 rounded-2xl border backdrop-blur-md ${
              isDark
                ? "bg-[rgba(10,26,15,0.75)] border-[rgba(255,255,255,0.08)]"
                : "bg-[rgba(250,247,242,0.85)] border-[rgba(45,90,61,0.15)]"
            }`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 3.2 }}
          >
            <p className="text-pink font-serif text-2xl font-black">100+</p>
            <p className={`editorial-label ${textMuted}`}>{t("ဝတ်စုံ", "ITEMS")}</p>
          </motion.div>
        </div>
      </div>

      {/* ── Mobile: Full-screen image with bottom text overlay ── */}
      <div className="lg:hidden relative min-h-screen flex flex-col">
        {/* Full-screen background image */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: yImg }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 2.0 }}
        >
          <img
            src={HERO_IMG}
            alt="Sinar Fashion"
            className="w-full h-[110%] object-cover object-top"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />
        </motion.div>

        {/* Bottom text overlay */}
        <motion.div
          className="relative z-10 mt-auto px-6 pb-20 pt-8"
          style={{ opacity }}
        >
          <motion.div
            className="flex items-center gap-2 mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 2.2 }}
          >
            <span className="w-6 h-px bg-pink" />
            <span className="editorial-label text-pink">{t("ရာသီ အသစ်", "NEW SEASON")} 2025</span>
          </motion.div>

          <motion.h1
            className="font-serif text-6xl font-black text-white leading-none mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 2.3, ease: [0.16, 1, 0.3, 1] }}
          >
            SI<span className="italic text-pink">NA</span>R
          </motion.h1>

          <motion.p
            className="font-serif text-xl italic text-white/70 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.5 }}
          >
            {t("ချစ်စရာ ဝတ်စုံများ", "Curated Clothing")}
          </motion.p>

          <motion.div
            className="h-px w-16 bg-pink mb-5"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 2.65 }}
            style={{ transformOrigin: "left" }}
          />

          <motion.p
            className="font-mm text-sm text-white/60 leading-relaxed mb-8 max-w-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 2.8 }}
          >
            {t(
              "ရွေးချယ်ထားသော ချစ်စရာ ဝတ်စုံလေးများ",
              "Carefully curated clothing"
            )}
          </motion.p>

          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 2.95 }}
          >
            <a
              href="#shop"
              className="flex-1 text-center bg-pink text-white py-3.5 rounded-full text-sm font-semibold hover:shadow-pink transition-shadow duration-300"
            >
              <span className={lang === "mm" ? "font-mm" : ""}>
                {t("ကြည့်ရန်", "Shop Now")}
              </span>
            </a>
            <a
              href={SITE.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center border border-white/20 text-white py-3.5 rounded-full text-sm font-medium hover:border-pink transition-colors duration-300"
            >
              Facebook
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator — shown on both */}
      <motion.a
        href="#marquee"
        className="absolute bottom-8 left-8 lg:left-12 xl:left-20 hidden lg:flex flex-col items-start gap-2 text-muted hover:text-pink transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 0.8 }}
      >
        <span className="editorial-label text-[9px] text-pink/60">Scroll</span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-pink to-transparent"
          animate={{ scaleY: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      </motion.a>
    </section>
  )
}

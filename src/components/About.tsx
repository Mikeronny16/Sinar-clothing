import { motion } from "framer-motion"
import { SITE } from "@/config"
import { useLang } from "@/lib/lang"
import { useTheme } from "@/lib/theme"
import Botanical from "./Botanical"

export default function About() {
  const { t, lang } = useLang()
  const { isDark } = useTheme()

  const textPrimary = isDark ? "text-cream" : "text-plum"
  const textMuted = isDark ? "text-[#7A8F7D]" : "text-[#3D5A45]"
  const cardBg = "bg-bg-card"

  return (
    <section id="about" className="py-24 lg:py-36 bg-bg-mid relative overflow-hidden">
      {/* Decorative floral watermark background */}
      <div className="absolute right-0 bottom-0 text-pink/5 pointer-events-none transform translate-y-12 translate-x-12">
        <Botanical className="w-96 h-auto" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* ── LEFT COLUMN: Text Spread (7 cols) ── */}
          <motion.div
            className="lg:col-span-7 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-px bg-pink" />
              <span className="editorial-label text-pink text-[10px] tracking-[0.3em] font-semibold uppercase">
                {t("ကျွန်မတို့အကြောင်း", "DESIGN PHILOSOPHY")}
              </span>
            </div>

            <h2 className={`font-serif text-4xl sm:text-5xl leading-none font-black ${textPrimary}`}>
              {t("သက်သောင့်သက်သာရှိမှုနှင့် ", "Elegant Silhouettes, ")}<br />
              <span className="italic text-coral">{t("ကျော့ရှင်းသောစတိုင်လ်", "Authentic Grace.")}</span>
            </h2>

            {/* Giant quotes block */}
            <div className="relative pl-6 sm:pl-8 border-l border-pink/30">
              <p className={`font-serif text-lg sm:text-xl italic leading-relaxed ${textPrimary}`}>
                {t(
                  "\"အဝတ်အစားတစ်ခုရဲ့ တန်ဖိုးဟာ ဝတ်ဆင်သူကို ပေးစွမ်းနိုင်တဲ့ ယုံကြည်မှုနဲ့ ပျော်ရွှင်မှုပဲ ဖြစ်ပါတယ်။\"",
                  "\"The true essence of fashion lies in the joy and quiet confidence it brings to the wearer every single day.\""
                )}
              </p>
            </div>

            <div className={`space-y-4 font-mm text-xs sm:text-sm leading-relaxed ${textMuted}`}>
              <p>
                <span className={`font-semibold ${textPrimary}`}>{SITE.name}</span> {t(
                  "ဆိုသည်မှာ မြန်မာ့အမျိုးသမီးများအတွက် ချစ်စရာကောင်းပြီး သေသပ်လှပကာ ပတ်ဝန်းကျင်သဟဇာတဖြစ်သော ဝတ်စုံဒီဇိုင်းများကို ဦးစားပေး ဖန်တီးပေးနေသော Lookbook အမှတ်တံဆိပ် ဖြစ်ပါသည်။",
                  "is a contemporary Myanmar boutique that focuses on natural textures, breathable organic cotton, and hand-tailored pieces that stand out with minimal effort."
                )}
              </p>
              <p>
                {t(
                  "ကျွန်မတို့ တည်ဆောက်ထားသော lookbook တိုင်းမှာ ခေတ်မှီဒီဇိုင်းများနှင့် သဘာဝပတ်ဝန်းကျင်ကို လေးစားသော ဖန်တီးမှုများ ပေါင်းစပ်ပါဝင်သည်။ ရွေးချယ်မှုတစ်ခုချင်းစီတိုင်းက သင့်တစ်နေ့တာကို စတိုင်လ်ကျကျ ဖြတ်သန်းနိုင်စေရန် ရည်ရွယ်သည်။",
                  "Each capsule contains versatile basics and statement wraps designed to transition seamlessly from quiet afternoons to elegant evenings, with free delivery within Myitkyina."
                )}
              </p>
            </div>

            {/* Editorial Stats Index */}
            <div className="pt-6 grid grid-cols-3 gap-8 border-t border-pink/10">
              {[
                { num: "01", label_mm: "စေ့စပ်ချုပ်လုပ်မှု", label_en: "Pure Craft" },
                { num: "02", label_mm: "ရွေးချယ်ထားသောအထည်", label_en: "Curated Fiber" },
                { num: "03", label_mm: "ပေါ့ပါးလန်းဆန်းမှု", label_en: "Luxe Comfort" },
              ].map((item) => (
                <div key={item.num} className="space-y-1">
                  <span className="font-mono text-xs font-bold text-pink">{item.num}</span>
                  <h4 className={`text-[11px] font-bold uppercase tracking-wider ${textPrimary}`}>
                    {lang === "mm" ? item.label_mm : item.label_en}
                  </h4>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN: Overlapping Lookbook Spread (5 cols) ── */}
          <motion.div
            className="lg:col-span-5 relative h-[380px] sm:h-[450px] mt-12 lg:mt-0"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Background card outline frame */}
            <div className="absolute inset-0 border border-pink/15 rounded-3xl pointer-events-none transform -rotate-2" />

            {/* Bottom/Left Image card */}
            <div className="absolute bottom-4 left-4 w-2/3 aspect-[3/4] rounded-2xl overflow-hidden shadow-editorial bg-forest border border-pink/20 z-10">
              <img
                src="/founder/IMG_2940.JPG"
                alt="Founder Lookbook Casual"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/30 to-transparent" />
            </div>

            {/* Top/Right Image card */}
            <div className="absolute top-4 right-4 w-2/3 aspect-[3/4] rounded-2xl overflow-hidden shadow-editorial bg-forest border border-pink/20 z-20">
              <img
                src="/founder/IMG_2939.JPG"
                alt="Founder Lookbook Elegant"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/30 to-transparent" />
            </div>

            {/* Sprig decoration sticking out */}
            <div className="absolute -top-6 -right-6 text-gold/30 pointer-events-none z-30">
              <Botanical className="w-24 h-auto transform rotate-45" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

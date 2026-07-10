import { useState } from "react"
import Shell from "@/components/Shell"
import { useLang } from "@/lib/lang"
import { useTheme } from "@/lib/theme"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, MessageCircle, X, Award, Eye, Heart, Shield } from "lucide-react"
import { SITE } from "@/config"

const PHOTOS = [
  { src: "/founder/IMG_2938.JPG", title_en: "Signature Silhouette", title_mm: "အဓိက ဒီဇိုင်းပုံရိပ်", desc_en: "Classic cut designed to blend modern aesthetics with timeless elegance.", desc_mm: "ခေတ်မှီဒီဇိုင်းနှင့် ထာဝရလှပမှုကို ပေါင်းစပ်ဖန်တီးထားသော အဓိကဝတ်စုံပုံစံ။" },
  { src: "/founder/IMG_2939.JPG", title_en: "Classic Editorial", title_mm: "စတိုင်လ်ကျလှပမှု", desc_en: "Bold tailoring highlighting details and structural perfection.", desc_mm: "အသေးစိတ်ချုပ်လုပ်မှုနှင့် တိကျသေသပ်မှုကို ဖော်ညွှန်းသည့် ပုံရိပ်။" },
  { src: "/founder/IMG_2940.JPG", title_en: "Charming Casuals", title_mm: "ပေါ့ပါးလန်းဆန်းသော ဝတ်စုံ", desc_en: "Everyday luxury made with natural fibers and comfort-first design.", desc_mm: "သဘာဝချည်သားနှင့် သက်သောင့်သက်သာရှိမှုကို အဓိကထားသည့် နေ့စဉ်ဝတ်စုံ။" },
  { src: "/founder/IMG_2937.JPG", title_en: "Curated Details", title_mm: "အသေးစိတ် ဖန်တီးမှု", desc_en: "Hand-picked fabrics chosen for durability, texture, and grace.", desc_mm: "ကြာရှည်ခံမှု၊ နူးညံ့မှုနှင့် ကျော့ရှင်းမှုတို့အတွက် စေ့စပ်စွာ ရွေးချယ်ထားသော ပိတ်စများ။" },
]

export default function Portfolio() {
  const { t, lang } = useLang()
  const { isDark } = useTheme()
  const [lightbox, setLightbox] = useState<number | null>(null)

  const textMain = isDark ? "text-cream" : "text-plum"
  const textMuted = isDark ? "text-[#7A8F7D]" : "text-[#3D5A45]"
  const cardBg = isDark ? "bg-[#0F2415] border-[rgba(255,255,255,0.06)]" : "bg-white border-[rgba(45,90,61,0.08)]"

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
        {/* Header Section */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-px bg-pink" />
            <span className="editorial-label text-pink text-[10px] uppercase tracking-[0.25em]">
              {t("ဖန်တီးသူ၏ မှတ်တမ်း", "FOUNDER'S PORTFOLIO")}
            </span>
            <span className="w-6 h-px bg-pink" />
          </div>
          <h1 className={`display mt-4 text-4xl sm:text-6xl uppercase leading-none ${textMain}`}>
            {t("စတိုင်လ်နှင့် ", "A Vision of ")}
            <span className="italic text-coral">{t("ဖန်တီးမှု", "Elegance")}</span>
          </h1>
          <p className={`mx-auto mt-5 max-w-2xl text-sm leading-relaxed ${textMuted} ${lang === "mm" ? "font-mm" : ""}`}>
            {t(
              "Sinar ၏ တည်ထောင်သူသည် မြန်မာအမျိုးသမီးများအတွက် ချစ်စရာကောင်းပြီး သက်သောင့်သက်သာရှိကာ ယုံကြည်မှုကို တိုးမြင့်စေမည့် ဝတ်စုံလေးများကို ကိုယ်တိုင်ရွေးချယ် ဇယားဆွဲ ဒီဇိုင်းထုတ်ပေးနေသူ ဖြစ်သည်။",
              "Sinar's founder is dedicated to crafting a unique fashion space in Myanmar, offering curated collections that make every woman feel cute, confident, and inherently graceful."
            )}
          </p>
        </section>

        {/* Brand Philosophy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className={`p-8 rounded-3xl border ${cardBg} transition-all duration-300 hover:shadow-editorial`}>
            <div className="w-10 h-10 rounded-full bg-pink/15 flex items-center justify-center mb-5">
              <Award className="w-5 h-5 text-pink" />
            </div>
            <h3 className={`font-serif text-lg font-bold mb-3 ${textMain}`}>
              {t("စေ့စပ်သေသပ်မှု", "Craftsmanship")}
            </h3>
            <p className={`text-xs leading-relaxed ${textMuted} ${lang === "mm" ? "font-mm" : ""}`}>
              {t(
                "အထည်ချုပ်ဒီဇိုင်းတိုင်း၏ ချုပ်ရိုးချုပ်သားနှင့် အရည်အသွေးကို စံချိန်စံညွှန်း အကောင်းဆုံးဖြစ်အောင် ဂရုတစိုက် ဆောင်ရွက်ပါသည်။",
                "Every stitch and seam is supervised to match premium luxury standards, assuring comfort and longevity."
              )}
            </p>
          </div>

          <div className={`p-8 rounded-3xl border ${cardBg} transition-all duration-300 hover:shadow-editorial`}>
            <div className="w-10 h-10 rounded-full bg-pink/15 flex items-center justify-center mb-5">
              <Heart className="w-5 h-5 text-pink" />
            </div>
            <h3 className={`font-serif text-lg font-bold mb-3 ${textMain}`}>
              {t("စိတ်ကျေနပ်မှု", "Passionate Curation")}
            </h3>
            <p className={`text-xs leading-relaxed ${textMuted} ${lang === "mm" ? "font-mm" : ""}`}>
              {t(
                "ခေတ်ရေစီးကြောင်းနှင့် အလိုက်ဖက်ဆုံး၊ ချစ်စရာအကောင်းဆုံး ဝတ်စုံဒီဇိုင်းများကိုသာ သင့်အတွက် စိတ်ကြိုက်ရွေးချယ်ပေးသည်။",
                "Curating combinations that represent the modern Myanmar lifestyle — stylish, comfortable, and beautifully simple."
              )}
            </p>
          </div>

          <div className={`p-8 rounded-3xl border ${cardBg} transition-all duration-300 hover:shadow-editorial`}>
            <div className="w-10 h-10 rounded-full bg-pink/15 flex items-center justify-center mb-5">
              <Shield className="w-5 h-5 text-pink" />
            </div>
            <h3 className={`font-serif text-lg font-bold mb-3 ${textMain}`}>
              {t("ယုံကြည်စိတ်ချရမှု", "Sustainability")}
            </h3>
            <p className={`text-xs leading-relaxed ${textMuted} ${lang === "mm" ? "font-mm" : ""}`}>
              {t(
                "သဘာဝပတ်ဝန်းကျင်ကို ထိခိုက်မှု အနည်းဆုံးဖြစ်စေမည့် သဘာဝချည်သားနှင့် ဂေဟစနစ်သဟဇာတဖြစ်သော ပိတ်စများကို ဦးစားပေး သုံးစွဲသည်။",
                "Prioritizing organic linen, pure cotton, and eco-friendly packaging to ensure fashion that respects the earth."
              )}
            </p>
          </div>
        </div>

        {/* Gallery Showcase */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-4 h-4 text-pink" />
            <h2 className={`font-serif text-2xl uppercase tracking-wider ${textMain}`}>
              {t("ဒီဇိုင်းအမြင်များ", "DESIGN DIARY")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PHOTOS.map((p, idx) => (
              <motion.div
                key={p.src}
                className={`group rounded-3xl overflow-hidden border ${cardBg} cursor-pointer shadow-sm hover:shadow-editorial transition-all duration-300`}
                whileHover={{ y: -4 }}
                onClick={() => setLightbox(idx)}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-bg-mid">
                  <img
                    src={p.src}
                    alt={p.title_en}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-white text-xs inline-flex items-center gap-1.5 font-medium">
                      <Eye className="w-3.5 h-3.5" /> {t("အကျယ်ကြည့်ရန်", "View Details")}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className={`font-serif text-base font-bold ${textMain}`}>
                    {lang === "mm" ? p.title_mm : p.title_en}
                  </h3>
                  <p className={`text-[11px] mt-1.5 line-clamp-2 ${textMuted} ${lang === "mm" ? "font-mm" : ""}`}>
                    {lang === "mm" ? p.desc_mm : p.desc_en}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Story Section */}
        <section className={`rounded-[32px] p-8 sm:p-12 border ${cardBg} grid md:grid-cols-12 gap-8 items-center`}>
          <div className="md:col-span-5 aspect-[4/5] rounded-2xl overflow-hidden bg-bg-mid shadow-editorial">
            <img
              src="/founder/IMG_2938.JPG"
              alt="Founder of Sinar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-5 h-px bg-pink" />
              <span className="editorial-label text-pink text-[9px] uppercase tracking-[0.2em]">
                {t("တည်ထောင်သူ၏ စကားလွှာ", "FOUNDER'S NOTE")}
              </span>
            </div>
            <h2 className={`font-serif text-3xl font-bold leading-none ${textMain}`}>
              {t("လှပသော နေ့ရက်များစွာကို", "To More Beautiful Days, ")}<br />
              <span className="italic text-coral">{t("အတူတူ ဖြတ်သန်းစို့", "Together with Sinar")}</span>
            </h2>
            <div className={`space-y-4 text-xs leading-relaxed ${textMuted} ${lang === "mm" ? "font-mm" : ""}`}>
              <p>
                {t(
                  "မင်္ဂလာပါရှင်! Sinar ကို စတင်တည်ထောင်ရခြင်း ရည်ရွယ်ချက်ကတော့ အမျိုးသမီးတိုင်း မိမိဝတ်ဆင်ထားတဲ့ ဝတ်စုံလေးကြောင့် ယုံကြည်မှုရှိရှိနဲ့ တစ်နေ့တာကို ပျော်ပျော်ရွှင်ရွှင် ဖြတ်သန်းနိုင်ဖို့ပဲ ဖြစ်ပါတယ်။",
                  "Hello and welcome! Sinar was born from a simple dream: to offer fashion choices that empower women to embrace their unique charm and live their days with absolute confidence."
                )}
              </p>
              <p>
                {t(
                  "ကျွန်မတို့ ရွေးချယ်ဖန်တီးထားတဲ့ Collection တိုင်းမှာ အရည်အသွေးမြင့် ပိတ်စများ၊ သေသပ်လှပတဲ့ ချုပ်ရိုးချုပ်သားများနှင့် ဝတ်ဆင်သူတိုင်း ချစ်စရာကောင်းနေစေမည့် စတိုင်လ်များကို အထူးဂရုပြု စိစစ်ဖန်တီးထားပါသည်။",
                  "In every collection we design and curate, we pay supreme attention to detail. This includes sourcing high-grade textiles, guaranteeing premium stitches, and picking silhouettes that bring out your natural cuteness."
                )}
              </p>
            </div>
            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href={SITE.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pill text-xs inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> {t("ဆက်သွယ်စကားပြောရန်", "Send DM on Facebook")}
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center bg-[#0F2415] rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.08)]"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              {/* Photo */}
              <div className="aspect-[3/4] overflow-hidden bg-black">
                <img
                  src={PHOTOS[lightbox].src}
                  alt={PHOTOS[lightbox].title_en}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Info */}
              <div className="p-8 sm:p-10 space-y-6 text-white">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-px bg-pink" />
                  <span className="text-pink text-[9px] uppercase tracking-widest font-semibold">
                    {t("ဒီဇိုင်းမှတ်တမ်း", "PIECE DETAILS")}
                  </span>
                </div>
                <h3 className="font-serif text-3xl font-bold">
                  {lang === "mm" ? PHOTOS[lightbox].title_mm : PHOTOS[lightbox].title_en}
                </h3>
                <p className="text-xs text-cream/70 font-semibold leading-relaxed">
                  {lang === "mm" ? PHOTOS[lightbox].title_en : PHOTOS[lightbox].title_mm}
                </p>
                <p className={`text-sm leading-relaxed text-cream/60 ${lang === "mm" ? "font-mm" : ""}`}>
                  {lang === "mm" ? PHOTOS[lightbox].desc_mm : PHOTOS[lightbox].desc_en}
                </p>
                
                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => setLightbox((prev) => (prev !== null && prev > 0 ? prev - 1 : PHOTOS.length - 1))}
                    className="px-4 py-2 border border-white/20 rounded-full text-xs hover:bg-white/10 transition-colors"
                  >
                    {t("ယခင်", "Previous")}
                  </button>
                  <button
                    onClick={() => setLightbox((prev) => (prev !== null && prev < PHOTOS.length - 1 ? prev + 1 : 0))}
                    className="px-4 py-2 border border-white/20 rounded-full text-xs hover:bg-white/10 transition-colors"
                  >
                    {t("နောက်တစ်ခု", "Next")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  )
}

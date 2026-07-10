import { motion } from "framer-motion"
import { useLang } from "@/lib/lang"
import { useTheme } from "@/lib/theme"

const CARDS = [
  {
    en: "Curated Picks",
    mm: "ရွေးချယ်ထားသော",
    bodyEn: "Every piece is hand-picked for quality, fit and that little bit of charm. No filler — just outfits worth wearing.",
    bodyMm: "ဝတ်စုံတိုင်းကို အရည်အသွေး၊ အံဝင်ခွင်ကျနှင့် လှပမှုအတွက် တည်ထောင်သူကိုယ်တိုင် ဂရုတစိုက် ရွေးချယ်ထားပါတယ်။",
  },
  {
    en: "Order via DM",
    mm: "DM ဖြင့် မှာယူ",
    bodyEn: "See something you love? Message us on Messenger or Viber and we'll sort your order in minutes.",
    bodyMm: "ကြိုက်နှစ်သက်သည့် ဝတ်စုံတွေ့ရှိပါက Messenger သို့မဟုတ် Viber မှတစ်ဆင့် စာပို့၍ လွယ်ကူစွာ မှာယူနိုင်ပါသည်။",
  },
  {
    en: "Yangon Delivery",
    mm: "ရန်ကုန် ပို့ဆောင်",
    bodyEn: "Fast, careful delivery across Yangon — and beautifully packed, because unboxing should feel special too.",
    bodyMm: "ရန်ကုန်တစ်ဝှမ်း မြန်ဆန်စိတ်ချစွာ ပို့ဆောင်ပေးပြီး လက်ဆောင်ရသကဲ့သို့ လှပသေသပ်စွာ ထုပ်ပိုးပေးပါသည်။",
  },
]

export default function Features() {
  const { t, lang } = useLang()
  const { isDark } = useTheme()

  const textPrimary = isDark ? "text-cream" : "text-plum"
  const textMuted = isDark ? "text-[#7A8F7D]" : "text-[#3D5A45]"
  const cardBg = isDark ? "bg-[#0F2415] border-[rgba(255,255,255,0.06)]" : "bg-white border-[rgba(45,90,61,0.08)]"

  return (
    <section className={`py-24 lg:py-32 ${isDark ? "bg-[#0A1A0F]" : "bg-[#FAF6EF]"}`}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-5 h-px bg-pink" />
            <span className="editorial-label text-pink text-[10px] tracking-[0.25em] font-semibold">
              {t("ကျွန်မတို့၏ စံနှုန်းများ", "SINAR STANDARDS")}
            </span>
            <span className="w-5 h-px bg-pink" />
          </div>
          <h2 className={`font-serif text-3xl sm:text-5xl leading-tight font-black ${textPrimary}`}>
            {t("စိတ်ချယုံကြည်စွာ ဝယ်ယူနိုင်ရန် ", "Designed to make you ")}
            <span className="italic text-coral">{t("ဖန်တီးပေးထားပါသည်", "feel special.")}</span>
          </h2>
        </motion.div>

        {/* Index List - Horizontal grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <motion.div
              key={c.en}
              className={`relative rounded-[32px] border ${cardBg} p-8 shadow-sm transition-all duration-300 hover:shadow-editorial hover:border-pink/40 group`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Gold border decorative angle corner */}
              <div className="absolute top-4 left-4 w-4 h-4 border-l border-t border-pink/20 rounded-tl-lg group-hover:border-pink/50 transition-colors duration-300" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-r border-b border-pink/20 rounded-br-lg group-hover:border-pink/50 transition-colors duration-300" />

              <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-pink text-pink font-mono text-base font-bold bg-pink/5">
                0{i + 1}
              </span>
              <h3 className={`mb-3 text-2xl font-bold ${textPrimary} ${lang === "mm" ? "font-mm" : "font-serif"}`}>
                {t(c.mm, c.en)}
              </h3>
              <p className={`text-xs leading-relaxed ${textMuted} ${lang === "mm" ? "font-mm" : ""}`}>
                {t(c.bodyMm, c.bodyEn)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

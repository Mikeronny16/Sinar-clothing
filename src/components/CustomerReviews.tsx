import { motion, type Variants } from "framer-motion"
import { useLang } from "@/lib/lang"
import { useTheme } from "@/lib/theme"

const REVIEWS = [
  {
    id: 1,
    nameMm: "မေမြတ်နိုး",
    nameEn: "May Myat Noe",
    rating: 5,
    textMm: "ဝတ်စုံလေးက အရမ်းချစ်စရာကောင်းပါတယ်။ Quality ကောင်းပြီး ဈေးနှုန်းလည်း သင့်တော်ပါတယ်။ နောက်တစ်ကြိမ်ထပ်မှာမယ်ကွာ!",
    textEn: "The clothing is absolutely adorable. Great quality and very reasonable price. Will order again!",
    location: "Yangon",
    initials: "MN",
    color: "#FF1F6E",
  },
  {
    id: 2,
    nameMm: "သူဇာမြင့်",
    nameEn: "Thu Za Myint",
    rating: 5,
    textMm: "Sinar Clothing ရဲ့ cardigan လေးတွေ အရမ်းကြိုက်တယ်။ Delivery မြန်ပြီး packaging လည်း လှပတယ်ဟာ။",
    textEn: "Love Sinar's cardigans so much. Fast delivery and beautiful packaging too!",
    location: "Mandalay",
    initials: "TZ",
    color: "#2D5A3D",
  },
  {
    id: 3,
    nameMm: "ဆုမြတ်ဝင်း",
    nameEn: "Su Myat Win",
    rating: 5,
    textMm: "DM ဖြင့် မှာယူတာ ရိုးရှင်းလွယ်ကူပြီး customer service ကောင်းမွန်ပါတယ်။ ဝတ်စုံတွေ အရည်အသွေး အရမ်းကောင်းပါတယ်!",
    textEn: "Ordering via DM is so easy and customer service is excellent. Clothing quality is outstanding!",
    location: "Naypyidaw",
    initials: "SW",
    color: "#7C3AED",
  },
  {
    id: 4,
    nameMm: "ဝင်းမြတ်ထွေး",
    nameEn: "Win Myat Thwe",
    rating: 5,
    textMm: "ဒီ dress လေးကို ဝတ်ပြီး event တက်တော့ အားလုံး ချီးမွမ်းကြတယ်။ Sinar ကို ချစ်တယ်!",
    textEn: "Wore this dress to an event and everyone complimented me. Love Sinar!",
    location: "Yangon",
    initials: "WT",
    color: "#D97706",
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < count ? "text-pink fill-pink" : "text-[#7A8F7D] fill-[#7A8F7D]/30"}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
}

export default function CustomerReviews() {
  const { t, lang } = useLang()
  const { isDark } = useTheme()

  const bgSection = isDark ? "bg-[#0F2415]" : "bg-[#F2EDE4]"
  const bgCard = isDark ? "bg-[#122B19]" : "bg-white"
  const border = isDark ? "border-[rgba(255,255,255,0.06)]" : "border-[rgba(45,90,61,0.10)]"
  const textMain = isDark ? "text-[#F5F0E8]" : "text-[#1A2E1F]"
  const textMuted = isDark ? "text-[#7A8F7D]" : "text-[#3D5A45]"

  return (
    <section className={`py-24 lg:py-32 ${bgSection} grain-texture`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="w-8 h-px bg-pink" />
            <span className="editorial-label text-pink">{t("ဝယ်သူများ", "CUSTOMERS")} · REVIEWS</span>
            <span className="w-8 h-px bg-pink" />
          </motion.div>

          <motion.h2
            className={`font-serif text-4xl sm:text-5xl leading-tight ${textMain}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {t("ဝယ်သူများ", "What Our")}{" "}
            <span className="italic text-pink">{t("ပြောသောစကား", "Customers Say")}</span>
          </motion.h2>

          {/* Overall rating badge */}
          <motion.div
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full bg-pink/10 border border-pink/20"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <StarRating count={5} />
            <span className="text-pink text-sm font-bold">5.0</span>
            <span className={`editorial-label text-[9px] ${textMuted}`}>
              {t("ဘာသာဖြင့် အဆင့်သတ်မှတ်", "AVERAGE RATING")}
            </span>
          </motion.div>
        </div>

        {/* Review cards — stagger */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.id}
              variants={cardVariants}
              className={`${bgCard} border ${border} rounded-2xl p-5 flex flex-col gap-4 hover:shadow-editorial transition-shadow duration-500 ${
                i % 2 === 0 ? "sm:mt-0" : "sm:mt-6"
              }`}
            >
              {/* Quote mark */}
              <div className="text-5xl leading-none font-serif text-pink/20 select-none -mb-2">"</div>

              {/* Review text — pull-quote style */}
              <p className={`editorial-pull-quote text-sm leading-relaxed ${textMain}`}>
                {lang === "mm" ? r.textMm : r.textEn}
              </p>

              {/* Rating */}
              <StarRating count={r.rating} />

              {/* Customer info */}
              <div className="flex items-center gap-3 pt-2 border-t border-[var(--color-border)]">
                {/* Avatar circle with initials */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: r.color }}
                >
                  {r.initials}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${lang === "mm" ? "font-mm" : ""} ${textMain}`}>
                    {lang === "mm" ? r.nameMm : r.nameEn}
                  </p>
                  <p className={`editorial-label text-[9px] ${textMuted}`}>{r.location}</p>
                </div>
                <div className="ml-auto flex-shrink-0">
                  <span className="text-pink text-xs font-bold font-serif">{r.rating}.0</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <p className={`font-mm text-sm ${textMuted} mb-4`}>
            {t(
              "သင်လည်း Sinar Clothing ကို ကြိုက်ပါသလား? Facebook မှ Review တင်ပေးပါ!",
              "Love Sinar Clothing? Leave us a review on Facebook!"
            )}
          </p>
          <a
            href="https://www.facebook.com/share/14anQs8AyMd/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-pink border border-pink/30 hover:bg-pink hover:text-white px-6 py-2.5 rounded-full transition-all duration-300"
          >
            {t("Facebook တွင် Review ရေးပေးရန်", "Write a Review on Facebook")}
          </a>
        </motion.div>
      </div>
    </section>
  )
}

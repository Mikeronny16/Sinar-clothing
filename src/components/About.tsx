import { motion } from "framer-motion"
import { SITE } from "@/config"

const IMG = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"

export default function About() {
  return (
    <section id="about" className="py-24 lg:py-36 bg-forest-mid">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-forest">
              <img src={IMG} alt="Sinar Clothing" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent" />
            </div>
            {/* Decorative border */}
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl border border-pink/20 -z-10" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-[10px] tracking-[0.5em] text-pink uppercase mb-4 font-medium">
              About Us
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-cream mb-6">
              ကျွန်မတို့<br />
              <span className="italic text-gradient-emerald">ဘာလဲ?</span>
            </h2>
            <div className="space-y-4 font-mm text-muted text-sm sm:text-base leading-loose">
              <p>
                <span className="text-cream font-semibold">{SITE.name}</span> ဆိုသည်မှာ မြန်မာ့ အမျိုးသမီးများအတွက် ချစ်စရာ၊ ကြည်နူးဖွယ် ဝတ်စုံများကို ရွေးချယ်ပေးနေသော fashion brand တစ်ခုဖြစ်သည်။
              </p>
              <p>
                Quality မြင့်မားပြီး ဈေးနှုန်း သင့်တော်သော ဝတ်စုံများကို မြန်မာနိုင်ငံ အနှံ့ ဖြေဆင်းပေးနေပါသည်။
              </p>
              <p>
                ၂၀၂၅ ခုနှစ် Collection အသစ်များ မကြာမီ ထွက်ပေါ်လာမည်ဖြစ်ပါသည်။ Facebook Page ကို Follow လုပ်၍ Update များ မကျန်ပစ်ပါနဲ့ 🌿
              </p>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { num: "100+", mm: "ဝတ်စုံ", en: "Items" },
                { num: "5★", mm: "အဆင့်", en: "Rating" },
                { num: "24h", mm: "DM Reply", en: "Response" },
              ].map((stat) => (
                <div key={stat.en} className="text-center">
                  <p className="font-serif text-3xl font-bold text-pink">{stat.num}</p>
                  <p className="font-mm text-xs text-muted mt-1">{stat.mm}</p>
                  <p className="text-[9px] text-muted/50 uppercase tracking-wider">{stat.en}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

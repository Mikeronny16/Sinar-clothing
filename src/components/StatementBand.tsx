import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useLang } from "@/lib/lang"

// Full-bleed cinematic statement: parallax lifestyle photo + giant ghost serif
const IMG = "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1700&q=80"

export default function StatementBand() {
  const { t } = useLang()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const imgY = useTransform(scrollYProgress, [0, 1], ["-18%", "18%"])
  const textX = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"])

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#14110c]">
      {/* Parallax image (taller than section so it can drift) */}
      <motion.img
        src={IMG}
        alt=""
        style={{ y: imgY }}
        className="absolute -inset-y-[18%] inset-x-0 h-[136%] w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#14110c]/65" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#14110c] via-transparent to-[#14110c]/60" />

      <div className="relative py-32 sm:py-52 px-5 text-center">
        {/* Drifting giant ghost serif */}
        <motion.h2
          style={{ x: textX, fontFamily: '"Playfair Display", Georgia, serif' }}
          className="mx-auto whitespace-nowrap text-[16vw] font-bold leading-none tracking-tight sm:text-[13vw]"
        >
          <span
            style={{
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(243,238,228,0.7)",
            }}
          >
            {t("ဝတ်ဆင်ပြီး လှလိုက်ပါ", "GET DRESSED")}
          </span>
        </motion.h2>

        <motion.p
          className="mx-auto mt-8 max-w-md text-sm font-medium tracking-wide text-[#F3EEE4]/85 sm:text-base"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t(
            "ချစ်စရာ ဝတ်စုံလေးတွေနဲ့ နေ့တိုင်းကို လှပစေဖို့။",
            "Curated little outfits to make every day feel like something.",
          )}
        </motion.p>

        <motion.a
          href="#shop"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-9 inline-flex pill"
          style={{ background: "#C28773", color: "#14110c" }}
        >
          {t("ဆိုင်သို့ ဝင်ရန်", "Enter the Shop")}
        </motion.a>
      </div>
    </section>
  )
}

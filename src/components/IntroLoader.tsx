import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const SERIF = '"Playfair Display", "Lora", Georgia, serif'
const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]

// Editorial intro: bone curtain, "Sinar" letters rise out of a mask, a
// terracotta hairline draws across, then the whole curtain lifts away.
export default function IntroLoader() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    document.documentElement.style.overflow = "hidden"
    const t = setTimeout(() => {
      setDone(true)
      document.documentElement.style.overflow = ""
    }, 2600)
    return () => {
      clearTimeout(t)
      document.documentElement.style.overflow = ""
    }
  }, [])

  const letters = "Sinar".split("")

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#F3EEE4]"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: EASE }}
          aria-hidden
        >
          {/* kicker */}
          <motion.p
            className="mb-5 text-[10px] uppercase tracking-[0.5em] text-[#1A1611]/45"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            Myanmar Atelier
          </motion.p>

          {/* wordmark — letters rise out of an overflow mask */}
          <div className="flex overflow-hidden pb-2">
            {letters.map((l, i) => (
              <motion.span
                key={i}
                className="text-[18vw] leading-none text-[#1A1611] sm:text-[9rem]"
                style={{ fontFamily: SERIF, fontWeight: 600 }}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.15 + i * 0.09, duration: 0.85, ease: EASE }}
              >
                {l}
              </motion.span>
            ))}
          </div>

          {/* terracotta hairline draws across */}
          <motion.div
            className="mt-6 h-px w-44 origin-left bg-[#C28773] sm:w-64"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1.0, ease: EASE }}
          />

          {/* tagline */}
          <motion.p
            className="font-mm mt-5 text-sm text-[#1A1611]/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.7 }}
          >
            ချစ်စရာ ဝတ်စုံလေးများ
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

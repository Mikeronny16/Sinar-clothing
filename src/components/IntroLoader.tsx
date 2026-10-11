import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const KEY = "sinar_splash_seen"

function seen() {
  try {
    return sessionStorage.getItem(KEY) === "1"
  } catch {
    return false
  }
}

// App splash: the logo settles in, the pink dot pops, and it gets out of the way.
// Once per visit — opening a second page shouldn't make anyone wait again.
export default function IntroLoader() {
  const [done, setDone] = useState(seen)

  useEffect(() => {
    if (done) return
    try {
      sessionStorage.setItem(KEY, "1")
    } catch {
      /* private mode */
    }
    const t = setTimeout(() => setDone(true), 1150)
    return () => clearTimeout(t)
  }, [done])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-k-cream"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          aria-hidden
        >
          <motion.p
            initial={{ opacity: 0, scale: 0.9, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="font-['Playfair_Display'] text-[56px] font-bold italic leading-none text-k-green"
          >
            Sinar
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 600, damping: 12 }}
              className="inline-block not-italic text-k-pink"
            >
              .
            </motion.span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-3 font-mm text-[12px] text-k-ink/45"
          >
            ချစ်စရာ ဝတ်စုံလေးများ
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

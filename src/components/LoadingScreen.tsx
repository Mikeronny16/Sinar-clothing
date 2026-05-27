import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(() => setVisible(false), 400)
          return 100
        }
        return p + 2
      })
    }, 25)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-forest flex flex-col items-center justify-center"
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Decorative corner lines */}
          <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-pink/30" />
          <div className="absolute top-8 right-8 w-12 h-12 border-r border-t border-pink/30" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-pink/30" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-pink/30" />

          {/* Center content */}
          <div className="text-center">
            <div className="overflow-hidden mb-2">
              <motion.h1
                className="font-serif text-7xl sm:text-9xl font-black tracking-[0.15em] text-cream"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
              >
                SINAR
              </motion.h1>
            </div>

            <motion.div
              className="h-px bg-gradient-to-r from-transparent via-pink to-transparent mb-4"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
            />

            <motion.p
              className="font-mm text-muted text-sm tracking-[0.3em] uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              MYANMAR FASHION
            </motion.p>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48">
            <div className="h-px bg-hairline overflow-hidden">
              <motion.div
                className="h-full bg-pink"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                style={{ transformOrigin: "left" }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <p className="text-center text-[10px] text-muted mt-2 font-mono">{progress}%</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

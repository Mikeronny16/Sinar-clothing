import { useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const EASE = [0.16, 1, 0.3, 1] as const

/** Dramatic scroll-reveal: rise + fade as it enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 44,
  className = "",
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Curtain reveal — headline wipes up from behind a mask. */
export function LineReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "110%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/** Vertical parallax drift tied to scroll position. */
export function Parallax({
  children,
  amount = 60,
  className = "",
}: {
  children: ReactNode
  amount?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount])
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}

/** Thin scroll-progress bar for the top of the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[70] h-[2px] origin-left"
      style={{ scaleX: scrollYProgress, background: "#C28773" }}
    />
  )
}

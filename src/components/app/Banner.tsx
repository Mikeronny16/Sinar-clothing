import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useLang } from "@/lib/lang"
import type { CatId } from "./categories"

type Slide = { img: string; pos: string; kicker: string; mm: string; en: string; sub: string; cat: CatId }

// The hand-painted plates from the film, reused as campaign banners.
const SLIDES: Slide[] = [
  { img: "/story/plate-08-knit.jpg", pos: "70% 40%", kicker: "NEW SEASON", mm: "ဆောင်းရာသီ အသစ်", en: "The cool season", sub: "The knit edit", cat: "knit" },
  { img: "/story/plate-02-lace.jpg", pos: "70% 40%", kicker: "LACE", mm: "ဇာ အလှလေးများ", en: "Soft lace", sub: "Bows, lace & square necks", cat: "tops" },
  { img: "/story/plate-03-denim.jpg", pos: "30% 40%", kicker: "DENIM", mm: "ကိုယ့် Jeans နဲ့ တွဲဝတ်", en: "With your own jeans", sub: "Vintage wash, flared", cat: "jeans" },
  { img: "/story/plate-04-night.jpg", pos: "70% 40%", kicker: "PARTY", mm: "ပွဲတက် ညဝတ်စုံ", en: "The night one", sub: "Off-shoulder & lace", cat: "dresses" },
]

const AUTO_MS = 4500

export default function Banner({ onPick }: { onPick: (cat: CatId) => void }) {
  const { t, lang } = useLang()
  const [[i, dir], setI] = useState<[number, number]>([0, 1])
  const dragging = useRef(false)
  const [paused, setPaused] = useState(false)

  const go = (d: number) => setI(([n]) => [(n + d + SLIDES.length) % SLIDES.length, d])

  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => go(1), AUTO_MS)
    return () => clearTimeout(id)
  }, [i, paused])

  const s = SLIDES[i]

  return (
    <div className="relative mx-5 h-[200px] overflow-hidden rounded-[22px] bg-k-green shadow-[0_12px_30px_-12px_rgba(31,61,43,0.45)]">
      <AnimatePresence initial={false} custom={dir}>
        <motion.button
          key={i}
          type="button"
          custom={dir}
          variants={{
            enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%" }),
            center: { x: 0 },
            exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%" }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 260, damping: 32 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragStart={() => {
            dragging.current = true
            setPaused(true)
          }}
          onDragEnd={(_, info) => {
            setPaused(false)
            if (info.offset.x < -50) go(1)
            else if (info.offset.x > 50) go(-1)
            setTimeout(() => (dragging.current = false), 0)
          }}
          onClick={() => !dragging.current && onPick(s.cat)}
          className="absolute inset-0 block text-left"
        >
          <motion.img
            src={s.img}
            alt=""
            draggable={false}
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: AUTO_MS / 1000 + 1, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: s.pos }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#12281b]/85 via-[#12281b]/35 to-transparent" />
          <motion.div
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="absolute bottom-5 left-5 right-24 text-white"
          >
            <p className="font-sans text-[10px] font-bold tracking-[0.25em] text-k-blush">{s.kicker}</p>
            <p className={`mt-1 text-[22px] font-bold leading-snug ${lang === "mm" ? "font-mm" : "font-sans"}`}>{t(s.mm, s.en)}</p>
            <p className="font-['Playfair_Display'] text-[15px] italic text-white/80">{s.sub}</p>
          </motion.div>
        </motion.button>
      </AnimatePresence>
      <div className="pointer-events-none absolute bottom-3.5 right-3.5 rounded-full bg-black/40 px-2.5 py-1 font-sans text-[11px] font-semibold text-white backdrop-blur">
        {i + 1} / {SLIDES.length}
      </div>
    </div>
  )
}

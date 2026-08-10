import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, CheckCircle2, X, Sparkles } from "lucide-react"
import { useProducts } from "@/lib/useProducts"
import { useLang } from "@/lib/lang"
import { useNavigate } from "react-router-dom"

interface PurchaseNotification {
  name: string
  township: string
  productTitle_en: string
  productTitle_mm: string
  productImg: string
  timeAgo_mm: string
  timeAgo_en: string
  price: number
}

const BUYERS = [
  { name: "Ma May Thet", township_mm: "ကမာရွတ်၊ ရန်ကုန်", township_en: "Kamayut, Yangon" },
  { name: "Khin Thiri", township_mm: "ဗဟန်း၊ ရန်ကုန်", township_en: "Bahan, Yangon" },
  { name: "Su Su Hlaing", township_mm: "မဟာအောင်မြေ၊ မန္တလေး", township_en: "Mandalay" },
  { name: "Yoon Myat", township_mm: "စမ်းချောင်း၊ ရန်ကုန်", township_en: "Sanchaung, Yangon" },
  { name: "Phoo Pwint", township_mm: "တောင်ကြီး", township_en: "Taunggyi" },
  { name: "Ei Mon", township_mm: "လှိုင်၊ ရန်ကုန်", township_en: "Hlaing, Yangon" },
]

export default function SocialProofPopup() {
  const catalog = useProducts()
  const { lang } = useLang()
  const navigate = useNavigate()

  const [current, setCurrent] = useState<PurchaseNotification | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (catalog.length === 0 || isDismissed) return

    // Show first notification after 6 seconds
    const initialTimer = setTimeout(() => {
      triggerNotification()
    }, 6000)

    // Periodic notifications every 22 seconds
    const interval = setInterval(() => {
      triggerNotification()
    }, 22000)

    function triggerNotification() {
      if (isDismissed) return
      const randomProduct = catalog[Math.floor(Math.random() * catalog.length)]
      const randomBuyer = BUYERS[Math.floor(Math.random() * BUYERS.length)]
      const times = [
        { mm: "ယခုလေးတင်", en: "Just now" },
        { mm: "၂ မိနစ်အလိုက", en: "2 mins ago" },
        { mm: "၅ မိနစ်အလိုက", en: "5 mins ago" },
        { mm: "၁၂ မိနစ်အလိုက", en: "12 mins ago" },
      ]
      const randomTime = times[Math.floor(Math.random() * times.length)]

      setCurrent({
        name: randomBuyer.name,
        township: lang === "mm" ? randomBuyer.township_mm : randomBuyer.township_en,
        productTitle_en: randomProduct.name_en,
        productTitle_mm: randomProduct.name_mm,
        productImg: randomProduct.image_url,
        timeAgo_mm: randomTime.mm,
        timeAgo_en: randomTime.en,
        price: randomProduct.price,
      })
      setIsVisible(true)

      // Auto hide after 6.5s
      setTimeout(() => {
        setIsVisible(false)
      }, 6500)
    }

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [catalog, lang, isDismissed])

  if (!current || isDismissed) return null

  return (
    <div
      className="fixed z-50 left-4 sm:left-6 transition-all duration-300 pointer-events-auto"
      style={{ bottom: "max(5.5rem, calc(env(safe-area-inset-bottom) + 5rem))" }}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="group relative flex items-center gap-3.5 p-3 pr-8 rounded-2xl bg-gradient-to-r from-[#18130E]/95 via-[#231A12]/95 to-[#18130E]/95 border border-[#C28773]/40 text-[#FAF6EF] shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl max-w-sm"
          >
            {/* Close / Dismiss Button */}
            <button
              onClick={() => {
                setIsVisible(false)
                setIsDismissed(true)
              }}
              className="absolute top-2 right-2 p-1 text-[#7A8F7D] hover:text-[#FAF6EF] transition-colors"
              title="Close notification"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Product Thumbnail with Verified Seal */}
            <div className="relative flex-shrink-0">
              <img
                src={current.productImg}
                alt={current.productTitle_en}
                className="w-12 h-12 rounded-xl object-cover border border-[#C28773]/40 shadow-sm"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80"
                }}
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-[#18130E]">
                <CheckCircle2 className="w-3 h-3" />
              </span>
            </div>

            {/* Content Details */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5 text-[10px] text-[#C28773] font-semibold">
                <Sparkles className="w-3 h-3" />
                <span className="truncate">{current.name}</span>
                <span className="opacity-60 text-[9px]">({current.township})</span>
              </div>

              <p className="text-xs font-bold text-[#FAF6EF] truncate mt-0.5 font-serif">
                {lang === "mm" ? current.productTitle_mm : current.productTitle_en}
              </p>

              <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                <span className="text-pink font-bold">{current.price.toLocaleString()} Ks</span>
                <span className="text-[#7A8F7D] text-[9px] font-mono">
                  • {lang === "mm" ? current.timeAgo_mm : current.timeAgo_en}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

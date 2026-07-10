import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLang } from "@/lib/lang"
import { useTheme } from "@/lib/theme"
import { useCart } from "@/lib/cart"
import { Reveal } from "@/lib/motion"
import { Sparkles, Plus, Check } from "lucide-react"

const SERIF = '"Playfair Display", "Lora", Georgia, serif'

// Product options for Mixer
const TOPS = [
  {
    id: "1",
    name_en: "Floral Linen Blouse",
    name_mm: "ပန်းပွင့်ပုံ Linen ရှပ်အကျီ",
    price: 18000,
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4b4956?w=600&q=80",
  },
  {
    id: "2",
    name_en: "Beige Knit Cardigan",
    name_mm: "Beige Knit ကာဒီဂင်",
    price: 25000,
    img: "https://images.unsplash.com/photo-1616150638538-3dc7b7d4adf1?w=600&q=80",
  },
  {
    id: "5",
    name_en: "Ivory Knit Sweater",
    name_mm: "Ivory Knit ဆွယ်တာ",
    price: 23000,
    img: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&q=80",
  },
]

const BOTTOMS = [
  {
    id: "4",
    name_en: "High Waist Jeans",
    name_mm: "High Waist ဂျင်းဘောင်းဘီ",
    price: 22000,
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80",
  },
  {
    id: "3",
    name_en: "Pastel Midi Dress",
    name_mm: "Pastel Midi ဝတ်စုံ",
    price: 28000,
    img: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&q=80",
  },
  {
    id: "6",
    name_en: "Flowy Maxi Dress",
    name_mm: "Flowy Maxi ဝတ်စုံ",
    price: 32000,
    img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
  },
]

export default function OutfitMixer() {
  const { t, lang } = useLang()
  const { isDark } = useTheme()
  const { add } = useCart()

  const [selectedTop, setSelectedTop] = useState(TOPS[0])
  const [selectedBottom, setSelectedBottom] = useState(BOTTOMS[0])
  const [added, setAdded] = useState(false)

  const textPrimary = isDark ? "text-[#FAF6F2]" : "text-[#1D2D23]"
  const textMuted = isDark ? "text-[#8C9C92]" : "text-[#4E6B5A]"
  const cardBg = isDark ? "bg-[#1D3F2C]/50 border-[rgba(255,255,255,0.06)]" : "bg-white/70 border-[rgba(194,135,115,0.12)]"

  const handleAddBundle = () => {
    // Add both selected top and bottom to the cart
    add({
      id: selectedTop.id,
      name_en: selectedTop.name_en,
      name_mm: selectedTop.name_mm,
      price: selectedTop.price,
      image_url: selectedTop.img,
    })
    add({
      id: selectedBottom.id,
      name_en: selectedBottom.name_en,
      name_mm: selectedBottom.name_mm,
      price: selectedBottom.price,
      image_url: selectedBottom.img,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const totalPrice = selectedTop.price + selectedBottom.price

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <Reveal className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-pink" />
            <span className="text-[11px] tracking-[0.4em] font-medium text-pink uppercase">
              {t("တွဲဖက်ဆန်းသစ်မှု", "Style Studio")}
            </span>
            <span className="w-8 h-px bg-pink" />
          </div>
          <h2 className={`text-4xl sm:text-6xl lg:text-7xl leading-[0.9] ${textPrimary}`} style={{ fontFamily: SERIF, fontWeight: 700 }}>
            Mix <span className="italic" style={{ color: "#C28773" }}>&amp; Match</span>
          </h2>
          <p className={`text-sm italic mt-3 ${textMuted}`} style={{ fontFamily: SERIF }}>
            {t("စိတ်ကြိုက် တွဲဖက်ဝတ်ဆင်ကြည့်ပါ", "Build your perfect outfit — pair a top with a bottom.")}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ── LEFT: Selectors (5 cols) ── */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Top Selector Card */}
            <div className={`p-5 rounded-[28px] border ${cardBg} space-y-4`}>
              <h3 className={`font-serif-fashion text-base font-bold italic ${textPrimary}`}>
                1. {t("အင်္ကျီ/ကာဒီဂင် ရွေးချယ်ရန်", "Choose a Top")}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {TOPS.map((item) => {
                  const active = selectedTop.id === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setSelectedTop(item); setAdded(false); }}
                      className={`relative aspect-[3/4] rounded-xl overflow-hidden border transition-all duration-300 ${
                        active ? "border-pink scale-102 shadow-md" : "border-pink/10 opacity-70 hover:opacity-90"
                      }`}
                    >
                      <img src={item.img} className="w-full h-full object-cover" alt={item.name_en} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[8px] font-bold text-white line-clamp-1">
                          {lang === "mm" ? item.name_mm : item.name_en}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Bottom Selector Card */}
            <div className={`p-5 rounded-[28px] border ${cardBg} space-y-4`}>
              <h3 className={`font-serif-fashion text-base font-bold italic ${textPrimary}`}>
                2. {t("ဘောင်းဘီ/ဂါဝန် ရွေးချယ်ရန်", "Choose a Bottom / Dress")}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {BOTTOMS.map((item) => {
                  const active = selectedBottom.id === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setSelectedBottom(item); setAdded(false); }}
                      className={`relative aspect-[3/4] rounded-xl overflow-hidden border transition-all duration-300 ${
                        active ? "border-pink scale-102 shadow-md" : "border-pink/10 opacity-70 hover:opacity-90"
                      }`}
                    >
                      <img src={item.img} className="w-full h-full object-cover" alt={item.name_en} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[8px] font-bold text-white line-clamp-1">
                          {lang === "mm" ? item.name_mm : item.name_en}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

          </div>

          {/* ── RIGHT: Outfit Canvas & Bundle Details (7 cols) ── */}
          <div className={`lg:col-span-7 rounded-[32px] border ${cardBg} p-6 sm:p-8 flex flex-col md:flex-row gap-8 justify-between items-center shadow-lg relative`}>
            
            {/* Visual Dressing Board */}
            <div className="w-full max-w-[280px] aspect-[4/5] relative border border-pink/10 rounded-2xl bg-white/40 dark:bg-forest-light/40 flex justify-center items-center overflow-hidden p-4 shadow-inner">
              
              {/* Virtual hanger wire */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-6 flex justify-around items-start">
                <svg className="w-6 h-6 text-pink/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12,20 C12,12 20,12 12,4 C12,4 6,6 12,12" />
                  <path d="M2,20 L22,20" />
                </svg>
              </div>

              {/* Stacked Preview */}
              <div className="relative w-full h-full flex flex-col justify-center items-center gap-2 pt-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTop.id}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    className="w-28 aspect-[3/4] rounded-xl overflow-hidden border border-pink/20 shadow-md relative z-10"
                  >
                    <img src={selectedTop.img} className="w-full h-full object-cover" alt="Top Selected" />
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedBottom.id}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    className="w-28 aspect-[3/4] rounded-xl overflow-hidden border border-pink/20 shadow-md relative z-0 mt-[-15px]"
                  >
                    <img src={selectedBottom.img} className="w-full h-full object-cover" alt="Bottom Selected" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Bundle details */}
            <div className="flex-1 w-full flex flex-col justify-between h-full space-y-6">
              
              {/* Summary Items list */}
              <div className="space-y-4">
                <h4 className={`text-[10px] tracking-[0.2em] font-bold text-pink font-serif-fashion uppercase`}>
                  {t("ရွေးချယ်ထားသော စတိုင်လ်", "SELECTED STYLE")}
                </h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-start border-b border-pink/10 pb-2">
                    <div>
                      <p className={`text-xs font-bold ${textPrimary}`}>
                        {lang === "mm" ? selectedTop.name_mm : selectedTop.name_en}
                      </p>
                      <span className="text-[10px] text-pink font-serif-fashion">Top</span>
                    </div>
                    <span className={`text-xs font-semibold text-pink`}>
                      {selectedTop.price.toLocaleString()} Ks
                    </span>
                  </div>

                  <div className="flex justify-between items-start border-b border-pink/10 pb-2">
                    <div>
                      <p className={`text-xs font-bold ${textPrimary}`}>
                        {lang === "mm" ? selectedBottom.name_mm : selectedBottom.name_en}
                      </p>
                      <span className="text-[10px] text-pink font-serif-fashion">Bottom / Dress</span>
                    </div>
                    <span className={`text-xs font-semibold text-pink`}>
                      {selectedBottom.price.toLocaleString()} Ks
                    </span>
                  </div>
                </div>
              </div>

              {/* Bundle Checkout Box */}
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-medium ${textMuted}`}>Total Bundle Price</span>
                  <span className={`text-lg font-black text-pink`}>
                    {totalPrice.toLocaleString()} Ks
                  </span>
                </div>

                <button
                  onClick={handleAddBundle}
                  className={`w-full py-3.5 rounded-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    added
                      ? "bg-emerald text-white"
                      : "bg-pink text-white shadow-md hover:opacity-90"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t("ထည့်ပြီးပါပြီ", "Added to Cart!")}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>{t("စတိုင်လ်တစ်ခုလုံး ဝယ်ယူမည်", "Add Bundle to Cart")}</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Sparkle decorator */}
            <div className="absolute top-4 right-4 text-pink/40 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}

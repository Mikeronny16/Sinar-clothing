import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface Props {
  open: boolean
  onClose: () => void
}

const steps = [
  {
    num: "01",
    mm: "ဝတ်စုံရွေးပါ",
    en: "Choose your item",
    desc: "ကြိုက်သော ဝတ်စုံ၏ 'မှာရန်' ကို နှိပ်ပါ",
  },
  {
    num: "02",
    mm: "DM ပို့ပါ",
    en: "Send a DM",
    desc: "Facebook Messenger, Viber သို့မဟုတ် WhatsApp မှ ဆက်သွယ်ပါ",
  },
  {
    num: "03",
    mm: "အသေးစိတ် ပြောပါ",
    en: "Provide details",
    desc: "အရောင်၊ Size နှင့် လိပ်စာ ပေးပို့ပါ",
  },
  {
    num: "04",
    mm: "ပေးချေပြီး စောင့်ပါ",
    en: "Pay & wait",
    desc: "ငွေပေးချေပြီး ၂-၃ ရက်အတွင်း ဖြေဆင်း၍ပေးပို့မည်",
  },
]

export default function OrderInstructions({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-4 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[101] w-auto sm:w-full sm:max-w-md bg-forest-mid border border-hairline rounded-t-3xl sm:rounded-3xl overflow-hidden"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif text-xl text-cream">မှာယူနည်း</h3>
                  <p className="text-xs text-muted mt-0.5">How to Order</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-forest hover:bg-forest-light text-muted hover:text-cream transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {steps.map((step, i) => (
                  <motion.div
                    key={step.num}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 + 0.1 }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink/10 border border-pink/30 flex items-center justify-center">
                      <span className="text-pink text-[10px] font-bold">{step.num}</span>
                    </div>
                    <div>
                      <p className="font-mm text-cream text-sm font-semibold">{step.mm}</p>
                      <p className="text-[10px] text-muted uppercase tracking-widest mb-0.5">{step.en}</p>
                      <p className="font-mm text-muted text-xs leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-forest border border-hairline">
                <p className="font-mm text-muted text-xs leading-relaxed text-center">
                  မေးစရာရှိရင် ၂၄ နာရီအတွင်း ပြန်ဆက်ပါမည် 🌿
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

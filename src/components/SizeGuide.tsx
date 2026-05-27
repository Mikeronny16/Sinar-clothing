import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useLang } from "@/lib/lang"
import { useTheme } from "@/lib/theme"

interface Props {
  open: boolean
  onClose: () => void
}

const SIZE_DATA = [
  {
    size: "S",
    bust: "80–84",
    waist: "60–64",
    hip: "86–90",
    height: "155–160",
  },
  {
    size: "M",
    bust: "86–90",
    waist: "66–70",
    hip: "92–96",
    height: "160–165",
  },
  {
    size: "L",
    bust: "92–96",
    waist: "72–76",
    hip: "98–102",
    height: "163–168",
  },
  {
    size: "XL",
    bust: "98–102",
    waist: "78–82",
    hip: "104–108",
    height: "165–170",
  },
]

export default function SizeGuide({ open, onClose }: Props) {
  const { t, lang } = useLang()
  const { isDark } = useTheme()

  const bgModal = isDark ? "bg-[#0F2415]" : "bg-[#FAF7F2]"
  const border = isDark ? "border-[rgba(255,255,255,0.08)]" : "border-[rgba(45,90,61,0.12)]"
  const textMain = isDark ? "text-[#F5F0E8]" : "text-[#1A2E1F]"
  const textMuted = isDark ? "text-[#7A8F7D]" : "text-[#3D5A45]"
  const thBg = isDark ? "bg-[#122B19]" : "bg-[#F2EDE4]"
  const trHover = isDark ? "hover:bg-[#122B19]" : "hover:bg-[#F2EDE4]"
  const tdBorder = isDark ? "border-[rgba(255,255,255,0.06)]" : "border-[rgba(45,90,61,0.08)]"

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className={`fixed inset-x-4 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[101] sm:w-full sm:max-w-lg ${bgModal} border ${border} rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-editorial-dark`}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-px bg-pink" />
                    <span className="editorial-label text-pink text-[9px]">
                      {t("အရွယ်အစားဇယား", "SIZE GUIDE")}
                    </span>
                  </div>
                  <h3 className={`font-serif text-2xl font-bold ${textMain}`}>
                    {t("အရွယ်အစား", "Size")} <span className="italic text-pink">{t("ဇယား", "Chart")}</span>
                  </h3>
                  <p className={`text-xs mt-1 ${textMuted} ${lang === "mm" ? "font-mm" : ""}`}>
                    {t("တိုင်းတာမှု cm ဖြင့်", "All measurements in cm")}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-full border transition-colors hover:border-pink/40 hover:text-pink ${
                    isDark
                      ? "border-[rgba(255,255,255,0.10)] text-[#7A8F7D]"
                      : "border-[rgba(45,90,61,0.15)] text-[#3D5A45]"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Table */}
              <div className={`rounded-xl overflow-hidden border ${border}`}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className={thBg}>
                      <th className={`px-4 py-3 text-left editorial-label text-[10px] ${textMuted} border-b ${tdBorder}`}>
                        {t("အရွယ်", "SIZE")}
                      </th>
                      <th className={`px-4 py-3 text-center editorial-label text-[10px] ${textMuted} border-b ${tdBorder}`}>
                        {t("ရင်ဝိုင်း", "BUST")}
                      </th>
                      <th className={`px-4 py-3 text-center editorial-label text-[10px] ${textMuted} border-b ${tdBorder}`}>
                        {t("허리", "WAIST")}
                      </th>
                      <th className={`px-4 py-3 text-center editorial-label text-[10px] ${textMuted} border-b ${tdBorder}`}>
                        {t("တင်ပဆုံ", "HIP")}
                      </th>
                      <th className={`px-4 py-3 text-center editorial-label text-[10px] ${textMuted} border-b ${tdBorder}`}>
                        {t("အရပ်", "HEIGHT")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SIZE_DATA.map((row, i) => (
                      <tr
                        key={row.size}
                        className={`${trHover} transition-colors duration-150 ${
                          i < SIZE_DATA.length - 1 ? `border-b ${tdBorder}` : ""
                        }`}
                      >
                        <td className="px-4 py-3.5">
                          <span className="font-serif text-base font-bold text-pink">{row.size}</span>
                        </td>
                        <td className={`px-4 py-3.5 text-center text-sm font-medium ${textMain}`}>
                          {row.bust}
                        </td>
                        <td className={`px-4 py-3.5 text-center text-sm font-medium ${textMain}`}>
                          {row.waist}
                        </td>
                        <td className={`px-4 py-3.5 text-center text-sm font-medium ${textMain}`}>
                          {row.hip}
                        </td>
                        <td className={`px-4 py-3.5 text-center text-sm font-medium ${textMain}`}>
                          {row.height}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tips */}
              <div className={`mt-5 p-4 rounded-xl border ${border} ${isDark ? "bg-[#122B19]/50" : "bg-[#F2EDE4]/80"}`}>
                <p className={`editorial-label text-[10px] text-pink mb-2`}>
                  {t("တိုင်းတာနည်းအကြံပြုချက်", "MEASUREMENT TIPS")}
                </p>
                <ul className={`space-y-1.5 text-xs ${textMuted} ${lang === "mm" ? "font-mm" : ""}`}>
                  <li>• {t("ရင်ဝိုင်း — ရင်ဘတ် အကျယ်ဆုံးနေရာ", "Bust — measure at the fullest part of your chest")}</li>
                  <li>• {t("허리 — 허리 가장 좁은 부분", "Waist — measure at the narrowest part of your waist")}</li>
                  <li>• {t("တင်ပဆုံ — တင်ပဆုံ အကျယ်ဆုံးနေရာ", "Hip — measure at the fullest part of your hips")}</li>
                  <li>• {t("မသေချာလျှင် size ကြီးကို ရွေးချယ်ပါ", "When between sizes, we recommend sizing up")}</li>
                </ul>
              </div>

              {/* CTA */}
              <p className={`mt-4 text-center text-xs ${textMuted} ${lang === "mm" ? "font-mm" : ""}`}>
                {t("မသေချာလျှင် DM မှ မေးနိုင်ပါသည်", "Still unsure? Message us on DM for help")}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

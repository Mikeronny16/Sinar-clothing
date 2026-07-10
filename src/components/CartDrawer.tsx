import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { useCart } from "@/lib/cart"
import { useLang } from "@/lib/lang"
import { FALLBACK_IMG } from "@/lib/products"

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, total, count, orderUrl, orderText, clear } = useCart()
  const { t } = useLang()

  const orderViaViber = async () => {
    try {
      await navigator.clipboard.writeText(orderText())
      toast.success(t("Order ကူးပြီး — Viber မှာ paste လုပ်ပါ", "Order copied — paste it in Viber"))
    } catch {
      /* clipboard may be blocked; still open Viber */
    }
    window.open(orderUrl(), "_blank", "noopener,noreferrer")
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-plum/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[71] flex h-full w-[88vw] max-w-md flex-col bg-bg text-text shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-plum/10 px-6 py-5">
              <h3 className="display text-xl uppercase">
                {t("စျေးခြင်း", "Your Bag")} <span className="text-coral">({count})</span>
              </h3>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-full p-1.5 hover:bg-plum/5">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <ShoppingBag className="h-10 w-10 text-plum/30" />
                <p className="text-sm text-text-muted">{t("စျေးခြင်း ဗလာဖြစ်နေပါတယ်", "Your bag is empty")}</p>
              </div>
            ) : (
              <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                {items.map((it) => (
                  <div key={`${it.id}-${it.size}-${it.color}`} className="flex gap-3">
                    <img
                      src={it.image_url || FALLBACK_IMG}
                      alt={it.name_en}
                      className="h-24 w-20 shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="truncate text-sm font-bold uppercase">{it.name_en}</p>
                      {(it.size || it.color) && (
                        <p className="text-xs text-text-muted">
                          {[it.size && `${t("အရွယ်", "Size")}: ${it.size}`, it.color && `${t("အရောင်", "Colour")}: ${it.color}`].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      <p className="mt-0.5 text-sm font-semibold text-coral">
                        {it.price > 0 ? `${(it.price * it.qty).toLocaleString()} ${t("ကျပ်", "Ks")}` : t("ဈေးမေးရန်", "Ask")}
                      </p>
                      <div className="mt-auto flex items-center gap-2">
                        <button onClick={() => setQty(it.id, it.size, it.color, it.qty - 1)} className="flex h-7 w-7 items-center justify-center rounded-full border border-plum/20 hover:bg-plum/5">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold">{it.qty}</span>
                        <button onClick={() => setQty(it.id, it.size, it.color, it.qty + 1)} className="flex h-7 w-7 items-center justify-center rounded-full border border-plum/20 hover:bg-plum/5">
                          <Plus className="h-3 w-3" />
                        </button>
                        <button onClick={() => remove(it.id, it.size, it.color)} aria-label="Remove" className="ml-auto text-plum/40 hover:text-coral">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={clear} className="text-xs text-text-muted underline hover:text-coral">
                  {t("အားလုံး ဖယ်ရှား", "Clear bag")}
                </button>
              </div>
            )}

            {/* Footer / checkout */}
            {items.length > 0 && (
              <div className="border-t border-plum/10 px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm uppercase tracking-wide text-text-muted">{t("စုစုပေါင်း", "Total")}</span>
                  <span className="display text-2xl">{total.toLocaleString()} {t("ကျပ်", "Ks")}</span>
                </div>
                <button onClick={orderViaViber} className="pill w-full">
                  {t("Viber ဖြင့် မှာမယ်", "Order via Viber")}
                </button>
                <p className="mt-2 text-center text-[11px] text-text-muted">
                  {t("Order စာသား ကူးထားပြီး Viber ဖွင့်ပေးပါမယ် — paste လုပ်လိုက်ပါ", "We copy your order & open Viber — just paste and send")}
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

import { useState } from "react"
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from "lucide-react"
import { useCart } from "@/lib/cart"
import { useLang } from "@/lib/lang"
import { viberLink } from "@/config"
import BottomSheet from "@/components/app/BottomSheet"
import { AppImage, ks } from "@/components/app/ProductTile"

/** The bag, as an app bottom sheet. Ordering = copy the order text, then open Viber. */
export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, total, count, orderText, clear } = useCart()
  const { t, lang } = useLang()
  const mm = lang === "mm" ? "font-mm" : "font-sans"
  const [copied, setCopied] = useState(false)

  // Viber links can't pre-fill a message — copy the order to the clipboard so the
  // customer just pastes it into the chat.
  const copyOrder = () => {
    navigator.clipboard?.writeText(orderText()).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 4000)
  }

  return (
    <BottomSheet open={open} onClose={() => setOpen(false)}>
      <div className={`flex items-baseline justify-between px-5 pb-3 ${mm}`}>
        <h3 className="text-[18px] font-bold text-k-ink">
          {t("အိတ်", "Your bag")} <span className="font-sans text-k-pink">{count}</span>
        </h3>
        {items.length > 0 && (
          <button type="button" onClick={clear} className="text-[12px] text-k-ink/40">
            {t("အားလုံး ဖယ်မယ်", "Clear all")}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className={`flex flex-col items-center px-8 pb-12 pt-6 text-center ${mm}`}>
          <div className="grid h-16 w-16 place-items-center rounded-full bg-k-blush">
            <ShoppingBag className="h-7 w-7 text-k-pink" strokeWidth={1.8} />
          </div>
          <p className="mt-4 text-[14px] font-semibold text-k-ink">{t("အိတ်ထဲ ဘာမှ မရှိသေးဘူး", "Your bag is empty")}</p>
          <p className="mt-1 text-[12.5px] text-k-ink/50">{t("ကြိုက်တဲ့ ဝတ်စုံ ရွေးပြီး ထည့်ကြည့်ပါ", "Pick something you love")}</p>
        </div>
      ) : (
        <>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5">
            {items.map((it) => (
              <div key={`${it.id}-${it.size}-${it.color}`} className="flex gap-3 rounded-2xl bg-k-cream p-2.5">
                <AppImage src={it.image_url} alt={it.name_en} className="h-[88px] w-[70px] shrink-0 rounded-xl" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start gap-2">
                    <p className={`min-w-0 flex-1 truncate text-[13px] font-semibold text-k-ink ${mm}`}>{t(it.name_mm, it.name_en)}</p>
                    <button type="button" onClick={() => remove(it.id, it.size, it.color)} aria-label="Remove" className="text-k-ink/30">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {(it.size || it.color) && (
                    <p className="font-sans text-[11.5px] text-k-ink/45">{[it.size, it.color].filter(Boolean).join(" · ")}</p>
                  )}
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setQty(it.id, it.size, it.color, it.qty - 1)} className="grid h-7 w-7 place-items-center rounded-full bg-white">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-4 text-center font-sans text-[13px] font-bold">{it.qty}</span>
                      <button type="button" onClick={() => setQty(it.id, it.size, it.color, it.qty + 1)} className="grid h-7 w-7 place-items-center rounded-full bg-white">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-sans text-[14px] font-bold text-k-ink">{it.price > 0 ? ks(it.price * it.qty) : t("ဈေးမေးရန်", "Ask")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`shrink-0 border-t border-k-ink/[0.06] px-5 pb-4 pt-4 ${mm}`}>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[13px] text-k-ink/50">{t("စုစုပေါင်း", "Total")}</span>
              <span className="font-sans text-[20px] font-bold text-k-ink">{ks(total)}</span>
            </div>
            <a
              href={viberLink()}
              onClick={copyOrder}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#7360F2] text-[14.5px] font-semibold text-white active:scale-[0.99]"
            >
              <MessageCircle className="h-[18px] w-[18px]" />
              {t("Viber ဖြင့် မှာမယ်", "Order on Viber")}
            </a>
            <p className="mt-2 text-center text-[11px] leading-relaxed text-k-ink/45">
              {copied
                ? t("Order စာသား copy ပြီးပါပြီ — chat ထဲမှာ paste လုပ်ပြီး ပို့ပေးပါ ✓", "Order copied — paste it into the chat and send ✓")
                : t("နှိပ်လိုက်ရင် order စာသားကို copy လုပ်ပေးမယ် — chat ထဲမှာ paste လုပ်ပါ", "Tapping copies your order — paste it into the chat")}
            </p>
          </div>
        </>
      )}
    </BottomSheet>
  )
}

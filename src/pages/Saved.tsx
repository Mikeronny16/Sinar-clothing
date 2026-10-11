import { Link } from "react-router-dom"
import { Heart } from "lucide-react"
import { useProducts } from "@/lib/useProducts"
import { useWishlist } from "@/lib/wishlist"
import { useLang } from "@/lib/lang"
import { AppFrame, AppHeader } from "@/components/app/AppShell"
import ProductTile from "@/components/app/ProductTile"

export default function Saved() {
  const all = useProducts()
  const { ids } = useWishlist()
  const { t, lang } = useLang()
  const mm = lang === "mm" ? "font-mm" : "font-sans"
  const items = all.filter((p) => ids.includes(String(p.id ?? p.name_en)))

  return (
    <AppFrame>
      <AppHeader title={t("သိမ်းထားသော", "Saved")} />

      {items.length > 0 ? (
        <>
          <p className={`px-5 pb-3 pt-1 text-[12px] text-k-ink/45 ${mm}`}>
            {items.length} {t("ထည် သိမ်းထားတယ်", "saved pieces")}
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-5">
            {items.map((p) => (
              <ProductTile key={p.id} p={p} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center px-8 pt-24 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-k-blush">
            <Heart className="h-9 w-9 text-k-pink" strokeWidth={1.8} />
          </div>
          <p className={`mt-5 text-[15px] font-semibold text-k-ink ${mm}`}>{t("သိမ်းထားတာ မရှိသေးဘူး", "Nothing saved yet")}</p>
          <p className={`mt-1.5 text-[12.5px] leading-relaxed text-k-ink/50 ${mm}`}>
            {t("ကြိုက်တဲ့ ဝတ်စုံမှာ ❤️ နှိပ်ပြီး ဒီမှာ သိမ်းထားနိုင်တယ်", "Tap the ❤️ on any piece to keep it here")}
          </p>
          <Link to="/shop" className={`mt-6 rounded-full bg-k-green px-6 py-3 text-[13px] font-semibold text-white ${mm}`}>
            {t("ဆိုင်ကြည့်မယ်", "Browse the shop")}
          </Link>
        </div>
      )}
    </AppFrame>
  )
}

import { Link } from "react-router-dom"
import { Heart } from "lucide-react"
import Shell from "@/components/Shell"
import ProductCard from "@/components/ProductCard"
import { useProducts } from "@/lib/useProducts"
import { useWishlist } from "@/lib/wishlist"
import { useLang } from "@/lib/lang"

export default function Saved() {
  const all = useProducts()
  const { ids } = useWishlist()
  const { t } = useLang()
  const items = all.filter((p) => ids.includes(String(p.id ?? p.name_en)))

  return (
    <Shell>
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="editorial-label text-coral">{t("သိမ်းထားသော", "SAVED")}</p>
        <h1 className="display mt-3 text-5xl uppercase sm:text-7xl">
          {t("နှစ်သက်ရာ", "Your")} <span className="text-coral">{t("ဝတ်စုံများ", "Wishlist")}</span>
        </h1>

        {items.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p, i) => (
              <ProductCard key={String(p.id ?? p.name_en)} p={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-4 rounded-[28px] border border-plum/10 bg-bg-mid py-20 text-center">
            <Heart className="h-10 w-10 text-plum/25" />
            <p className="font-mm text-sm text-text-muted">
              {t("နှစ်သက်တဲ့ ဝတ်စုံတွေကို ❤️ နှိပ်ပြီး ဒီမှာ သိမ်းထားနိုင်ပါတယ်", "Tap the ❤️ on any product to save it here.")}
            </p>
            <Link to="/shop" className="pill">{t("ဆိုင်ကြည့်မယ်", "Browse the shop")}</Link>
          </div>
        )}
      </section>
    </Shell>
  )
}

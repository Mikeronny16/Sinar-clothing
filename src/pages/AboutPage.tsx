import { Link } from "react-router-dom"
import { Sparkles, MessageCircle, MapPin } from "lucide-react"
import { useLang } from "@/lib/lang"
import { viberLink } from "@/config"
import { AppFrame, AppHeader } from "@/components/app/AppShell"

export default function AboutPage() {
  const { t, lang } = useLang()
  const mm = lang === "mm" ? "font-mm" : "font-sans"
  const rows = [
    { icon: Sparkles, mm: "တစ်ထည်ချင်း ရွေးထားတာ", en: "Every piece hand-picked", dmm: "သူကိုယ်တိုင် ကြိုက်တာမှ တင်တယ်", den: "Only what she would wear herself" },
    { icon: MessageCircle, mm: "Viber နဲ့ မှာ", en: "Order on Viber", dmm: "အိတ်ထဲထည့် → Viber မှာ paste", den: "Fill your bag, paste it into Viber" },
    { icon: MapPin, mm: "မြစ်ကြီးနားက ပို့တယ်", en: "Sent from Myitkyina", dmm: "ကချင်ပြည်နယ်နဲ့ မြို့ကြီးတွေဆီ ပို့ပေးတယ်", den: "Across Kachin State and to the big cities" },
  ]

  return (
    <AppFrame>
      <AppHeader back title={t("ဆိုင်အကြောင်း", "About")} />

      <div className="relative mx-5 h-[220px] overflow-hidden rounded-[22px] bg-k-green">
        <img src="/story/plate-06-her.jpg" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12281b]/85 to-transparent" />
        <p className="absolute bottom-5 left-5 font-['Playfair_Display'] text-[30px] font-bold italic text-white">
          Sinar<span className="not-italic text-k-pink">.</span>
        </p>
      </div>

      <p className={`px-5 pt-5 text-[14px] leading-relaxed text-k-ink/70 ${mm}`}>
        {t(
          "Sinar က မြန်မာ့ အမျိုးသမီးများအတွက် ချစ်စရာ၊ အရည်အသွေးမြင့် ဝတ်စုံလေးများကို ရွေးချယ်ပေးနေတဲ့ မြစ်ကြီးနားက boutique လေးတစ်ခုပါ။",
          "Sinar is a little Myitkyina boutique curating quality, charming outfits for the women of Myanmar — one lovely piece at a time.",
        )}
      </p>

      <div className="mt-6 space-y-2.5 px-5">
        {rows.map((r) => (
          <div key={r.en} className="flex items-center gap-3.5 rounded-2xl bg-white p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-k-blush text-k-pink">
              <r.icon className="h-[18px] w-[18px]" />
            </span>
            <div className={mm}>
              <p className="text-[13.5px] font-semibold text-k-ink">{t(r.mm, r.en)}</p>
              <p className="text-[12px] text-k-ink/50">{t(r.dmm, r.den)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`mt-7 flex gap-2.5 px-5 ${mm}`}>
        <Link to="/shop" className="grid h-12 flex-1 place-items-center rounded-2xl bg-k-green text-[14px] font-semibold text-white">
          {t("ဆိုင်ကြည့်မယ်", "Shop")}
        </Link>
        <a href={viberLink()} className="grid h-12 flex-1 place-items-center rounded-2xl bg-[#7360F2] text-[14px] font-semibold text-white">
          Viber
        </a>
      </div>
    </AppFrame>
  )
}

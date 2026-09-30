import { Link } from "react-router-dom"
import Shell from "@/components/Shell"
import About from "@/components/About"
import Features from "@/components/Features"
import { useLang } from "@/lib/lang"

export default function AboutPage() {
  const { t } = useLang()
  return (
    <Shell>
      <section className="mx-auto max-w-5xl px-5 text-center sm:px-8">
        <p className="editorial-label text-coral">{t("ကျွန်မတို့အကြောင်း", "OUR STORY")}</p>
        <h1 className="display mx-auto mt-4 max-w-3xl text-5xl uppercase leading-[0.95] sm:text-7xl">
          {t("ချစ်စရာ ", "Little outfits, ")}
          <span className="text-coral">{t("ဝတ်စုံလေးများ", "big joy.")}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl font-mm text-sm leading-relaxed text-text-sub">
          {t(
            "Sinar က မြန်မာ့ အမျိုးသမီးများအတွက် ချစ်စရာ၊ အရည်အသွေးမြင့် ဝတ်စုံလေးများကို ရွေးချယ်ပေးနေတဲ့ boutique တစ်ခုပါ။",
            "Sinar is a little Myitkyina boutique curating quality, charming outfits for the women of Myanmar — one lovely piece at a time."
          )}
        </p>
      </section>

      <div className="mt-16">
        <About />
        <Features />
      </div>

      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h2 className="display text-3xl uppercase sm:text-4xl">{t("ကြည့်ရအောင်", "Come have a look")}</h2>
        <Link to="/shop" className="pill mt-6">{t("ဆိုင်ကြည့်မယ်", "Shop the collection")}</Link>
      </div>
    </Shell>
  )
}

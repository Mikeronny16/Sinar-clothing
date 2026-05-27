import { motion } from "framer-motion"
import { Facebook, MessageCircle, Phone } from "lucide-react"
import { SITE } from "@/config"

export default function Footer() {
  return (
    <footer id="contact" className="bg-forest-mid border-t border-hairline">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-serif text-4xl font-black text-cream tracking-[0.15em] mb-4">
              SINAR
            </h3>
            <p className="font-mm text-muted text-sm leading-relaxed mb-2">{SITE.tagline}</p>
            <p className="font-mm text-muted text-sm leading-relaxed">
              ချစ်စရာ ဝတ်စုံလေးများကို ရွေးချယ်ဖန်တီးပေးနေသည်
            </p>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h4 className="text-cream text-xs font-semibold uppercase tracking-[0.4em] mb-5">
              Links
            </h4>
            <div className="space-y-3">
              {[
                { href: "#shop", mm: "ရောင်းပစ္စည်း", en: "Shop" },
                { href: "#about", mm: "ကျွန်မတို့", en: "About" },
                { href: "#contact", mm: "ဆက်သွယ်ရန်", en: "Contact" },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-3 text-muted hover:text-cream transition-colors group"
                >
                  <span className="w-4 h-px bg-hairline group-hover:bg-pink group-hover:w-6 transition-all duration-200" />
                  <span className="font-mm text-sm">{l.mm}</span>
                  <span className="text-[10px] text-muted/40">{l.en}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h4 className="text-cream text-xs font-semibold uppercase tracking-[0.4em] mb-5">
              ဆက်သွယ်ရန်
            </h4>
            <div className="space-y-4">
              <a
                href={SITE.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted hover:text-pink transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-forest border border-hairline flex items-center justify-center hover:border-pink/40">
                  <Facebook className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm">Facebook Page</span>
              </a>

              <a
                href={`https://m.me/${SITE.facebookPageId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted hover:text-pink transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-forest border border-hairline flex items-center justify-center">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                <span className="font-mm text-sm">Messenger DM</span>
              </a>

              {SITE.phone && SITE.phone !== "+959XXXXXXXXX" && (
                <a
                  href={`tel:${SITE.phone}`}
                  className="flex items-center gap-3 text-muted hover:text-pink transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-forest border border-hairline flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm">{SITE.phone}</span>
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-muted">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <a
            href="/admin"
            className="text-[11px] text-muted/30 hover:text-muted transition-colors"
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  )
}

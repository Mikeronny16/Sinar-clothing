import { motion } from "framer-motion"
import { Facebook, Phone } from "lucide-react"
import { Link } from "react-router-dom"
import { SITE, viberLink } from "@/config"

const SERIF = '"Playfair Display", "Lora", Georgia, serif'

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#161310] text-[#EFE9DD] overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        {/* Masthead rule */}
        <div className="flex items-center justify-between border-t border-[#EFE9DD]/15 pt-5 mb-16">
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#EFE9DD]/50">
            Sinar — Myanmar Atelier
          </span>
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#C28773]">Est. 2024</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-4xl mb-4 text-[#F5F0E8]" style={{ fontFamily: SERIF, fontWeight: 600 }}>
              Sinar
            </h3>
            <p className="font-mm text-sm leading-relaxed text-[#EFE9DD]/60 mb-2">{SITE.tagline}</p>
            <p className="font-mm text-sm leading-relaxed text-[#EFE9DD]/60">
              ချစ်စရာ ဝတ်စုံလေးများကို ရွေးချယ်ဖန်တီးပေးနေသည်
            </p>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h4 className="text-[10px] font-medium uppercase tracking-[0.4em] mb-5 text-[#EFE9DD]/50">
              Explore
            </h4>
            <div className="space-y-3">
              {[
                { href: "/shop", mm: "ရောင်းပစ္စည်း", en: "Shop", internal: true },
                { href: "/film", mm: "ဗီဒီယို", en: "Film", internal: true },
                { href: "/about", mm: "ကျွန်မတို့", en: "About", internal: true },
                { href: "#contact", mm: "ဆက်သွယ်ရန်", en: "Contact", internal: false },
              ].map((l) =>
                l.internal ? (
                  <Link
                    key={l.href}
                    to={l.href}
                    className="flex items-center gap-3 text-[#EFE9DD]/70 hover:text-[#F5F0E8] transition-colors group"
                  >
                    <span className="w-4 h-px bg-[#EFE9DD]/30 group-hover:bg-[#C28773] group-hover:w-7 transition-all duration-300" />
                    <span className="font-mm text-sm">{l.mm}</span>
                    <span className="text-[10px] text-[#EFE9DD]/30 uppercase tracking-widest">{l.en}</span>
                  </Link>
                ) : (
                  <a
                    key={l.href}
                    href={l.href}
                    className="flex items-center gap-3 text-[#EFE9DD]/70 hover:text-[#F5F0E8] transition-colors group"
                  >
                    <span className="w-4 h-px bg-[#EFE9DD]/30 group-hover:bg-[#C28773] group-hover:w-7 transition-all duration-300" />
                    <span className="font-mm text-sm">{l.mm}</span>
                    <span className="text-[10px] text-[#EFE9DD]/30 uppercase tracking-widest">{l.en}</span>
                  </a>
                ),
              )}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h4 className="text-[10px] font-medium uppercase tracking-[0.4em] mb-5 text-[#EFE9DD]/50">
              Connect
            </h4>
            <div className="space-y-4">
              <a
                href={SITE.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#EFE9DD]/70 hover:text-[#C28773] transition-colors"
              >
                <div className="w-8 h-8 rounded-full border border-[#EFE9DD]/15 flex items-center justify-center">
                  <Facebook className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm">Facebook Page</span>
              </a>

              <a
                href={viberLink()}
                className="flex items-center gap-3 text-[#EFE9DD]/70 hover:text-[#C28773] transition-colors"
              >
                <div className="w-8 h-8 rounded-full border border-[#EFE9DD]/15 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm">Viber {SITE.viber}</span>
              </a>

              {SITE.phone && SITE.phone !== "+959XXXXXXXXX" && (
                <a
                  href={`tel:${SITE.phone}`}
                  className="flex items-center gap-3 text-[#EFE9DD]/70 hover:text-[#C28773] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full border border-[#EFE9DD]/15 flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm">{SITE.phone}</span>
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Giant editorial wordmark */}
        <div className="mt-20 select-none pointer-events-none">
          <h2
            className="text-center leading-none text-[22vw] tracking-[0.04em]"
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              color: "transparent",
              WebkitTextStroke: "1px rgba(239,233,221,0.14)",
            }}
          >
            Sinar
          </h2>
        </div>

        {/* Bottom bar */}
        <div className="mt-4 pt-8 border-t border-[#EFE9DD]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#EFE9DD]/40">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <a
            href="/admin"
            className="text-[11px] text-[#EFE9DD]/25 hover:text-[#EFE9DD]/60 transition-colors"
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  )
}

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sun, Moon, ShoppingCart } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { SITE } from "@/config"
import Logo from "@/components/Logo"
import { useLang } from "@/lib/lang"
import { useTheme } from "@/lib/theme"
import { useCart } from "@/lib/cart"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang, toggle: toggleLang, t } = useLang()
  const { isDark, toggle: toggleTheme } = useTheme()
  const { count: cartCount, setOpen: setCartOpen } = useCart()
  const { pathname } = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  // Over the dark cinematic home hero (top, not scrolled) → use light nav
  const onDark = isDark || (pathname === "/" && !scrolled)

  const links = [
    { to: "/shop", label: t("ရောင်းပစ္စည်း", "Shop") },
    { to: "/film", label: t("ဗီဒီယို", "Film") },
    { to: "/about", label: t("ကျွန်မတို့", "About") },
    { to: "/portfolio", label: t("ဖန်တီးသူ", "Founder") },
    { to: "/saved", label: t("သိမ်းထားသော", "Saved") },
  ]

  return (
    <motion.header
      className={`fixed top-8 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-glass border-b border-[var(--color-glass-border)] shadow-editorial backdrop-blur-xl"
          : onDark
            ? "bg-gradient-to-b from-black/45 to-transparent"
            : "bg-transparent"
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity duration-300">
          {onDark ? (
            <Logo variant="dark" size="sm" />
          ) : (
            <img src="/logo-mark.png" alt="Sinar Clothing" className="h-11 w-auto" />
          )}
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors duration-200 hover:text-coral relative group ${
                onDark ? "text-cream/80" : "text-plum/80"
              }`}
            >
              <span className={lang === "mm" ? "font-mm" : ""}>{l.label}</span>
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-coral group-hover:w-full transition-all duration-300" />
            </Link>
          ))}

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Open bag"
            className={`relative rounded-full p-2 transition-colors ${onDark ? "text-cream/80 hover:text-coral" : "text-plum/80 hover:text-coral"}`}
          >
            <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={2} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[9px] font-bold text-cream">
                {cartCount}
              </span>
            )}
          </button>

          <a
            href={SITE.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative text-xs font-semibold px-5 py-2 rounded-full border border-pink text-pink hover:bg-pink hover:text-white transition-all duration-300 overflow-hidden group tracking-wide"
          >
            <span className="relative z-10">Facebook</span>
            <span className="absolute inset-0 bg-pink scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-full" />
          </a>

          {/* Controls group */}
          <div className="flex items-center gap-1">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest border transition-all duration-300 ${
                onDark
                  ? "border-cream/20 text-cream/60 hover:border-pink/40 hover:text-pink"
                  : "border-green-brand/20 text-green-brand/60 hover:border-pink hover:text-pink"
              }`}
              title="Toggle language"
            >
              {lang === "mm" ? "EN" : "MM"}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-all duration-300 ${
                onDark
                  ? "border-cream/20 text-cream/60 hover:border-yellow-400/40 hover:text-yellow-400"
                  : "border-green-brand/20 text-green-brand/60 hover:border-amber-500/40 hover:text-amber-500"
              }`}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </nav>

        {/* Mobile: controls + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleLang}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest border transition-all duration-300 ${
              onDark
                ? "border-cream/20 text-cream/60"
                : "border-green-brand/20 text-green-brand/60"
            }`}
          >
            {lang === "mm" ? "EN" : "MM"}
          </button>
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-full border transition-all duration-300 ${
              onDark ? "border-cream/20 text-cream/60" : "border-green-brand/20 text-green-brand/60"
            }`}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          <button
            className={`p-2 transition-colors ${onDark ? "text-cream hover:text-pink" : "text-green-brand hover:text-pink"}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile slide-in drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="md:hidden fixed inset-0 top-16 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              className={`md:hidden fixed top-16 right-0 bottom-0 w-72 z-50 flex flex-col border-l ${
                isDark
                  ? "bg-[#0A1A0F] border-cream/10"
                  : "bg-[#FAF6EF] border-green-brand/10"
              }`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              <div className="flex-1 py-8 px-6 flex flex-col gap-1">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMenuOpen(false)}
                    className={`py-4 border-b text-base font-medium transition-colors hover:text-coral ${
                      isDark ? "border-cream/10 text-cream/80" : "border-plum/10 text-plum/80"
                    } ${lang === "mm" ? "font-mm" : ""}`}
                  >
                    {l.label}
                  </Link>
                ))}

                <motion.a
                  href={SITE.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center bg-pink text-white text-sm font-semibold py-3.5 rounded-full tracking-wide"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  onClick={() => setMenuOpen(false)}
                >
                  Facebook Page
                </motion.a>
              </div>

              {/* Logo at bottom of drawer */}
              <div className="px-6 pb-8">
                <Logo variant={isDark ? "dark" : "light"} size="sm" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

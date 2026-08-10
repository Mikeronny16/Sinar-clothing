import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, X, Trash2, ShoppingBag, ArrowRight, Share2, Sparkles, MessageCircle } from "lucide-react"
import { useWishlist } from "@/lib/wishlist"
import { useProducts } from "@/lib/useProducts"
import { useCart } from "@/lib/cart"
import { useLang } from "@/lib/lang"
import { SITE, whatsappUrl } from "@/config"
import { toast } from "sonner"
import { Link } from "react-router-dom"

export const WISHLIST_OPEN_EVENT = "sinar_open_wishlist"

export function openWishlistDrawer() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(WISHLIST_OPEN_EVENT))
  }
}

export default function WishlistDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const { ids, toggle } = useWishlist()
  const catalog = useProducts()
  const { add: addToCart } = useCart()
  const { t, lang } = useLang()

  const savedItems = catalog.filter((p) => ids.includes(String(p.id ?? p.name_en)))
  const totalValue = savedItems.reduce((acc, p) => acc + (p.price || 0), 0)

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener(WISHLIST_OPEN_EVENT, handleOpen)
    return () => window.removeEventListener(WISHLIST_OPEN_EVENT, handleOpen)
  }, [])

  const handleAddAllToCart = () => {
    if (savedItems.length === 0) return

    savedItems.forEach((item) => {
      addToCart({
        id: String(item.id ?? item.name_en),
        name_mm: item.name_mm,
        name_en: item.name_en,
        price: item.price,
        image_url: item.image_url,
        size: "M",
      })
    })

    toast.success(
      lang === "mm"
        ? `ဝတ်စုံ ${savedItems.length} မျိုးကို ဈေးဝယ်ခြင်းထဲ ထည့်ပြီးပါပြီ! 🛍️`
        : `Added ${savedItems.length} items to your shopping bag! 🛍️`
    )
    setIsOpen(false)
  }

  const handleShareWishlist = () => {
    if (savedItems.length === 0) return

    const itemsText = savedItems
      .map((p, idx) => `${idx + 1}. ${p.name_en} (${p.price.toLocaleString()} Ks)`)
      .join("\n")

    const shareMessage = `🌸 *My Sinar Clothing Wishlist* 🌸\n\n${itemsText}\n\nTotal: ${totalValue.toLocaleString()} Ks\n\nWebsite: https://sinarclothing.com`
    
    if (navigator.share) {
      navigator.share({
        title: "My Sinar Clothing Wishlist",
        text: shareMessage,
        url: window.location.origin + "/saved",
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(shareMessage)
      toast.success("Wishlist link copied to clipboard! 📋")
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="absolute inset-y-0 right-0 max-w-md w-full bg-[#121913] border-l border-[#C28773]/30 shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#1C3020] flex items-center justify-between bg-[#0A1A0F]/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-pink/15 border border-pink/30 flex items-center justify-center text-pink">
                  <Heart className="w-5 h-5 fill-pink" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#F5F0E8] flex items-center gap-2">
                    {t("နှစ်သက်ရာ ဝတ်စုံများ", "Saved Wishlist")}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-pink/20 text-pink font-mono font-bold">
                      {savedItems.length}
                    </span>
                  </h3>
                  <p className="text-[10px] text-[#7A8F7D]">
                    {t("သိမ်းဆည်းထားသော အကြိုက်ဆုံးပစ္စည်းများ", "Your curated boutique collection")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {savedItems.length > 0 && (
                  <button
                    onClick={handleShareWishlist}
                    className="p-2 rounded-xl border border-[#1C3020] bg-[#0A1A0F] text-[#7A8F7D] hover:text-pink hover:border-pink/40 transition-colors"
                    title="Share Wishlist"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl border border-[#1C3020] bg-[#0A1A0F] text-[#7A8F7D] hover:text-[#F5F0E8] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
              {savedItems.length > 0 ? (
                savedItems.map((p) => (
                  <div
                    key={String(p.id ?? p.name_en)}
                    className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#0F2415] border border-[#1C3020] hover:border-[#C28773]/40 transition-all group"
                  >
                    <img
                      src={p.image_url}
                      alt={p.name_en}
                      className="w-16 h-16 rounded-xl object-cover border border-[#1C3020]"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80"
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#F5F0E8] truncate font-serif">
                        {lang === "mm" ? p.name_mm : p.name_en}
                      </h4>
                      <p className="text-[10px] text-[#7A8F7D] mt-0.5">{p.category}</p>
                      <p className="text-xs font-bold text-pink mt-1 font-mono">
                        {p.price.toLocaleString()} Ks
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => toggle(String(p.id ?? p.name_en))}
                        className="p-1.5 rounded-lg text-[#7A8F7D] hover:text-red-400 transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          addToCart({
                            id: String(p.id ?? p.name_en),
                            name_mm: p.name_mm,
                            name_en: p.name_en,
                            price: p.price,
                            image_url: p.image_url,
                            size: "M",
                          })
                          toast.success(`Added ${p.name_en} to bag! 🛍️`)
                        }}
                        className="px-2.5 py-1 rounded-lg bg-pink/20 hover:bg-pink text-pink hover:text-white text-[10px] font-bold transition-colors flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Bag</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-[#7A8F7D] space-y-3">
                  <div className="w-16 h-16 rounded-full bg-pink/10 border border-pink/20 flex items-center justify-center text-pink">
                    <Heart className="w-8 h-8 opacity-40" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F0E8]">Your Wishlist is Empty</h4>
                    <p className="text-xs mt-1 max-w-xs">
                      Tap the ❤️ heart icon on any outfit you love to save it here for later!
                    </p>
                  </div>
                  <Link
                    to="/shop"
                    onClick={() => setIsOpen(false)}
                    className="mt-2 px-5 py-2 rounded-full bg-pink text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Browse Collections
                  </Link>
                </div>
              )}
            </div>

            {/* Footer Summary & Action Bar */}
            {savedItems.length > 0 && (
              <div className="p-5 border-t border-[#1C3020] bg-[#0A1A0F]/90 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#7A8F7D]">Total Value ({savedItems.length} items):</span>
                  <span className="text-sm font-bold text-[#FAF6EF] font-mono">
                    {totalValue.toLocaleString()} Ks
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAddAllToCart}
                    className="py-2.5 rounded-xl bg-gradient-to-r from-pink to-coral text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:opacity-90"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add All to Bag</span>
                  </button>

                  <a
                    href={whatsappUrl(`Hello! I would like to order my saved wishlist (${savedItems.length} items, Total: ${totalValue.toLocaleString()} Ks)`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:opacity-90"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Order via WA</span>
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

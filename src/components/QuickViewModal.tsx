import { motion, AnimatePresence } from "framer-motion"
import { X, MessageCircle, Phone } from "lucide-react"
import { messengerUrl, viberUrl, whatsappUrl } from "@/config"
import type { Product } from "@/lib/supabase"
import { FALLBACK_IMG } from "@/lib/products"

interface Props {
  product: Product | null
  onClose: () => void
}

export default function QuickViewModal({ product: p, onClose }: Props) {
  if (!p) return null

  const dmUrl = messengerUrl(p.name_en)
  const vUrl = viberUrl(p.name_en)
  const waUrl = whatsappUrl(p.name_en)

  return (
    <AnimatePresence>
      {p && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[101] w-auto sm:w-full sm:max-w-lg bg-forest-mid border border-hairline rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-xl"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex flex-col sm:flex-row max-h-[90vh] sm:max-h-none">
              {/* Image */}
              <div className="relative aspect-[3/4] sm:aspect-auto sm:w-56 sm:flex-shrink-0 bg-forest overflow-hidden">
                <img
                  src={p.image_url || FALLBACK_IMG}
                  alt={p.name_en}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }}
                />
                {p.sold_out && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-pink text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 p-6 flex flex-col overflow-y-auto">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-xl text-cream">{p.name_mm}</h3>
                    <p className="text-xs text-muted mt-0.5">{p.name_en}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-forest hover:bg-forest-light text-muted hover:text-cream transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Price */}
                {p.price > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-muted uppercase tracking-widest mb-1">Price</p>
                    <p className="font-mm font-bold text-pink text-2xl">
                      {p.price.toLocaleString()} ကျပ်
                    </p>
                  </div>
                )}

                {/* Sizes */}
                <div className="mb-5">
                  <p className="text-xs text-muted uppercase tracking-widest mb-2">Sizes</p>
                  <div className="flex flex-wrap gap-2">
                    {p.sizes.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 rounded-full border border-hairline text-cream text-xs font-bold hover:border-pink hover:text-pink transition-colors cursor-default"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="mb-5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    p.sold_out ? "bg-red-500/20 text-red-400" :
                    p.status === "In Stock" ? "bg-emerald-dim text-emerald" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {p.sold_out ? "Sold Out" : p.status}
                  </span>
                </div>

                {/* Order buttons */}
                {!p.sold_out && (
                  <div className="mt-auto space-y-2.5">
                    <a
                      href={dmUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-pink text-white py-3 rounded-xl text-sm font-semibold hover:shadow-pink transition-shadow"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-mm">Messenger မှ မှာရန်</span>
                    </a>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={vUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-forest border border-hairline hover:border-emerald text-cream hover:text-emerald py-3 rounded-xl text-sm transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Viber</span>
                      </a>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-forest border border-hairline hover:border-green-400 text-cream hover:text-green-400 py-3 rounded-xl text-sm transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

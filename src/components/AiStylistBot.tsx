import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  Sparkles,
  X,
  Send,
  ShoppingBag,
  RotateCcw,
  MessageCircle,
  ExternalLink,
  Check,
  Ruler,
  PhoneCall,
  Bot,
  User,
  Mic,
  MicOff,
  Palette,
  Layers,
  Truck,
  Copy,
  Plus,
  ArrowRight,
  RefreshCw,
  Gift,
  ImagePlus,
  Scan,
  PackageCheck,
  Compass,
  CheckCircle2,
  Clock,
  Shirt,
  Eye,
  ShieldCheck,
  Receipt,
} from "lucide-react"
import { useLang } from "@/lib/lang"
import { useTheme } from "@/lib/theme"
import { useCart } from "@/lib/cart"
import { useProducts } from "@/lib/useProducts"
import { SITE, messengerUrl, viberLink, whatsappUrl } from "@/config"
import {
  type BotMessage,
  INITIAL_QUICK_REPLIES,
  COLOR_MOODS,
  STYLE_QUIZ_QUESTIONS,
  TOWNSHIPS,
  ADMIN_CHAT_EVENT,
  CUSTOMER_INQUIRY_EVENT,
  processUserQuery,
  calculateRecommendedSize,
  evaluateQuizResult,
  analyzeUploadedOutfitImage,
  type ColorMood,
  type StylePersonaResult,
  type TownshipDeliveryInfo,
} from "@/lib/botEngine"
import type { Product } from "@/lib/supabase"

const STORAGE_KEY = "sinar_bot_v2_history"
type TabType = "chat" | "admin" | "quiz" | "studio" | "checkout"

export const STYLIST_OPEN_EVENT = "sinar_open_stylist"
export function openStylist() {
  window.dispatchEvent(new Event(STYLIST_OPEN_EVENT))
}

export default function AiStylistBot({ hideFab = false }: { hideFab?: boolean }) {
  const { t, lang, toggle: toggleLang } = useLang()
  const { isDark } = useTheme()
  const { add: addToCart, items: cartItems } = useCart()
  const catalog = useProducts()
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("chat")
  const [hasUnread, setHasUnread] = useState(true)
  const [showProactive, setShowProactive] = useState(true)
  const [input, setInput] = useState("")
  const [adminReplyInput, setAdminReplyInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isScanningImage, setIsScanningImage] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({})

  // Studio Mode: Flat Lay vs Virtual Model Silhouette
  const [studioMode, setStudioMode] = useState<"flat" | "model">("model")

  // Size Calculator
  const [showSizeCalc, setShowSizeCalc] = useState(false)
  const [calcHeight, setCalcHeight] = useState("")
  const [calcWeight, setCalcWeight] = useState("")
  const [calcBust, setCalcBust] = useState("")

  // Style Quiz state
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<string[]>([])
  const [quizResult, setQuizResult] = useState<StylePersonaResult | null>(null)

  // In-Bot Outfit Studio state
  const tops = catalog.filter((p) => p.category === "Tops" || p.category === "Cardigans" || p.category === "Sweaters")
  const bottoms = catalog.filter((p) => p.category === "Jeans" || p.category === "Dresses")
  const [selectedTop, setSelectedTop] = useState<Product | null>(tops[0] || catalog[0])
  const [selectedBottom, setSelectedBottom] = useState<Product | null>(bottoms[0] || catalog[1])
  const [studioAdded, setStudioAdded] = useState(false)

  // Instant Delivery Calculator state
  const [selectedTownship, setSelectedTownship] = useState<TownshipDeliveryInfo>(TOWNSHIPS[0])
  const [orderCustomerName, setOrderCustomerName] = useState("")
  const [orderPhone, setOrderPhone] = useState("")
  const [orderAddress, setOrderAddress] = useState("")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const slipInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  // Load Saved Chat History from LocalStorage
  const [messages, setMessages] = useState<BotMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}

    return [
      {
        id: "welcome",
        sender: "bot",
        text:
          lang === "mm"
            ? "မင်္ဂလာပါရှင်! 🙏 **Sinar AI Fashion Stylist & VIP Hub** မှ နွေးထွေးစွာ ကြိုဆိုပါတယ်။\n\nသင့်အတွက် အလှပဆုံး ဝတ်စုံရွေးချယ်မှု၊ Size အကြံပြုချက်၊ ဓာတ်ပုံဖြင့် အဝတ်အစားရှာဖွေခြင်း သို့မဟုတ် အော်ဒါအခြေအနေများကို ကူညီပေးပါရစေရှင် ✨"
            : "Hello! Welcome to **Sinar AI Fashion Stylist & VIP Hub** ✨\n\nI'm your personal styling assistant. Ask me for outfit recommendations, upload inspiration photos, or track your live order!",
        products: catalog.slice(0, 2),
        quickReplies: INITIAL_QUICK_REPLIES,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]
  })

  // Sync Chat History to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {}
  }, [messages])

  // Listen to Real-Time Admin Live Replies
  useEffect(() => {
    const handleAdminReply = (e: any) => {
      const { message } = e.detail || {}
      if (!message) return

      setMessages((prev) => [...prev, message])
      setHasUnread(true)
      toast.info(lang === "mm" ? "👑 Sinar ဆိုင်ရှင်ထံမှ စာပြန်ကြားချက် ရောက်ရှိပါသည်!" : "👑 New message from Sinar Boutique Admin!")
    }

    window.addEventListener(ADMIN_CHAT_EVENT, handleAdminReply)
    return () => window.removeEventListener(ADMIN_CHAT_EVENT, handleAdminReply)
  }, [lang])

  // The app header's sparkle opens the stylist without the floating launcher.
  useEffect(() => {
    const open = () => setIsOpen(true)
    window.addEventListener(STYLIST_OPEN_EVENT, open)
    return () => window.removeEventListener(STYLIST_OPEN_EVENT, open)
  }, [])

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen && (activeTab === "chat" || activeTab === "admin")) {
      scrollToBottom()
      setHasUnread(false)
      setShowProactive(false)
    }
  }, [messages, isTyping, isOpen, activeTab])

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRec) {
      const recognition = new SpeechRec()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = lang === "mm" ? "my-MM" : "en-US"

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setIsListening(false)
        handleSend(transcript)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }
  }, [lang])

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Voice input is not supported in this browser.")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
        toast.info(lang === "mm" ? "အသံဖမ်းနေပါသည်... စကားပြောပါရှင် 🎙️" : "Listening... please speak 🎙️")
      } catch {
        setIsListening(false)
      }
    }
  }

  // Handle Photo Upload Visual Search
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageSrc = event.target?.result as string

      const userImgMsg: BotMessage = {
        id: `user-img-${Date.now()}`,
        sender: "user",
        text: lang === "mm" ? "📸 Outfit inspiration ဓာတ်ပုံ ရှာဖွေပေးပါ" : "📸 Find styles matching this photo",
        uploadedImage: imageSrc,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, userImgMsg])
      setIsScanningImage(true)

      setTimeout(() => {
        const botMatch = analyzeUploadedOutfitImage(imageSrc, catalog, lang)
        const fullBotMsg: BotMessage = {
          ...botMatch,
          id: `bot-match-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        setMessages((prev) => [...prev, fullBotMsg])
        setIsScanningImage(false)
      }, 1200)
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  // Handle Payment Slip Upload
  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageSrc = event.target?.result as string

      const slipMsg: BotMessage = {
        id: `user-slip-${Date.now()}`,
        sender: "user",
        text: lang === "mm" ? "💳 KBZPay / WavePay ငွေလွှဲပြေစာ ပေးပို့ထားပါသည်ရှင် (Payment Slip Attached)" : "💳 Payment Slip Attached for Verification",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        paymentSlip: {
          image: imageSrc,
          method: "KBZPay",
          amount: "Transfer Receipt",
          date: "Today",
          status: "pending",
        },
      }

      setMessages((prev) => [...prev, slipMsg])

      // Notify Admin Live Chat Console
      try {
        window.dispatchEvent(
          new CustomEvent(CUSTOMER_INQUIRY_EVENT, {
            detail: {
              sessionId: "session-cust-live",
              message: slipMsg,
              customerName: "Live Customer",
              phone: "Website Visitor",
            },
          })
        )
      } catch {}

      toast.success(lang === "mm" ? "ငွေလွှဲပြေစာ ပေးပို့ပြီးပါပြီ! ဆိုင်ရှင်မှ စစ်ဆေးနေပါသည် 💳" : "Payment slip sent to shop owner!")
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim()
    if (!query) return

    setInput("")

    const userMsg: BotMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    // Notify Admin Live Chat Console
    try {
      window.dispatchEvent(
        new CustomEvent(CUSTOMER_INQUIRY_EVENT, {
          detail: {
            sessionId: "session-cust-live",
            message: userMsg,
            customerName: "Live Customer",
            phone: "Website Visitor",
          },
        })
      )
    } catch {}

    setTimeout(async () => {
      try {
        const botResponse = await processUserQuery(query, catalog, lang)
        const fullBotMsg: BotMessage = {
          ...botResponse,
          id: `bot-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        setMessages((prev) => [...prev, fullBotMsg])
      } catch (err) {
        console.error("Bot error:", err)
      } finally {
        setIsTyping(false)
      }
    }, 500)
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name_en: product.name_en,
      name_mm: product.name_mm,
      price: product.price,
      image_url: product.image_url,
    })
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }))
    toast.success(lang === "mm" ? `"${product.name_mm || product.name_en}" ကို ဈေးခြင်းထဲ ထည့်ပြီးပါပြီ!` : `Added "${product.name_en}" to bag!`)
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }))
    }, 2000)
  }

  const handleReset = () => {
    const initialMsg: BotMessage = {
      id: `welcome-${Date.now()}`,
      sender: "bot",
      text:
        lang === "mm"
          ? "မင်္ဂလာပါရှင်! ဘယ်လို ဝတ်စုံလေးတွေ ရှာဖွေနေပါသလဲရှင်?"
          : "Hello! What kind of styles or outfits are you looking for today?",
      products: catalog.slice(0, 2),
      quickReplies: INITIAL_QUICK_REPLIES,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages([initialMsg])
    setQuizStep(0)
    setQuizAnswers([])
    setQuizResult(null)
    localStorage.removeItem(STORAGE_KEY)
    toast.info(lang === "mm" ? "Chat သမိုင်းကြောင်းကို အသစ်စတင်လိုက်ပါပြီ" : "Chat history restarted")
  }

  const handleCalculateSize = (e: React.FormEvent) => {
    e.preventDefault()
    const height = calcHeight ? parseInt(calcHeight) : undefined
    const weight = calcWeight ? parseInt(calcWeight) : undefined
    const bust = calcBust ? parseInt(calcBust) : undefined

    if (!height && !weight && !bust) return

    setShowSizeCalc(false)
    setCalcHeight("")
    setCalcWeight("")
    setCalcBust("")

    const prompt = `${height ? height + "cm " : ""}${weight ? weight + "kg " : ""}${bust ? "bust " + bust + "cm" : ""}`
    handleSend(prompt)
  }

  const handleSelectColorMood = (mood: ColorMood) => {
    const matched = catalog.filter((p) => mood.categories.includes(p.category || ""))
    const msg: BotMessage = {
      id: `bot-mood-${Date.now()}`,
      sender: "bot",
      text:
        lang === "mm"
          ? `${mood.icon} **${mood.name_mm} Palette**:\n${mood.description_mm}\n\nအောက်ပါ စတိုင်လ်လှလှလေးတွေကို ရွေးချယ်ပေးထားပါတယ်ရှင် 👇`
          : `${mood.icon} **${mood.name_en} Palette**:\n${mood.description_en}\n\nHere are matching pieces curated for this mood 👇`,
      products: matched.length > 0 ? matched : catalog.slice(0, 3),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, msg])
  }

  const handleQuizAnswer = (vibe: string) => {
    const nextAnswers = [...quizAnswers, vibe]
    setQuizAnswers(nextAnswers)

    if (quizStep < STYLE_QUIZ_QUESTIONS.length - 1) {
      setQuizStep((prev) => prev + 1)
    } else {
      const result = evaluateQuizResult(nextAnswers)
      setQuizResult(result)
    }
  }

  const handleAddAllQuizProducts = () => {
    if (!quizResult) return
    const matched = catalog.filter((p) => quizResult.recommendedCategories.includes(p.category || "")).slice(0, 3)
    matched.forEach((p) => {
      addToCart({
        id: p.id,
        name_en: p.name_en,
        name_mm: p.name_mm,
        price: p.price,
        image_url: p.image_url,
      })
    })
    toast.success(lang === "mm" ? "Capsule Wardrobe တစ်ခုလုံးကို ဈေးခြင်းထဲ ထည့်ပြီးပါပြီ! 🛍️" : "Added Full Capsule Wardrobe to Cart! 🛍️")
  }

  const handleAddStudioBundle = () => {
    if (!selectedTop || !selectedBottom) return
    addToCart({
      id: selectedTop.id,
      name_en: selectedTop.name_en,
      name_mm: selectedTop.name_mm,
      price: selectedTop.price,
      image_url: selectedTop.image_url,
    })
    addToCart({
      id: selectedBottom.id,
      name_en: selectedBottom.name_en,
      name_mm: selectedBottom.name_mm,
      price: selectedBottom.price,
      image_url: selectedBottom.image_url,
    })
    setStudioAdded(true)
    toast.success(lang === "mm" ? "စတိုင်လ်တွဲဖက်မှု တစ်ခုလုံးကို ဈေးခြင်းထဲ ထည့်ပြီးပါပြီ! ✨" : "Outfit Bundle Added to Cart! ✨")
    setTimeout(() => setStudioAdded(false), 2000)
  }

  const copyPromoCode = () => {
    navigator.clipboard.writeText("SINARAI10")
    toast.success(lang === "mm" ? "ကုဒ် 'SINARAI10' ကို Copy ကူးပြီးပါပြီ! 🎉" : "Promo code 'SINARAI10' copied! 🎉")
  }

  const handleCreateOrderDirect = () => {
    const itemsSummary = cartItems.length > 0
      ? cartItems.map((item) => `• ${item.name_en || item.name_mm} (${item.qty || 1}x) - ${((item.price || 0) * (item.qty || 1)).toLocaleString()} Ks`).join("\n")
      : (selectedTop && selectedBottom
        ? `• ${selectedTop.name_en} (${selectedTop.price.toLocaleString()} Ks)\n• ${selectedBottom.name_en} (${selectedBottom.price.toLocaleString()} Ks)`
        : "• Custom Order")

    const orderText = `မင်္ဂလာပါ Sinar! အော်ဒါတင်လိုပါသည် 🛍️\n\n👤 နာမည်: ${orderCustomerName || "Customer"}\n📞 ဖုန်း: ${orderPhone || "-"}\n📍 မြို့နယ်: ${selectedTownship.name}\n🏠 လိပ်စာ: ${orderAddress || "-"}\n🚚 ပို့ဆောင်ခ: ${selectedTownship.fee.toLocaleString()} Ks (${selectedTownship.eta})\n💳 ငွေချေနည်း: ${selectedTownship.cod ? "Cash on Delivery (COD)" : "KPay / WavePay"}\n\n📦 မှာယူမည့် ပစ္စည်းများ:\n${itemsSummary}`

    const encoded = encodeURIComponent(orderText)
    const url = `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${encoded}`
    window.open(url, "_blank")
  }

  const formatText = (text: string) => {
    const lines = text.split("\n")
    return lines.map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g)
      return (
        <span key={i} className="block min-h-[1.2em]">
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={j} className="font-bold text-pink">
                  {part.slice(2, -2)}
                </strong>
              )
            }
            return part
          })}
        </span>
      )
    })
  }

  // Theme styling
  const bgGlass = isDark
    ? "bg-[#06150C]/96 border-[rgba(194,135,115,0.3)] text-[#FAF6EF]"
    : "bg-[#FAF6EF]/96 border-[rgba(194,135,115,0.35)] text-[#1A1611]"

  const botBubbleBg = isDark
    ? "bg-[#0F2D1C]/85 border-[rgba(194,135,115,0.2)] text-[#FAF6EF]"
    : "bg-white/95 border-[rgba(194,135,115,0.25)] text-[#1A1611]"

  const inputBg = isDark
    ? "bg-[#0B2014] border-[rgba(194,135,115,0.2)] text-[#FAF6EF]"
    : "bg-white border-[rgba(194,135,115,0.25)] text-[#1A1611]"

  const cardBg = isDark
    ? "bg-[#0F2D1C]/50 border-[rgba(194,135,115,0.15)]"
    : "bg-white/70 border-[rgba(194,135,115,0.2)]"

  return (
    <>
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Hidden File Input for Payment Slip */}
      <input
        type="file"
        ref={slipInputRef}
        onChange={handleSlipUpload}
        accept="image/*"
        className="hidden"
      />

      {/* ── Ultra-Unique Haute Couture Floating Launcher ── */}
      <div
        hidden={hideFab}
        className="fixed z-[70] right-4 sm:right-6 transition-all duration-300"
        style={{ bottom: "max(5.5rem, calc(env(safe-area-inset-bottom) + 5rem))" }}
      >
        {/* Proactive Floating Advice Bubble */}
        <AnimatePresence>
          {showProactive && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bottom-full right-0 mb-3 w-64 p-3.5 rounded-2xl bg-gradient-to-br from-forest via-[#0F2D1C] to-forest border border-pink/40 text-cream shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 text-pink font-bold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                  <span className="font-serif">Sinar Haute Couture AI</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowProactive(false)
                  }}
                  className="text-white/40 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className={`text-[10px] mt-1.5 text-white/90 leading-snug ${lang === "mm" ? "font-mm" : ""}`}>
                {t("📸 ပုံတင်ရှာဖွေခြင်း၊ 👗 Virtual Try-on & 10% ကူပွန် ✨", "📸 Visual Photo Search, 👗 Virtual Model Try-on & 10% Voucher ✨")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#C28773] via-[#D49885] to-[#A76F5B] text-white shadow-[0_10px_35px_-5px_rgba(194,135,115,0.7)] backdrop-blur-md border border-white/30"
          aria-label="Open Sinar AI Stylist"
        >
          {/* Pulsing Aura */}
          <span className="absolute -inset-1.5 rounded-full bg-pink/30 animate-pulse2 -z-10" />

          <div className="relative flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-forest flex items-center justify-center text-pink border border-pink/40 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            </div>
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-forest" />
            )}
          </div>

          <div className="flex flex-col items-start text-left">
            <span className="text-[11px] font-bold tracking-wider uppercase font-serif">
              AI Stylist
            </span>
            <span className="text-[8px] text-cream/80 font-mono hidden sm:inline-block">
              VIP Studio
            </span>
          </div>
        </motion.button>
      </div>

      {/* ── Main Chat Modal Hub ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed right-3 sm:right-6 z-[75] w-[calc(100vw-24px)] sm:w-[450px] max-w-[490px] h-[640px] max-h-[86vh] rounded-[32px] border shadow-[0_25px_80px_-15px_rgba(0,0,0,0.7)] backdrop-blur-2xl flex flex-col overflow-hidden ${bgGlass}`}
            style={{ bottom: "max(5.5rem, calc(env(safe-area-inset-bottom) + 5rem))" }}
          >
            {/* ── Luxury Curved Boutique Header ── */}
            <div className="px-5 py-3.5 border-b border-pink/20 bg-gradient-to-r from-pink/15 via-forest-light/30 to-pink/15 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink via-coral-deep to-forest flex items-center justify-center text-white shadow-lg border border-pink/40">
                    <span className="font-serif font-black text-sm text-cream">S</span>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-forest" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-pink flex items-center gap-1.5">
                      Sinar Haute Couture AI
                    </h3>
                    <p className="text-[9px] opacity-75 font-sans">
                      {t("ဖက်ရှင် စတိုင်လ် & အော်ဒါ အကူအညီ", "Fashion Stylist & Live Concierge")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Language Switch */}
                  <button
                    onClick={toggleLang}
                    className="px-2 py-0.8 rounded-lg border border-pink/30 text-[10px] font-bold uppercase hover:bg-pink/15 transition-colors"
                  >
                    {lang === "mm" ? "EN" : "မြန်မာ"}
                  </button>

                  {/* Reset */}
                  <button
                    onClick={handleReset}
                    className="p-1.5 rounded-lg border border-pink/30 hover:bg-pink/15 transition-colors opacity-80 hover:opacity-100"
                    title={t("အသစ်စတင်မည်", "Restart Chat")}
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>

                  {/* Close */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg border border-pink/30 hover:bg-pink/15 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Promo code top banner */}
              <div className="mt-2.5 flex items-center justify-between px-2.5 py-1 rounded-xl bg-pink/15 border border-pink/30 text-[10px]">
                <div className="flex items-center gap-1.5 text-pink font-semibold">
                  <Gift className="w-3.5 h-3.5" />
                  <span>VIP 10% OFF: <strong className="font-mono text-white">SINARAI10</strong></span>
                </div>
                <button
                  onClick={copyPromoCode}
                  className="flex items-center gap-1 text-[9px] uppercase font-bold text-pink hover:underline"
                >
                  <Copy className="w-2.5 h-2.5" />
                  <span>Copy</span>
                </button>
              </div>

              {/* 5-Tab Navigation */}
              <div className="grid grid-cols-5 gap-1 mt-2.5 bg-black/25 p-1 rounded-2xl border border-pink/20">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`py-1.5 rounded-xl text-[9px] font-bold transition-all flex items-center justify-center gap-0.5 ${
                    activeTab === "chat" ? "bg-gradient-to-r from-pink to-coral text-white shadow-sm" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <Bot className="w-3 h-3" />
                  <span>AI Bot</span>
                </button>
                <button
                  onClick={() => setActiveTab("admin")}
                  className={`py-1.5 rounded-xl text-[9px] font-bold transition-all flex items-center justify-center gap-0.5 ${
                    activeTab === "admin" ? "bg-gradient-to-r from-[#C28773] to-[#A76F5B] text-white shadow-sm ring-1 ring-[#C28773]/50" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <ShieldCheck className="w-3 h-3 text-pink" />
                  <span>Admin</span>
                </button>
                <button
                  onClick={() => setActiveTab("quiz")}
                  className={`py-1.5 rounded-xl text-[9px] font-bold transition-all flex items-center justify-center gap-0.5 ${
                    activeTab === "quiz" ? "bg-gradient-to-r from-pink to-coral text-white shadow-sm" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Quiz</span>
                </button>
                <button
                  onClick={() => setActiveTab("studio")}
                  className={`py-1.5 rounded-xl text-[9px] font-bold transition-all flex items-center justify-center gap-0.5 ${
                    activeTab === "studio" ? "bg-gradient-to-r from-pink to-coral text-white shadow-sm" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <Shirt className="w-3 h-3" />
                  <span>Try-On</span>
                </button>
                <button
                  onClick={() => setActiveTab("checkout")}
                  className={`py-1.5 rounded-xl text-[9px] font-bold transition-all flex items-center justify-center gap-0.5 ${
                    activeTab === "checkout" ? "bg-gradient-to-r from-pink to-coral text-white shadow-sm" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <Truck className="w-3 h-3" />
                  <span>Track</span>
                </button>
              </div>
            </div>

            {/* ── TAB 1: AI CHAT ── */}
            {activeTab === "chat" && (
              <>
                {/* Color Mood quick chips */}
                <div className="px-4 py-2 border-b border-pink/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <span className="text-[9px] uppercase font-bold text-pink flex items-center gap-1 flex-shrink-0">
                    <Palette className="w-3 h-3" /> Mood:
                  </span>
                  {COLOR_MOODS.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => handleSelectColorMood(mood)}
                      className="flex items-center gap-1.5 px-2 py-0.8 rounded-full border border-pink/20 bg-pink/5 hover:bg-pink/20 text-[9px] font-medium whitespace-nowrap transition-colors"
                    >
                      <span>{mood.icon}</span>
                      <span>{lang === "mm" ? mood.name_mm.split(" ")[0] : mood.name_en}</span>
                    </button>
                  ))}
                </div>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans scroll-smooth">
                  {messages.map((msg) => {
                    const isBot = msg.sender === "bot"
                    const isAdmin = msg.sender === "admin"
                    const isLeft = isBot || isAdmin

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col ${isLeft ? "items-start" : "items-end"}`}
                      >
                        <div className={`flex items-start gap-2 max-w-[88%] ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              isAdmin
                                ? "bg-gradient-to-r from-[#C28773] to-[#A76F5B] text-white ring-2 ring-[#C28773]/40"
                                : isBot
                                ? "bg-pink/20 text-pink border border-pink/30"
                                : "bg-forest-mid text-cream border border-cream/20"
                            }`}
                          >
                            {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                          </div>

                          <div
                            className={`p-3.5 rounded-2xl shadow-sm border leading-relaxed ${
                              isAdmin
                                ? "bg-gradient-to-br from-[#1F1710] to-[#2E2016] border-[#C28773] text-[#FAF6EF] rounded-tl-sm shadow-lg"
                                : isBot
                                ? `${botBubbleBg} rounded-tl-sm`
                                : "bg-gradient-to-r from-pink to-coral text-white border-pink/30 rounded-tr-sm"
                            }`}
                          >
                            {isAdmin && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-pink flex items-center gap-1 mb-1 pb-1 border-b border-pink/20">
                                <ShieldCheck className="w-3 h-3 text-pink" /> 👑 Sinar Shop Owner (ဆိုင်ရှင် တိုက်ရိုက်)
                              </span>
                            )}

                            {/* Uploaded image preview in chat */}
                            {msg.uploadedImage && (
                              <div className="mb-2 rounded-xl overflow-hidden border border-white/20">
                                <img
                                  src={msg.uploadedImage}
                                  alt="Uploaded outfit inspiration"
                                  className="w-full max-h-44 object-cover"
                                />
                              </div>
                            )}

                            {/* Payment Slip Card in Chat */}
                            {msg.paymentSlip && (
                              <div className="mb-2 p-2.5 rounded-xl bg-black/40 border border-[#C28773]/40 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-bold text-[#C28773] flex items-center gap-1">
                                    <Receipt className="w-3 h-3" /> {msg.paymentSlip.method} Slip
                                  </span>
                                  <span
                                    className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                                      msg.paymentSlip.status === "verified"
                                        ? "bg-emerald-500/20 text-emerald-300"
                                        : "bg-amber-500/20 text-amber-300"
                                    }`}
                                  >
                                    {msg.paymentSlip.status === "verified" ? "✅ Verified" : "⏳ Pending"}
                                  </span>
                                </div>

                                <div className="rounded-lg overflow-hidden border border-white/20">
                                  <img
                                    src={msg.paymentSlip.image}
                                    alt="Payment Slip"
                                    className="w-full max-h-40 object-cover"
                                  />
                                </div>
                              </div>
                            )}

                            <div className={lang === "mm" ? "font-mm" : ""}>
                              {formatText(msg.text)}
                            </div>
                          </div>
                        </div>

                        {/* Interactive Order Tracking Timeline Card */}
                        {msg.isOrderTracker && msg.trackingData && (
                          <div className="mt-3 w-full pl-8">
                            <div className="p-3.5 rounded-2xl border border-pink/30 bg-black/30 backdrop-blur-md space-y-3">
                              <div className="flex items-center justify-between border-b border-pink/15 pb-2">
                                <div>
                                  <span className="text-[10px] text-pink font-bold block">
                                    {msg.trackingData.orderId}
                                  </span>
                                  <span className="text-[9px] opacity-75 font-mono">
                                    {msg.trackingData.trackingNo}
                                  </span>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">
                                  {msg.trackingData.status_en}
                                </span>
                              </div>

                              {/* Steps timeline */}
                              <div className="space-y-2">
                                {msg.trackingData.steps.map((step, idx) => (
                                  <div key={idx} className="flex items-start gap-2 text-[10px]">
                                    <div className="mt-0.5">
                                      {step.completed ? (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                      ) : step.current ? (
                                        <Clock className="w-3.5 h-3.5 text-pink animate-spin-slow" />
                                      ) : (
                                        <div className="w-3.5 h-3.5 rounded-full border border-pink/30" />
                                      )}
                                    </div>
                                    <div className="flex-1 flex justify-between">
                                      <span className={step.current ? "font-bold text-pink" : step.completed ? "text-white/90" : "opacity-50"}>
                                        {lang === "mm" ? step.title_mm : step.title_en}
                                      </span>
                                      <span className="text-[8px] opacity-60 font-mono">{step.time}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Interactive Product Cards inside chat */}
                        {msg.products && msg.products.length > 0 && (
                          <div className="mt-3 w-full pl-8 space-y-2">
                            <div className="text-[9px] font-bold text-pink tracking-wider uppercase">
                              {t("အကြံပြုထားသော ပစ္စည်းများ", "Recommended for you")}:
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {msg.products.map((product) => {
                                const isAdded = !!addedItemIds[product.id]

                                return (
                                  <div
                                    key={product.id}
                                    className="group relative rounded-xl border border-pink/20 bg-black/25 p-2 flex flex-col justify-between hover:border-pink/50 transition-all duration-200"
                                  >
                                    <div className="flex gap-2.5">
                                      <img
                                        src={product.image_url}
                                        alt={product.name_en}
                                        className="w-16 h-20 object-cover rounded-lg flex-shrink-0 border border-pink/10"
                                      />
                                      <div className="flex-1 flex flex-col justify-between overflow-hidden">
                                        <div>
                                          <p className="font-bold text-[11px] line-clamp-1">
                                            {lang === "mm" ? product.name_mm : product.name_en}
                                          </p>
                                          <p className="text-[10px] text-pink font-semibold mt-0.5">
                                            {product.price.toLocaleString()} Ks
                                          </p>
                                          <div className="flex gap-1 mt-1">
                                            {product.sizes?.slice(0, 3).map((s) => (
                                              <span
                                                key={s}
                                                className="px-1 py-0.2 rounded bg-pink/10 text-pink text-[8px] font-mono"
                                              >
                                                {s}
                                              </span>
                                            ))}
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 mt-2">
                                          <button
                                            onClick={() => handleAddToCart(product)}
                                            className={`flex-1 py-1 px-2 rounded-lg flex items-center justify-center gap-1 text-[9px] font-bold uppercase transition-all ${
                                              isAdded
                                                ? "bg-emerald text-white"
                                                : "bg-pink text-white hover:opacity-90"
                                            }`}
                                          >
                                            {isAdded ? (
                                              <>
                                                <Check className="w-2.5 h-2.5" />
                                                <span>Added</span>
                                              </>
                                            ) : (
                                              <>
                                                <ShoppingBag className="w-2.5 h-2.5" />
                                                <span>{t("ထည့်မည်", "Bag")}</span>
                                              </>
                                            )}
                                          </button>

                                          <a
                                            href={whatsappUrl(product.name_en)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1 rounded-lg border border-pink/20 hover:bg-pink/15 text-pink transition-colors"
                                            title="Order via WhatsApp"
                                          >
                                            <MessageCircle className="w-3 h-3" />
                                          </a>

                                          <button
                                            onClick={() => {
                                              setIsOpen(false)
                                              navigate(`/product/${product.id}`)
                                            }}
                                            className="p-1 rounded-lg border border-pink/20 hover:bg-pink/15 text-pink transition-colors"
                                            title="View Details"
                                          >
                                            <ExternalLink className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Direct Contact Action */}
                        {msg.isContactAction && (
                          <div className="mt-3 pl-8 flex flex-wrap gap-2">
                            <a
                              href={viberLink()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#7360F2] text-white text-[10px] font-bold shadow-sm hover:opacity-90 transition-opacity"
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>Viber (+959896208413)</span>
                            </a>
                            <a
                              href={whatsappUrl("General Inquiry")}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] text-white text-[10px] font-bold shadow-sm hover:opacity-90 transition-opacity"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp (+959790543312)</span>
                            </a>
                            <a
                              href={messengerUrl("Inquiry")}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0084FF] text-white text-[10px] font-bold shadow-sm hover:opacity-90 transition-opacity"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>Messenger</span>
                            </a>
                          </div>
                        )}

                        {/* Quick Replies */}
                        {msg.quickReplies && msg.quickReplies.length > 0 && (
                          <div className="mt-2.5 pl-8 flex flex-wrap gap-1.5">
                            {msg.quickReplies.map((qr, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSend(qr.prompt)}
                                className="px-2.5 py-1 rounded-full border border-pink/30 bg-pink/10 hover:bg-pink/25 text-pink text-[10px] font-medium transition-colors"
                              >
                                {lang === "mm" ? qr.label_mm : qr.label_en}
                              </button>
                            ))}
                          </div>
                        )}

                        <span className="text-[8px] opacity-40 mt-1 px-1">{msg.timestamp}</span>
                      </motion.div>
                    )
                  })}

                  {/* Scanning Animation */}
                  {isScanningImage && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-2xl bg-pink/10 border border-pink/30 flex items-center gap-3 text-pink"
                    >
                      <Scan className="w-5 h-5 animate-pulse" />
                      <div className="text-[10px]">
                        <p className="font-bold">{t("ဓာတ်ပုံအား AI ဖြင့် စစ်ဆေးနေပါသည်...", "AI is analyzing your outfit photo...")}</p>
                        <p className="opacity-75 text-[9px]">Matching colors, silhouettes & catalog styles</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 pl-8 text-pink"
                    >
                      <div className="flex gap-1 p-2 rounded-xl bg-pink/10 border border-pink/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-pink animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-pink animate-bounce" />
                      </div>
                      <span className="text-[10px] italic opacity-75">
                        {t("အကြံပြုချက် စဉ်းစားနေပါသည်...", "Stylist is thinking...")}
                      </span>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Size Calculator Drawer */}
                <AnimatePresence>
                  {showSizeCalc && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 py-3 border-t border-pink/20 bg-pink/10 backdrop-blur-md overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 text-pink font-bold text-[11px]">
                          <Ruler className="w-3.5 h-3.5" />
                          <span>{t("Size တွက်ချက်ရန်", "Instant Size Finder")}</span>
                        </div>
                        <button
                          onClick={() => setShowSizeCalc(false)}
                          className="text-xs opacity-60 hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <form onSubmit={handleCalculateSize} className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[9px] opacity-75 block mb-0.5">Height (cm)</label>
                          <input
                            type="number"
                            placeholder="162"
                            value={calcHeight}
                            onChange={(e) => setCalcHeight(e.target.value)}
                            className={`w-full px-2 py-1 rounded-lg border text-xs focus:outline-none focus:border-pink ${inputBg}`}
                          />
                        </div>
                        <div>
                          <label className="text-[9px] opacity-75 block mb-0.5">Weight (kg)</label>
                          <input
                            type="number"
                            placeholder="50"
                            value={calcWeight}
                            onChange={(e) => setCalcWeight(e.target.value)}
                            className={`w-full px-2 py-1 rounded-lg border text-xs focus:outline-none focus:border-pink ${inputBg}`}
                          />
                        </div>
                        <div>
                          <label className="text-[9px] opacity-75 block mb-0.5">Bust (cm)</label>
                          <input
                            type="number"
                            placeholder="84"
                            value={calcBust}
                            onChange={(e) => setCalcBust(e.target.value)}
                            className={`w-full px-2 py-1 rounded-lg border text-xs focus:outline-none focus:border-pink ${inputBg}`}
                          />
                        </div>
                        <div className="col-span-3 mt-1">
                          <button
                            type="submit"
                            className="w-full py-1.5 rounded-lg bg-pink text-white text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                          >
                            {t("Size ရှာဖွေမည်", "Calculate Best Fit")}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input Bar */}
                <div className="p-3 border-t border-pink/20 bg-black/25">
                  <div className="flex items-center gap-1.5">
                    {/* Size Tool */}
                    <button
                      type="button"
                      onClick={() => setShowSizeCalc((prev) => !prev)}
                      className={`p-2 rounded-xl border transition-colors ${
                        showSizeCalc
                          ? "bg-pink text-white border-pink"
                          : "border-pink/30 hover:bg-pink/15 text-pink"
                      }`}
                      title={t("Size တွက်စက်", "Size Calculator")}
                    >
                      <Ruler className="w-4 h-4" />
                    </button>

                    {/* Image Upload Photo Search */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-xl border border-pink/30 hover:bg-pink/15 text-pink transition-colors"
                      title={t("ဓာတ်ပုံတင်ပြီး အဝတ်ရှာမည်", "Upload Photo to Search")}
                    >
                      <ImagePlus className="w-4 h-4" />
                    </button>

                    {/* Payment Slip Upload */}
                    <button
                      type="button"
                      onClick={() => slipInputRef.current?.click()}
                      className="p-2 rounded-xl border border-pink/30 hover:bg-pink/15 text-pink transition-colors"
                      title={t("ငွေလွှဲပြေစာ ပေးပို့မည်", "Upload Payment Slip")}
                    >
                      <Receipt className="w-4 h-4" />
                    </button>

                    {/* Voice Mic Button */}
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`p-2 rounded-xl border transition-all ${
                        isListening
                          ? "bg-red-500 text-white border-red-400 animate-pulse"
                          : "border-pink/30 hover:bg-pink/15 text-pink"
                      }`}
                      title={isListening ? "Listening..." : "Voice Input (Speak)"}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend()
                      }}
                      placeholder={
                        lang === "mm"
                          ? "ဝတ်စုံ၊ ဆိုဒ် သို့မဟုတ် ပို့ခ မေးမြန်းရန်..."
                          : "Ask about dresses, sizes, or delivery..."
                      }
                      className={`flex-1 px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-pink transition-colors ${inputBg} ${
                        lang === "mm" ? "font-mm placeholder:font-mm" : ""
                      }`}
                    />

                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim()}
                      className="p-2 rounded-xl bg-gradient-to-r from-pink to-coral text-white hover:opacity-90 disabled:opacity-40 transition-opacity shadow-md flex-shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── TAB: DEDICATED ADMIN LIVE CHAT ── */}
            {activeTab === "admin" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Admin Profile Card */}
                <div className="p-3.5 bg-gradient-to-r from-[#1A120B] via-[#2A1D13] to-[#1A120B] border-b border-[#C28773]/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C28773] to-[#FAF6EF] p-0.5 shadow-md">
                        <div className="w-full h-full rounded-full bg-[#0A1A0F] flex items-center justify-center text-pink font-serif font-bold text-sm">
                          👑
                        </div>
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#0A1A0F] animate-pulse" />
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-[#FAF6EF] flex items-center gap-1.5 font-serif">
                        Sinar Boutique Owner
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-sans border border-emerald-500/30">
                          Live Online
                        </span>
                      </h4>
                      <p className="text-[10px] text-[#C28773] mt-0.5 flex items-center gap-1 font-mm">
                        <Clock className="w-2.5 h-2.5" /> ဆိုင်ရှင်ကိုယ်တိုင် ၁-၂ မိနစ်အတွင်း ဖြေကြားပေးပါမည်
                      </p>
                    </div>
                  </div>

                  {/* Direct Contact Buttons */}
                  <div className="flex items-center gap-1.5">
                    <a
                      href={whatsappUrl("Hello Sinar Shop Owner!")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 transition-colors"
                      title="WhatsApp Direct"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={viberLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-[#7360F2]/20 border border-[#7360F2]/40 text-[#7360F2] hover:bg-[#7360F2]/30 transition-colors"
                      title="Viber Direct"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Live Message History */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs font-sans">
                  <div className="text-center my-1">
                    <span className="text-[9px] px-2.5 py-1 rounded-full bg-black/40 border border-pink/20 text-pink/90 font-mono">
                      🔒 Official 2-Way Direct Line with Shop Owner
                    </span>
                  </div>

                  {messages
                    .filter((m) => m.sender === "user" || m.sender === "admin")
                    .map((msg) => {
                      const isAdmin = msg.sender === "admin"

                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex flex-col ${isAdmin ? "items-start" : "items-end"}`}
                        >
                          <div className={`flex items-start gap-2 max-w-[85%] ${isAdmin ? "flex-row" : "flex-row-reverse"}`}>
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs ${
                                isAdmin
                                  ? "bg-[#C28773] text-white ring-2 ring-[#C28773]/40"
                                  : "bg-forest-mid text-cream border border-cream/20"
                              }`}
                            >
                              {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <User className="w-3 h-3" />}
                            </div>

                            <div
                              className={`p-3 rounded-2xl shadow-md border leading-relaxed ${
                                isAdmin
                                  ? "bg-gradient-to-br from-[#24160E] to-[#382316] border-[#C28773] text-[#FAF6EF] rounded-tl-sm"
                                  : "bg-gradient-to-r from-pink to-coral text-white border-pink/30 rounded-tr-sm"
                              }`}
                            >
                              {isAdmin && (
                                <span className="text-[9px] font-bold uppercase tracking-wider text-pink flex items-center gap-1 mb-1 pb-1 border-b border-pink/20">
                                  <ShieldCheck className="w-3 h-3 text-pink" /> 👑 Shop Owner Reply
                                </span>
                              )}

                              {/* Payment Slip Card */}
                              {msg.paymentSlip && (
                                <div className="mb-2 p-2.5 rounded-xl bg-black/40 border border-[#C28773]/40 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-bold text-[#C28773] flex items-center gap-1">
                                      <Receipt className="w-3 h-3" /> {msg.paymentSlip.method} Slip
                                    </span>
                                    <span
                                      className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                                        msg.paymentSlip.status === "verified"
                                          ? "bg-emerald-500/20 text-emerald-300"
                                          : "bg-amber-500/20 text-amber-300"
                                      }`}
                                    >
                                      {msg.paymentSlip.status === "verified" ? "✅ Verified" : "⏳ Pending Verification"}
                                    </span>
                                  </div>

                                  <div className="rounded-lg overflow-hidden border border-white/20">
                                    <img
                                      src={msg.paymentSlip.image}
                                      alt="Payment Slip"
                                      className="w-full max-h-40 object-cover"
                                    />
                                  </div>
                                </div>
                              )}

                              <p className={lang === "mm" ? "font-mm" : ""}>{msg.text}</p>
                            </div>
                          </div>
                          <span className="text-[9px] opacity-60 mt-0.5 px-1">{msg.timestamp}</span>
                        </motion.div>
                      )
                    })}
                </div>

                {/* Quick Presets */}
                <div className="px-3 py-1.5 border-t border-pink/15 bg-black/30 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <span className="text-[8px] uppercase font-bold text-pink flex-shrink-0">
                    ✨ Quick:
                  </span>
                  {[
                    "🛍️ အော်ဒါ တိုက်ရိုက်တင်ချင်ပါတယ်",
                    "📏 Size အကြံပြုချက် မေးလိုပါသည်",
                    "💳 ငွေလွှဲပြေစာ အတည်ပြုပေးပါ",
                    "🚚 မြစ်ကြီးနား/နယ် ပို့ဆောင်ခ မေးမြန်းရန်",
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handleSend(preset)
                      }}
                      className="px-2 py-0.5 rounded-full border border-pink/20 bg-pink/5 hover:bg-pink/20 text-[9px] text-cream whitespace-nowrap transition-colors font-mm"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Admin Direct Input Bar */}
                <div className="p-3 border-t border-pink/20 bg-black/25">
                  <div className="flex items-center gap-1.5">
                    {/* Payment Slip Upload in Admin Tab */}
                    <button
                      type="button"
                      onClick={() => slipInputRef.current?.click()}
                      className="p-2 rounded-xl border border-pink/30 hover:bg-pink/15 text-pink transition-colors flex-shrink-0"
                      title={t("ငွေလွှဲပြေစာ ပေးပို့မည်", "Upload Payment Slip")}
                    >
                      <Receipt className="w-4 h-4" />
                    </button>

                    <input
                      type="text"
                      value={adminReplyInput}
                      onChange={(e) => setAdminReplyInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && adminReplyInput.trim()) {
                          handleSend(adminReplyInput)
                          setAdminReplyInput("")
                        }
                      }}
                      placeholder="ဆိုင်ရှင်ထံ တိုက်ရိုက် မေးမြန်းရန် ရိုက်ထည့်ပါ..."
                      className={`flex-1 px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-pink transition-colors ${inputBg} ${
                        lang === "mm" ? "font-mm placeholder:font-mm" : ""
                      }`}
                    />

                    <button
                      onClick={() => {
                        if (adminReplyInput.trim()) {
                          handleSend(adminReplyInput)
                          setAdminReplyInput("")
                        }
                      }}
                      disabled={!adminReplyInput.trim()}
                      className="p-2 rounded-xl bg-gradient-to-r from-[#C28773] to-[#A76F5B] text-white hover:opacity-90 disabled:opacity-40 transition-opacity shadow-md flex-shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 3: STYLE PERSONA QUIZ ── */}
            {activeTab === "quiz" && (
              <div className="flex-1 overflow-y-auto p-5 flex flex-col justify-between">
                {!quizResult ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-pink/15 pb-2">
                      <span className="text-[10px] font-bold uppercase text-pink font-serif">
                        Question {quizStep + 1} of {STYLE_QUIZ_QUESTIONS.length}
                      </span>
                      <div className="flex gap-1">
                        {STYLE_QUIZ_QUESTIONS.map((_, i) => (
                          <span
                            key={i}
                            className={`w-5 h-1.5 rounded-full ${
                              i <= quizStep ? "bg-pink" : "bg-pink/20"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-pink leading-snug">
                      {lang === "mm"
                        ? STYLE_QUIZ_QUESTIONS[quizStep].title_mm
                        : STYLE_QUIZ_QUESTIONS[quizStep].title_en}
                    </h4>

                    <div className="space-y-2 pt-2">
                      {STYLE_QUIZ_QUESTIONS[quizStep].options.map((opt, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleQuizAnswer(opt.vibe)}
                          className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${cardBg} hover:border-pink hover:shadow-md`}
                        >
                          <span className="text-xl p-2 rounded-xl bg-pink/10">{opt.icon}</span>
                          <span className="text-xs font-semibold flex-1">
                            {lang === "mm" ? opt.label_mm : opt.label_en}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-pink opacity-60" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center p-4 rounded-2xl bg-gradient-to-b from-pink/20 to-transparent border border-pink/30">
                      <span className="text-2xl mb-1 block">✨</span>
                      <h3 className="font-serif font-bold text-base text-pink">
                        {lang === "mm" ? quizResult.title_mm : quizResult.title_en}
                      </h3>
                      <p className="text-[10px] opacity-80 mt-1">
                        {lang === "mm" ? quizResult.subtitle_mm : quizResult.subtitle_en}
                      </p>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold uppercase text-pink tracking-wider mb-2">
                        {t("သင့်အတွက် အထူးရွေးချယ်ထားသော Capsule Wardrobe", "Your Curated Capsule Wardrobe")}:
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {catalog
                          .filter((p) => quizResult.recommendedCategories.includes(p.category || ""))
                          .slice(0, 4)
                          .map((product) => (
                            <div
                              key={product.id}
                              className="rounded-xl border border-pink/20 bg-black/20 p-2 overflow-hidden"
                            >
                              <img
                                src={product.image_url}
                                alt={product.name_en}
                                className="w-full aspect-[3/4] object-cover rounded-lg mb-1.5"
                              />
                              <p className="font-bold text-[10px] line-clamp-1">{product.name_en}</p>
                              <p className="text-[9px] text-pink font-semibold">
                                {product.price.toLocaleString()} Ks
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleAddAllQuizProducts}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink to-coral text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:opacity-90"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{t("အားလုံး ဈေးခြင်းထဲထည့်မည်", "Add All to Bag")}</span>
                      </button>
                      <button
                        onClick={() => {
                          setQuizStep(0)
                          setQuizAnswers([])
                          setQuizResult(null)
                        }}
                        className="p-2.5 rounded-xl border border-pink/30 hover:bg-pink/15 text-pink"
                        title="Retake Quiz"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 3: VIRTUAL MODEL TRY-ON SIMULATOR ── */}
            {activeTab === "studio" && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 flex flex-col justify-between">
                <div>
                  {/* Mode Selector Toggle */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex gap-1 bg-black/25 p-0.8 rounded-xl border border-pink/20">
                      <button
                        onClick={() => setStudioMode("model")}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase transition-all flex items-center gap-1 ${
                          studioMode === "model" ? "bg-pink text-white" : "opacity-70"
                        }`}
                      >
                        <User className="w-3 h-3" />
                        <span>Virtual Model</span>
                      </button>
                      <button
                        onClick={() => setStudioMode("flat")}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase transition-all flex items-center gap-1 ${
                          studioMode === "flat" ? "bg-pink text-white" : "opacity-70"
                        }`}
                      >
                        <Layers className="w-3 h-3" />
                        <span>Flat Lay</span>
                      </button>
                    </div>

                    <span className="text-[10px] text-pink font-bold">
                      {((selectedTop?.price || 0) + (selectedBottom?.price || 0)).toLocaleString()} Ks
                    </span>
                  </div>

                  {/* ── Visual Try-On Canvas ── */}
                  {studioMode === "model" ? (
                    <div className="relative w-full aspect-[16/10] rounded-2xl border border-pink/30 bg-gradient-to-b from-black/40 via-forest/30 to-black/50 overflow-hidden flex items-center justify-center p-3 shadow-inner">
                      {/* Ambient Studio Lighting Glow */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-pink/20 blur-2xl pointer-events-none" />

                      {/* Fashion Runway Silhouette Showcase */}
                      <div className="relative z-10 flex items-center justify-center gap-3">
                        {selectedTop && (
                          <div className="relative group text-center">
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-pink text-white text-[7px] font-bold uppercase tracking-wider z-20 shadow-sm">
                              Top
                            </span>
                            <img
                              src={selectedTop.image_url}
                              alt={selectedTop.name_en}
                              className="w-24 h-32 object-cover rounded-2xl border-2 border-pink/40 shadow-lg"
                            />
                            <p className="text-[8px] font-bold mt-1 line-clamp-1 max-w-[96px]">{selectedTop.name_en}</p>
                          </div>
                        )}

                        <div className="flex flex-col items-center justify-center gap-1 text-pink/60">
                          <span className="text-xs font-serif font-bold">&amp;</span>
                        </div>

                        {selectedBottom && (
                          <div className="relative group text-center">
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-pink text-white text-[7px] font-bold uppercase tracking-wider z-20 shadow-sm">
                              Bottom
                            </span>
                            <img
                              src={selectedBottom.image_url}
                              alt={selectedBottom.name_en}
                              className="w-24 h-32 object-cover rounded-2xl border-2 border-pink/40 shadow-lg"
                            />
                            <p className="text-[8px] font-bold mt-1 line-clamp-1 max-w-[96px]">{selectedBottom.name_en}</p>
                          </div>
                        )}
                      </div>

                      {/* Model Spec Badge */}
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/60 border border-pink/20 text-[8px] opacity-80">
                        Model: 165cm / Wearing Size M
                      </div>
                    </div>
                  ) : (
                    /* Flat Lay View */
                    <div className="w-full py-3 rounded-2xl border border-pink/20 bg-black/25 flex justify-center items-center gap-3">
                      {selectedTop && (
                        <div className="text-center">
                          <img
                            src={selectedTop.image_url}
                            alt={selectedTop.name_en}
                            className="w-20 h-24 object-cover rounded-xl border border-pink/30 shadow-md"
                          />
                        </div>
                      )}
                      <span className="text-pink font-bold">+</span>
                      {selectedBottom && (
                        <div className="text-center">
                          <img
                            src={selectedBottom.image_url}
                            alt={selectedBottom.name_en}
                            className="w-20 h-24 object-cover rounded-xl border border-pink/30 shadow-md"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Top Picker */}
                  <div className="mt-3 space-y-1">
                    <span className="text-[9px] uppercase font-bold text-pink block">1. Select Top / Knitwear:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {tops.slice(0, 3).map((tItem) => (
                        <button
                          key={tItem.id}
                          onClick={() => setSelectedTop(tItem)}
                          className={`p-1 rounded-xl border text-left transition-all ${
                            selectedTop?.id === tItem.id ? "border-pink bg-pink/20 shadow-sm" : "border-pink/10 opacity-70"
                          }`}
                        >
                          <img src={tItem.image_url} className="w-full h-12 object-cover rounded-lg" alt={tItem.name_en} />
                          <p className="text-[8px] font-bold mt-0.5 line-clamp-1">{tItem.name_en}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Picker */}
                  <div className="mt-2 space-y-1">
                    <span className="text-[9px] uppercase font-bold text-pink block">2. Select Bottom / Dress:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {bottoms.slice(0, 3).map((bItem) => (
                        <button
                          key={bItem.id}
                          onClick={() => setSelectedBottom(bItem)}
                          className={`p-1 rounded-xl border text-left transition-all ${
                            selectedBottom?.id === bItem.id ? "border-pink bg-pink/20 shadow-sm" : "border-pink/10 opacity-70"
                          }`}
                        >
                          <img src={bItem.image_url} className="w-full h-12 object-cover rounded-lg" alt={bItem.name_en} />
                          <p className="text-[8px] font-bold mt-0.5 line-clamp-1">{bItem.name_en}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddStudioBundle}
                  className={`w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${
                    studioAdded ? "bg-emerald text-white" : "bg-gradient-to-r from-pink to-coral text-white shadow-md hover:opacity-90"
                  }`}
                >
                  {studioAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t("ထည့်ပြီးပါပြီ", "Added to Cart!")}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t("စတိုင်လ်တစ်ခုလုံး ဝယ်ယူမည်", "Add Look to Bag")}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* ── TAB 4: INSTANT DELIVERY & ORDER TRACKER ── */}
            {activeTab === "checkout" && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Live Order Tracker input */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-pink/15 to-forest-light/20 border border-pink/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-pink">
                      <PackageCheck className="w-3.5 h-3.5" />
                      <span>{t("Live Order Tracking စစ်ဆေးရန်", "Track Existing Order")}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Phone or Order ID (e.g. 09790543312)"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (e.target as HTMLInputElement).value) {
                            const val = (e.target as HTMLInputElement).value
                            setActiveTab("chat")
                            handleSend(val)
                          }
                        }}
                        className={`flex-1 px-2.5 py-1.5 rounded-xl border text-xs focus:outline-none focus:border-pink ${inputBg}`}
                      />
                      <button
                        onClick={(e) => {
                          const siblingInput = (e.currentTarget.previousSibling as HTMLInputElement)?.value
                          if (siblingInput) {
                            setActiveTab("chat")
                            handleSend(siblingInput)
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-pink text-white text-[10px] font-bold uppercase"
                      >
                        Track
                      </button>
                    </div>
                  </div>

                  {/* Township Delivery Lookup */}
                  <div className="p-3 rounded-2xl bg-pink/10 border border-pink/20">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] uppercase font-bold text-pink">Township Delivery Rates</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink/20 text-pink">
                        {selectedTownship.eta}
                      </span>
                    </div>
                    <select
                      value={selectedTownship.name}
                      onChange={(e) => {
                        const found = TOWNSHIPS.find((t) => t.name === e.target.value)
                        if (found) setSelectedTownship(found)
                      }}
                      className={`w-full p-2 rounded-xl border text-xs focus:outline-none focus:border-pink ${inputBg}`}
                    >
                      {TOWNSHIPS.map((tw) => (
                        <option key={tw.name} value={tw.name}>
                          {tw.name} — {tw.fee.toLocaleString()} Ks ({tw.eta})
                        </option>
                      ))}
                    </select>

                    <div className="mt-2 flex justify-between text-[11px] font-semibold">
                      <span>Delivery Fee:</span>
                      <span className="text-pink font-bold">{selectedTownship.fee.toLocaleString()} Ks</span>
                    </div>
                    <div className="flex justify-between text-[10px] opacity-75">
                      <span>Payment Support:</span>
                      <span>{selectedTownship.cod ? "Cash on Delivery (COD) + KPay" : "Prepaid (KPay/WavePay)"}</span>
                    </div>
                  </div>

                  {/* Payment Accounts */}
                  <div className="p-3 rounded-2xl border border-pink/20 bg-black/20 space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-pink">Official Payment Accounts:</span>
                    <div className="flex justify-between items-center text-[10px] bg-pink/5 p-1.5 rounded-lg border border-pink/15">
                      <span>KBZPay: <strong>09790543312</strong></span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("09790543312")
                          toast.success("KBZPay number copied!")
                        }}
                        className="text-pink hover:underline flex items-center gap-0.5 text-[9px]"
                      >
                        <Copy className="w-2.5 h-2.5" /> Copy
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-[10px] bg-pink/5 p-1.5 rounded-lg border border-pink/15">
                      <span>WavePay: <strong>09790543312</strong></span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("09790543312")
                          toast.success("WavePay number copied!")
                        }}
                        className="text-pink hover:underline flex items-center gap-0.5 text-[9px]"
                      >
                        <Copy className="w-2.5 h-2.5" /> Copy
                      </button>
                    </div>
                  </div>

                  {/* Customer Details Form */}
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-bold text-pink">Direct WhatsApp/Viber Order Form:</span>
                    <input
                      type="text"
                      placeholder="Your Name (အမည်)"
                      value={orderCustomerName}
                      onChange={(e) => setOrderCustomerName(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-xl border text-xs focus:outline-none focus:border-pink ${inputBg}`}
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number (ဖုန်းနံပါတ်)"
                      value={orderPhone}
                      onChange={(e) => setOrderPhone(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-xl border text-xs focus:outline-none focus:border-pink ${inputBg}`}
                    />
                    <input
                      type="text"
                      placeholder="Street / Ward Address (အသေးစိတ် လိပ်စာ)"
                      value={orderAddress}
                      onChange={(e) => setOrderAddress(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-xl border text-xs focus:outline-none focus:border-pink ${inputBg}`}
                    />
                  </div>
                </div>

                <button
                  onClick={handleCreateOrderDirect}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:opacity-90"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t("WhatsApp ဖြင့် အော်ဒါချက်ချင်းတင်မည်", "Send Order via WhatsApp")}</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

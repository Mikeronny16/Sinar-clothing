import type { Product } from "./supabase"
import { SITE, messengerUrl, viberLink, whatsappUrl } from "@/config"

export interface PaymentSlipData {
  image: string
  method: "KBZPay" | "WavePay" | "Cash on Delivery"
  amount?: string
  date: string
  status: "pending" | "verified"
}

export interface BotMessage {
  id: string
  sender: "user" | "bot" | "admin"
  text: string
  products?: Product[]
  quickReplies?: { label_mm: string; label_en: string; prompt: string }[]
  timestamp: string
  isSizeCalculator?: boolean
  isContactAction?: boolean
  isPromoCode?: boolean
  isOrderTracker?: boolean
  trackingData?: OrderTrackingResult
  uploadedImage?: string
  paymentSlip?: PaymentSlipData
  adminName?: string
}

export interface SizeRecommendation {
  size: "S" | "M" | "L" | "XL"
  reason_mm: string
  reason_en: string
}

// ── Admin Live Chat Storage & Event Bridge ──
export const ADMIN_CHAT_EVENT = "sinar_live_admin_message"
export const CUSTOMER_INQUIRY_EVENT = "sinar_customer_inquiry_message"
export const LIVE_CHAT_STORAGE_KEY = "sinar_live_sessions_v1"

export interface CustomerSession {
  id: string
  customerName: string
  phone?: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  messages: BotMessage[]
  channel?: "web" | "messenger" | "viber"
  isLiveAdminConnected?: boolean
}

export function dispatchAdminMessage(sessionId: string, text: string, adminName = "Sinar Boutique Admin") {
  const adminMsg: BotMessage = {
    id: `admin-${Date.now()}`,
    sender: "admin",
    text,
    adminName,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }

  // Broadcast to windows
  window.dispatchEvent(
    new CustomEvent(ADMIN_CHAT_EVENT, {
      detail: { sessionId, message: adminMsg },
    })
  )

  return adminMsg
}

// ── Order Tracking Models & Engine ──
export interface OrderTrackingStep {
  title_mm: string
  title_en: string
  time: string
  completed: boolean
  current: boolean
}

export interface OrderTrackingResult {
  orderId: string
  customerName: string
  phone: string
  status_mm: string
  status_en: string
  courier: string
  trackingNo: string
  township: string
  eta: string
  items: { name: string; price: number; qty: number }[]
  total: number
  steps: OrderTrackingStep[]
}

const DEMO_ORDERS: Record<string, OrderTrackingResult> = {
  "09790543312": {
    orderId: "SN-9824",
    customerName: "Ma Thandar",
    phone: "09790543312",
    status_mm: "ပို့ဆောင်ဆဲ (အိမ်အရောက် လာနေပါပြီ)",
    status_en: "Out for Delivery (On the way)",
    courier: "Royal Express Courier",
    trackingNo: "REX-882910-MM",
    township: "Shansu, Myitkyina",
    eta: "ယနေ့ ညနေ ၄:၀၀ နာရီမတိုင်မီ",
    items: [
      { name: "Floral Linen Blouse", price: 18000, qty: 1 },
      { name: "High Waist Jeans", price: 22000, qty: 1 },
    ],
    total: 40000,
    steps: [
      { title_mm: "အော်ဒါ လက်ခံပြီးပါပြီ", title_en: "Order Placed & Confirmed", time: "မနေ့က ၁၀:၃၀ AM", completed: true, current: false },
      { title_mm: "ပစ္စည်း စစ်ဆေးထုပ်ပိုးပြီး", title_en: "Quality Checked & Packed", time: "မနေ့က ၀၃:၀၀ PM", completed: true, current: false },
      { title_mm: "အမြန်ချောပို့သို့ လွှဲပြောင်းပြီး", title_en: "Handed over to Express", time: "ယနေ့ ၀၉:၀၀ AM", completed: true, current: false },
      { title_mm: "အိမ်အရောက် ပို့ဆောင်နေပါသည်", title_en: "Out for Delivery to Your Door", time: "ယနေ့ ၀၁:၁၅ PM", completed: true, current: true },
      { title_mm: "ပစ္စည်း လက်ခံရရှိပြီး", title_en: "Delivered", time: "ခန့်မှန်း ၄:၀၀ PM", completed: false, current: false },
    ],
  },
  "SN-9824": {
    orderId: "SN-9824",
    customerName: "Ma Thandar",
    phone: "09790543312",
    status_mm: "ပို့ဆောင်ဆဲ (အိမ်အရောက် လာနေပါပြီ)",
    status_en: "Out for Delivery (On the way)",
    courier: "Royal Express Courier",
    trackingNo: "REX-882910-MM",
    township: "Shansu, Myitkyina",
    eta: "ယနေ့ ညနေ ၄:၀၀ နာရီမတိုင်မီ",
    items: [
      { name: "Floral Linen Blouse", price: 18000, qty: 1 },
      { name: "High Waist Jeans", price: 22000, qty: 1 },
    ],
    total: 40000,
    steps: [
      { title_mm: "အော်ဒါ လက်ခံပြီးပါပြီ", title_en: "Order Placed & Confirmed", time: "မနေ့က ၁၀:၃၀ AM", completed: true, current: false },
      { title_mm: "ပစ္စည်း စစ်ဆေးထုပ်ပိုးပြီး", title_en: "Quality Checked & Packed", time: "မနေ့က ၀၃:၀၀ PM", completed: true, current: false },
      { title_mm: "အမြန်ချောပို့သို့ လွှဲပြောင်းပြီး", title_en: "Handed over to Express", time: "ယနေ့ ၀၉:၀၀ AM", completed: true, current: false },
      { title_mm: "အိမ်အရောက် ပို့ဆောင်နေပါသည်", title_en: "Out for Delivery to Your Door", time: "ယနေ့ ၀၁:၁၅ PM", completed: true, current: true },
      { title_mm: "ပစ္စည်း လက်ခံရရှိပြီး", title_en: "Delivered", time: "ခန့်မှန်း ၄:၀၀ PM", completed: false, current: false },
    ],
  },
}

export function lookupOrder(queryInput: string): OrderTrackingResult {
  const clean = queryInput.replace(/\D/g, "")
  if (DEMO_ORDERS[clean]) return DEMO_ORDERS[clean]
  if (DEMO_ORDERS[queryInput.toUpperCase()]) return DEMO_ORDERS[queryInput.toUpperCase()]

  const generatedId = `SN-${Math.floor(1000 + Math.random() * 9000)}`
  return {
    orderId: queryInput.startsWith("SN") ? queryInput.toUpperCase() : generatedId,
    customerName: "Valued Customer",
    phone: queryInput,
    status_mm: "အမြန်ချောပို့ဖြင့် ပို့ဆောင်နေပါသည် (In Transit)",
    status_en: "In Transit with Courier",
    courier: "Sinar Express Partner",
    trackingNo: `SN-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
    township: "Myitkyina / Kachin",
    eta: "၁-၂ ရက်အတွင်း အိမ်အရောက်",
    items: [
      { name: "Pastel Midi Dress", price: 28000, qty: 1 },
      { name: "Beige Knit Cardigan", price: 25000, qty: 1 },
    ],
    total: 53000,
    steps: [
      { title_mm: "အော်ဒါ အတည်ပြုပြီးပါပြီ", title_en: "Order Confirmed", time: "Yesterday", completed: true, current: false },
      { title_mm: "ထုပ်ပိုးစစ်ဆေးပြီးပါပြီ", title_en: "Packed & Prepared", time: "Yesterday", completed: true, current: false },
      { title_mm: "ချောပို့သို့ အပ်နှံပြီး", title_en: "Dispatched to Courier", time: "Today Morning", completed: true, current: true },
      { title_mm: "ပစ္စည်း အိမ်အရောက် လက်ခံရရှိ", title_en: "Delivered", time: "Expected Tomorrow", completed: false, current: false },
    ],
  }
}

// ── Sinar Size Table Knowledge ──
export const SIZE_CHART = [
  { size: "S", bustMin: 80, bustMax: 84, waistMin: 60, waistMax: 64, hipMin: 86, hipMax: 90, heightMin: 155, heightMax: 160, weightMin: 40, weightMax: 48 },
  { size: "M", bustMin: 85, bustMax: 90, waistMin: 65, waistMax: 70, hipMin: 91, hipMax: 96, heightMin: 160, heightMax: 165, weightMin: 49, weightMax: 55 },
  { size: "L", bustMin: 91, bustMax: 96, waistMin: 71, waistMax: 76, hipMin: 97, hipMax: 102, heightMin: 163, heightMax: 168, weightMin: 56, weightMax: 63 },
  { size: "XL", bustMin: 97, bustMax: 104, waistMin: 77, waistMax: 84, hipMin: 103, hipMax: 110, heightMin: 165, heightMax: 172, weightMin: 64, weightMax: 75 },
]

export function calculateRecommendedSize(params: {
  heightCm?: number
  weightKg?: number
  bustCm?: number
  waistCm?: number
}): SizeRecommendation {
  const { heightCm, weightKg, bustCm } = params

  if (bustCm) {
    if (bustCm <= 84) return { size: "S", reason_mm: `ရင်ဝိုင်း ${bustCm}cm အရ Size S က အသင့်တော်ဆုံး ဖြစ်ပါတယ်ရှင်။`, reason_en: `Based on your bust size of ${bustCm}cm, Size S is your best fit.` }
    if (bustCm <= 90) return { size: "M", reason_mm: `ရင်ဝိုင်း ${bustCm}cm အရ Size M က အသင့်တော်ဆုံး ဖြစ်ပါတယ်ရှင်။`, reason_en: `Based on your bust size of ${bustCm}cm, Size M is your best fit.` }
    if (bustCm <= 96) return { size: "L", reason_mm: `ရင်ဝိုင်း ${bustCm}cm အရ Size L က အသင့်တော်ဆုံး ဖြစ်ပါတယ်ရှင်။`, reason_en: `Based on your bust size of ${bustCm}cm, Size L is your best fit.` }
    return { size: "XL", reason_mm: `ရင်ဝိုင်း ${bustCm}cm အရ Size XL က အသင့်တော်ဆုံး ဖြစ်ပါတယ်ရှင်။`, reason_en: `Based on your bust size of ${bustCm}cm, Size XL is your best fit.` }
  }

  if (weightKg) {
    if (weightKg <= 48) return { size: "S", reason_mm: `ကိုယ်အလေးချိန် ${weightKg}kg အရ Size S အဆင်ပြေပါတယ်ရှင်။`, reason_en: `Based on your weight of ${weightKg}kg, Size S should fit you comfortably.` }
    if (weightKg <= 55) return { size: "M", reason_mm: `ကိုယ်အလေးချိန် ${weightKg}kg အရ Size M အဆင်ပြေပါတယ်ရှင်။`, reason_en: `Based on your weight of ${weightKg}kg, Size M should fit you comfortably.` }
    if (weightKg <= 63) return { size: "L", reason_mm: `ကိုယ်အလေးချိန် ${weightKg}kg အရ Size L အဆင်ပြေပါတယ်ရှင်။`, reason_en: `Based on your weight of ${weightKg}kg, Size L should fit you comfortably.` }
    return { size: "XL", reason_mm: `ကိုယ်အလေးချိန် ${weightKg}kg အရ Size XL အဆင်ပြေပါတယ်ရှင်။`, reason_en: `Based on your weight of ${weightKg}kg, Size XL should fit you comfortably.` }
  }

  if (heightCm) {
    if (heightCm <= 160) return { size: "S", reason_mm: `အရပ် ${heightCm}cm အရ Size S ရွေးချယ်နိုင်ပါတယ်ရှင်။`, reason_en: `For height ${heightCm}cm, Size S is recommended.` }
    if (heightCm <= 165) return { size: "M", reason_mm: `အရပ် ${heightCm}cm အရ Size M ရွေးချယ်နိုင်ပါတယ်ရှင်။`, reason_en: `For height ${heightCm}cm, Size M is recommended.` }
    if (heightCm <= 168) return { size: "L", reason_mm: `အရပ် ${heightCm}cm အရ Size L ရွေးချယ်နိုင်ပါတယ်ရှင်။`, reason_en: `For height ${heightCm}cm, Size L is recommended.` }
    return { size: "XL", reason_mm: `အရပ် ${heightCm}cm အရ Size XL ရွေးချယ်နိုင်ပါတယ်ရှင်။`, reason_en: `For height ${heightCm}cm, Size XL is recommended.` }
  }

  return { size: "M", reason_mm: "Standard standard size ဖြစ်တဲ့ Size M ကို အကြံပြုပါတယ်ရှင်။", reason_en: "We recommend our standard Size M for versatile comfort." }
}

// ── Color Mood Boards ──
export interface ColorMood {
  id: string
  name_mm: string
  name_en: string
  icon: string
  colors: string[]
  description_mm: string
  description_en: string
  categories: string[]
}

export const COLOR_MOODS: ColorMood[] = [
  {
    id: "pastel",
    name_mm: "Pastel Dream (ပန်းနုနု)",
    name_en: "Pastel Dream",
    icon: "🌸",
    colors: ["#F9D6DC", "#FDE2E4", "#E2ECE9"],
    description_mm: "နူးညံ့အေးချမ်းပြီး ဓာတ်ပုံလှတဲ့ ပန်းနုရောင် pastel စတိုင်လ်",
    description_en: "Soft, dreamy pastels perfect for aesthetic cafe pictures.",
    categories: ["Dresses", "Tops"],
  },
  {
    id: "earthy",
    name_mm: "Earthy Botanical (သဘာဝသစ်တော)",
    name_en: "Earthy Botanical",
    icon: "🌿",
    colors: ["#0F2D1C", "#8C9C92", "#FAF6EF"],
    description_mm: "သဘာဝဆန်ဆန် သက်တောင့်သက်သာရှိပြီး ရိုးရှင်းလှပသော အစိမ်းနုစတိုင်လ်",
    description_en: "Grounded organic tones and comfortable breathable linen.",
    categories: ["Tops", "Jeans", "Cardigans"],
  },
  {
    id: "cozy",
    name_mm: "Cozy Knitwear (နွေးထွေးဆန်းသစ်)",
    name_en: "Cozy Beige & Knit",
    icon: "🧶",
    colors: ["#EAD7C5", "#C28773", "#FAF6EF"],
    description_mm: "Beige & Ivory အရောင်သန်း နူးညံ့လှပသော ဆွယ်တာ ကာဒီဂင်စတိုင်လ်",
    description_en: "Warm textures, ivory knits, and comfortable layers.",
    categories: ["Cardigans", "Sweaters"],
  },
  {
    id: "minimal",
    name_mm: "Modern Chic (ခေတ်မီဆန်းသစ်)",
    name_en: "Modern Chic",
    icon: "✨",
    colors: ["#1A1611", "#C28773", "#FAF6EF"],
    description_mm: "High waist jeans နှင့် လှပသပ်ရပ်သော modern streetwear စတိုင်လ်",
    description_en: "Flattering cuts, sleek silhouettes, and effortless elegance.",
    categories: ["Jeans", "Tops"],
  },
]

// ── Style Persona Quiz ──
export interface QuizQuestion {
  id: number
  title_mm: string
  title_en: string
  options: {
    label_mm: string
    label_en: string
    icon: string
    vibe: string
  }[]
}

export const STYLE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    title_mm: "သင် အနှစ်သက်ဆုံး ဖက်ရှင်စတိုင်လ်က ဘာလဲရှင်?",
    title_en: "What is your go-to fashion vibe?",
    options: [
      { label_mm: "နူးညံ့ချစ်စရာ Floral & Dress", label_en: "Romantic & Floral Dresses", icon: "🌸", vibe: "romantic" },
      { label_mm: "သက်တောင့်သက်သာ Cozy Knitwear", label_en: "Cozy Knits & Cardigans", icon: "🧶", vibe: "cozy" },
      { label_mm: "ရိုးရှင်းခေတ်မီ Casual Chic & Jeans", label_en: "Casual Chic & High Waist Jeans", icon: "👖", vibe: "casual" },
      { label_mm: "ပေါ့ပါးလန်းဆန်း Linen Blouses", label_en: "Breezy Linen & Relaxed Tops", icon: "🌿", vibe: "breezy" },
    ],
  },
  {
    id: 2,
    title_mm: "ဘယ်လို အခမ်းအနားတွေအတွက် အများဆုံး ဝတ်ဆင်လေ့ရှိပါသလဲ?",
    title_en: "Where do you spend most of your dressed-up days?",
    options: [
      { label_mm: "Cafe ချိန်းတွေ့ & ဓာတ်ပုံရိုက်ခရီးစဉ်", label_en: "Cafe Dates & Photo Outings", icon: "☕", vibe: "cafe" },
      { label_mm: "ရုံး & နေ့စဉ် Daily Outfits", label_en: "Work, College & Daily Wear", icon: "💼", vibe: "work" },
      { label_mm: "ပိတ်ရက် အပန်းဖြေ & ခရီးသွား", label_en: "Weekend Trips & Vacations", icon: "🏖️", vibe: "vacay" },
      { label_mm: "ညနေခင်း ပါတီ & မင်္ဂလာဆောင်", label_en: "Evening Dinners & Events", icon: "✨", vibe: "evening" },
    ],
  },
  {
    id: 3,
    title_mm: "သင် အကြိုက်နှစ်သက်ဆုံး အရောင် Palette က ဘာလဲရှင်?",
    title_en: "Which color palette speaks to your heart?",
    options: [
      { label_mm: "Pastel & Soft Pink (ပန်းနုရောင်)", label_en: "Pastel Pinks & Soft Peach", icon: "🌷", vibe: "pastel" },
      { label_mm: "Beige & Ivory (သဘာဝနူးညံ့ရောင်)", label_en: "Warm Beige & Cream Ivory", icon: "🍂", vibe: "beige" },
      { label_mm: "Forest Green & Deep tones (အစိမ်းရင့်)", label_en: "Forest Green & Earthy Tones", icon: "🌲", vibe: "earthy" },
      { label_mm: "Denim Blue & Classic (ဂျင်းပြာ)", label_en: "Classic Blue Denim & White", icon: "🌊", vibe: "denim" },
    ],
  },
]

export interface StylePersonaResult {
  title_mm: string
  title_en: string
  subtitle_mm: string
  subtitle_en: string
  tag: string
  recommendedCategories: string[]
}

export function evaluateQuizResult(answers: string[]): StylePersonaResult {
  const isRomantic = answers.includes("romantic") || answers.includes("pastel")
  const isCozy = answers.includes("cozy") || answers.includes("beige")
  const isEarth = answers.includes("earthy") || answers.includes("breezy")

  if (isRomantic) {
    return {
      title_mm: "🌸 The Romantic Dreamer",
      title_en: "🌸 The Romantic Dreamer",
      subtitle_mm: "နူးညံ့သိမ်မွေ့ပြီး ချစ်စရာကောင်းသော Pastel & Floral Dress စတိုင်လ်",
      subtitle_en: "Feminine, graceful, and photogenic soft pastels that radiate warmth.",
      tag: "Romantic",
      recommendedCategories: ["Dresses", "Tops"],
    }
  }

  if (isCozy) {
    return {
      title_mm: "🧶 The Cozy Minimalist",
      title_en: "🧶 The Cozy Minimalist",
      subtitle_mm: "Beige, Ivory & Knitwear ဖြင့် နွေးထွေးသက်တောင့်သက်သာရှိသော စတိုင်လ်",
      subtitle_en: "Effortless comfort with lush knit cardigans and soft neutral layering.",
      tag: "Cozy Minimalist",
      recommendedCategories: ["Cardigans", "Sweaters", "Tops"],
    }
  }

  if (isEarth) {
    return {
      title_mm: "🌿 The Botanical Muse",
      title_en: "🌿 The Botanical Muse",
      subtitle_mm: "သဘာဝဆန်ပြီး ပေါ့ပါးလွတ်လပ်သော Linen & Flowy စတိုင်လ်",
      subtitle_en: "Organic linen textures and earthy vibes tailored for natural elegance.",
      tag: "Botanical Muse",
      recommendedCategories: ["Tops", "Dresses", "Jeans"],
    }
  }

  return {
    title_mm: "✨ The Casual Chic Icon",
    title_en: "✨ The Casual Chic Icon",
    subtitle_mm: "High waist jeans နှင့် stylish tops ဖြင့် နေ့စဉ် ခေတ်မီလှပသော စတိုင်လ်",
    subtitle_en: "Timeless denim pairings with elevated basics for everyday chic.",
    tag: "Casual Chic",
    recommendedCategories: ["Jeans", "Tops", "Cardigans"],
  }
}

// ── Townships Delivery Knowledge ──
export interface TownshipDeliveryInfo {
  name: string
  region: "Myitkyina" | "Kachin" | "Other"
  fee: number
  eta: string
  cod: boolean
}

export const TOWNSHIPS: TownshipDeliveryInfo[] = [
  // Myitkyina (in town)
  { name: "Shansu (ရှမ်းစု)", region: "Myitkyina", fee: 2000, eta: "Same Day - 1 Day", cod: true },
  { name: "Thida (သီတာ)", region: "Myitkyina", fee: 2000, eta: "Same Day - 1 Day", cod: true },
  { name: "Tatkone (တပ်ကုန်း)", region: "Myitkyina", fee: 2000, eta: "Same Day - 1 Day", cod: true },
  { name: "Shatapru (ရှတားပရူ)", region: "Myitkyina", fee: 2000, eta: "Same Day - 1 Day", cod: true },
  { name: "Aungnan (အောင်နန်း)", region: "Myitkyina", fee: 2000, eta: "Same Day - 1 Day", cod: true },
  { name: "Zay Gyi / Downtown (ဈေးကြီး)", region: "Myitkyina", fee: 2000, eta: "Same Day - 1 Day", cod: true },
  { name: "Dukahtaung (ဒူးခေါင်တောင်)", region: "Myitkyina", fee: 2500, eta: "1 Day", cod: true },
  { name: "Sitapu (ဆီတာပူး)", region: "Myitkyina", fee: 2500, eta: "1 Day", cod: true },
  { name: "Myothit (မြို့သစ်)", region: "Myitkyina", fee: 2500, eta: "1 Day", cod: true },
  { name: "Pamati (ပမ်းမတီး)", region: "Myitkyina", fee: 2500, eta: "1 Day", cod: true },

  // Kachin State
  { name: "Waingmaw (ဝိုင်းမော်)", region: "Kachin", fee: 3000, eta: "1-2 Days", cod: true },
  { name: "Mohnyin (မိုးညှင်း)", region: "Kachin", fee: 3500, eta: "2-3 Days", cod: false },
  { name: "Moegaung (မိုးကောင်း)", region: "Kachin", fee: 3500, eta: "2-3 Days", cod: false },
  { name: "Bhamo (ဗန်းမော်)", region: "Kachin", fee: 4000, eta: "2-3 Days", cod: false },
  { name: "Hpakant (ဖားကန့်)", region: "Kachin", fee: 4000, eta: "2-3 Days", cod: false },
  { name: "Putao (ပူတာအို)", region: "Kachin", fee: 5000, eta: "3-4 Days", cod: false },

  // Other Regions
  { name: "Mandalay (မန္တလေး)", region: "Other", fee: 4500, eta: "2-3 Days", cod: false },
  { name: "Yangon (ရန်ကုန်)", region: "Other", fee: 5000, eta: "3-4 Days", cod: false },
  { name: "Naypyidaw (နေပြည်တော်)", region: "Other", fee: 5000, eta: "3-4 Days", cod: false },
  { name: "Lashio (လားရှိုး)", region: "Other", fee: 4500, eta: "3 Days", cod: false },
  { name: "Taunggyi (တောင်ကြီး)", region: "Other", fee: 5000, eta: "3-4 Days", cod: false },
  { name: "Pyin Oo Lwin (ပြင်ဦးလွင်)", region: "Other", fee: 4500, eta: "3 Days", cod: false },
  { name: "Other Township (အခြားမြို့နယ်များ - ဂိတ်ချ)", region: "Other", fee: 4500, eta: "2-4 Days", cod: false },
]

export const INITIAL_QUICK_REPLIES = [
  { label_mm: "👗 စတိုင်လ် လှလှလေးများ", label_en: "👗 Trendy Outfits", prompt: "Show me trending outfits" },
  { label_mm: "👰 မင်္ဂလာဆောင် / ပွဲတက်", label_en: "👰 Wedding & Events", prompt: "I need a wedding guest dress" },
  { label_mm: "📦 အော်ဒါ စစ်ဆေးမည်", label_en: "📦 Track My Order", prompt: "Track my order" },
  { label_mm: "🌸 Floral & Blouses", label_en: "🌸 Floral & Blouses", prompt: "Show me blouses and tops" },
  { label_mm: "☕ Cafe & Date Look", label_en: "☕ Cafe & Date Look", prompt: "Outfit idea for a cafe date" },
  { label_mm: "🎁 10% Discount Code", label_en: "🎁 10% Discount Code", prompt: "Get promo discount code" },
  { label_mm: "📏 Size အကြံပြုချက်", label_en: "📏 Size Advisor", prompt: "Help me find my size" },
  { label_mm: "💬 ဆိုင်ရှင်နှင့် တိုက်ရိုက်ပြောမည်", label_en: "💬 Live Admin Support", prompt: "Connect me with shop admin" },
]

// ── Visual Image Matcher ──
export function analyzeUploadedOutfitImage(
  imagePreview: string,
  catalog: Product[],
  lang: "mm" | "en"
): Omit<BotMessage, "id" | "timestamp"> {
  const isMm = lang === "mm"

  const matches = [
    catalog.find((p) => p.category === "Tops") || catalog[0],
    catalog.find((p) => p.category === "Dresses") || catalog[1],
    catalog.find((p) => p.category === "Cardigans") || catalog[2],
  ].filter(Boolean) as Product[]

  return {
    sender: "bot",
    text: isMm
      ? "📸 **Visual Style AI Analyzer** ဖြင့် သင့်ရဲ့ ပုံကို စစ်ဆေးပြီးပါပြီရှင်!\n\nဓာတ်ပုံပါ aesthetic နှင့် အရောင် palette နှင့် အနီးစပ်ဆုံး တူညီသော Sinar ရဲ့ ချစ်စရာ ဝတ်စုံလေးများကို အကြံပြုပေးလိုက်ပါတယ်ရှင် ✨👇"
      : "📸 **Visual AI Style Match Found!**\n\nI analyzed your uploaded outfit inspiration. Here are the closest matching pieces from our boutique collection ✨👇",
    products: matches,
    uploadedImage: imagePreview,
    quickReplies: [
      { label_mm: "📏 Size အကြံပြုချက်", label_en: "📏 Size Advisor", prompt: "Help me find my size" },
      { label_mm: "🚚 ပို့ဆောင်ခ တွက်ချက်မည်", label_en: "🚚 Delivery Info", prompt: "Delivery and shipping info" },
    ],
  }
}

export async function processUserQuery(
  rawInput: string,
  catalog: Product[],
  lang: "mm" | "en"
): Promise<Omit<BotMessage, "id" | "timestamp">> {
  const query = rawInput.trim().toLowerCase()

  // 1. Try Gemini API if API key is provided
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (apiKey) {
    try {
      const geminiResponse = await callGeminiStylist(query, catalog, lang, apiKey)
      if (geminiResponse) return geminiResponse
    } catch (e) {
      console.warn("Gemini API fallback to local bot engine:", e)
    }
  }

  // 2. Intelligent Built-in Rule & Semantic Matcher
  return localBotEngine(rawInput, query, catalog, lang)
}

function localBotEngine(
  rawInput: string,
  query: string,
  catalog: Product[],
  lang: "mm" | "en"
): Omit<BotMessage, "id" | "timestamp"> {
  const isMm = lang === "mm"

  // ── 1. WEDDING / FORMAL / EVENT / BRIDAL QUERIES ──
  if (
    query.includes("wedding") ||
    query.includes("bride") ||
    query.includes("bridal") ||
    query.includes("မင်္ဂလာဆောင်") ||
    query.includes("ပွဲတက်") ||
    query.includes("ညစာစားပွဲ") ||
    query.includes("party") ||
    query.includes("gala") ||
    query.includes("event") ||
    query.includes("dinner") ||
    query.includes("prom")
  ) {
    const dresses = catalog.filter((p) => p.category === "Dresses")
    const cardigans = catalog.filter((p) => p.category === "Cardigans")
    const weddingMatches = [...dresses, ...cardigans].slice(0, 3)

    return {
      sender: "bot",
      text: isMm
        ? "👰✨ **မင်္ဂလာဆောင် & ပွဲတက် ဝတ်စုံ အကြံပြုချက်**:\n\nမင်္ဂလာဆောင်အခမ်းအနား (သို့) Dinner Party များအတွက် နူးညံ့သိမ်မွေ့ပြီး ဓာတ်ပုံအရမ်းလှစေမယ့် **Pastel Midi Dress** နှင့် **Flowy Maxi Dress** များကို အကြံပြုပါရစေရှင်!\n\nအေးအေးလူလူ ပွဲတက်ချင်ပါက **Beige Knit Cardigan** လေးနှင့် တွဲဖက်ဝတ်ဆင်နိုင်ပြီး အလွန် ကြော့ရှင်းလှပစေပါတယ်ရှင် 👇"
        : "👰✨ **Wedding & Special Occasion Style Guide**:\n\nFor weddings, galas, and elegant evening dinners, we recommend graceful silhouettes like our **Pastel Midi Dress** or **Flowy Maxi Dress**.\n\nPairing a flowy dress with a soft **Beige Knit Cardigan** creates an effortless, sophisticated look that photographs beautifully! 👇",
      products: weddingMatches.length > 0 ? weddingMatches : catalog.slice(0, 3),
      quickReplies: [
        { label_mm: "📏 Size အကြံပြုချက်", label_en: "📏 Size Advisor", prompt: "Help me find my size" },
        { label_mm: "🚚 ပို့ဆောင်ခ မေးမည်", label_en: "🚚 Delivery Info", prompt: "Delivery and shipping info" },
        { label_mm: "💬 Admin နှင့် တိုက်ရိုက်ပြောမည်", label_en: "💬 Live Admin Chat", prompt: "Connect me with shop admin" },
      ],
    }
  }

  // ── 2. WORK / OFFICE / FORMAL MEETING ──
  if (query.includes("office") || query.includes("work") || query.includes("interview") || query.includes("ရုံးဝတ်") || query.includes("အလုပ်")) {
    const workMatches = [
      catalog.find((p) => p.category === "Tops") || catalog[0],
      catalog.find((p) => p.category === "Cardigans") || catalog[1],
      catalog.find((p) => p.category === "Jeans") || catalog[2],
    ].filter(Boolean) as Product[]

    return {
      sender: "bot",
      text: isMm
        ? "💼 **Office & Work Chic Style**:\nရုံးတက်နှင့် အလုပ်ကိစ္စများအတွက် သပ်ရပ်ပြီး professional ဆန်စေမည့် **Linen Blouse**, **Beige Knit Cardigan** နှင့် **High Waist Jeans** တွဲဖက်မှုကို အကြံပြုပါတယ်ရှင် 👇"
        : "💼 **Office & Work Wear Styling**:\nFor professional yet comfortable daywear, we recommend pairing our breathable **Linen Blouse** with a **Beige Cardigan** and structured **High Waist Jeans** 👇",
      products: workMatches,
      quickReplies: [
        { label_mm: "🌸 Tops များ ရှာမည်", label_en: "🌸 Show Tops", prompt: "Show me blouses and tops" },
        { label_mm: "👖 Jeans များ ရှာမည်", label_en: "👖 Show Jeans", prompt: "Show me jeans" },
      ],
    }
  }

  // ── 3. BEACH / VACATION / RESORT ──
  if (query.includes("beach") || query.includes("vacation") || query.includes("trip") || query.includes("summer") || query.includes("ကမ်းခြေ") || query.includes("ခရီးသွား")) {
    const vacayMatches = [
      catalog.find((p) => p.category === "Dresses") || catalog[0],
      catalog.find((p) => p.category === "Tops") || catalog[1],
    ].filter(Boolean) as Product[]

    return {
      sender: "bot",
      text: isMm
        ? "🏖️ **Beach & Vacation Outfits**:\nကမ်းခြေနှင့် ခရီးသွားရာတွင် လေတိုက်တိုင်း ပေါ့ပါးလွင့်မျောနေမယ့် **Flowy Maxi Dress** နှင့် ချွေးစုပ်အေးမြသော **Floral Linen Blouse** တို့က အကောင်းဆုံးပါရှင် ✨👇"
        : "🏖️ **Beach & Resort Holiday Styling**:\nBreezy, lightweight, and vibrant. Our **Flowy Maxi Dress** and **Floral Linen Blouse** are made for sunkissed vacation photos ✨👇",
      products: vacayMatches,
      quickReplies: [
        { label_mm: "👗 Dresses အားလုံး", label_en: "👗 All Dresses", prompt: "Show me dresses" },
        { label_mm: "📏 Size အကြံပြုချက်", label_en: "📏 Size Advisor", prompt: "Help me find my size" },
      ],
    }
  }

  // ── 4. LIVE ADMIN / HUMAN AGENT REQUEST ──
  if (
    query.includes("human") ||
    query.includes("admin") ||
    query.includes("owner") ||
    query.includes("ဆိုင်ရှင်") ||
    query.includes("လူနဲ့ပြော") ||
    query.includes("connect") ||
    query.includes("live chat") ||
    query.includes("အကူအညီ")
  ) {
    return {
      sender: "bot",
      text: isMm
        ? `👑 **Sinar Boutique Admin (ဆိုင်ရှင်) ထံသို့ တိုက်ရိုက် ဆက်သွယ်ရန်**:\n\n• Admin Dashboard ထံသို့ သင့်စကားပြောဆိုမှုကို အသိပေးထားပါသည်\n• သို့မဟုတ် အောက်ပါ Viber / WhatsApp မှတစ်ဆင့် အမြန်ဆုံး စကားပြောဆိုနိုင်ပါသည်ရှင် 👇`
        : `👑 **Connect Directly with Sinar Shop Owner / Live Admin**:\n\n• Our admin console has been notified of your inquiry.\n• You can also reach our direct hotline on Viber or WhatsApp below 👇`,
      isContactAction: true,
      quickReplies: [
        { label_mm: "📱 Viber ဖြင့် ပြောမည်", label_en: "📱 Chat on Viber", prompt: "Viber support" },
        { label_mm: "💬 WhatsApp ဖြင့် ပြောမည်", label_en: "💬 Chat on WhatsApp", prompt: "WhatsApp support" },
      ],
    }
  }

  // ── 5. ORDER TRACKING ──
  if (query.includes("track") || query.includes("order") || query.includes("အော်ဒါ") || query.includes("ပါဆယ်") || query.includes("ရောက်") || query.includes("စစ်ဆေး") || query.startsWith("sn-") || query.startsWith("09")) {
    const isDirectNumber = query.match(/^09\d{7,9}$/) || query.match(/^sn-\d{3,6}$/i)
    if (isDirectNumber) {
      const trackData = lookupOrder(query)
      return {
        sender: "bot",
        text: isMm
          ? `📦 **Order ID: ${trackData.orderId}** ၏ လက်ရှိ ပို့ဆောင်မှု အခြေအနေ:\n\n• လက်ရှိ အခြေအနေ: **${trackData.status_mm}**\n• အမြန်ချောပို့: **${trackData.courier}**\n• ခန့်မှန်း ရောက်ရှိချိန်: **${trackData.eta}**`
          : `📦 **Live Tracking for Order: ${trackData.orderId}**\n\n• Status: **${trackData.status_en}**\n• Courier: **${trackData.courier}**\n• Estimated Arrival: **${trackData.eta}**`,
        isOrderTracker: true,
        trackingData: trackData,
        quickReplies: [
          { label_mm: "💬 Admin ထံ မေးမြန်းမည်", label_en: "💬 Contact Admin", prompt: "Connect me with shop admin" },
          { label_mm: "👗 အသစ်များ ဆက်လက်ကြည့်မည်", label_en: "👗 Browse Shop", prompt: "Show me trending outfits" },
        ],
      }
    }

    return {
      sender: "bot",
      text: isMm
        ? "📦 **Sinar Live Order Tracker** မှ ကြိုဆိုပါတယ်ရှင်!\n\nသင့်ရဲ့ **ဖုန်းနံပါတ်** (ဥပမာ- `09790543312`) သို့မဟုတ် **Order Code** (ဥပမာ- `SN-9824`) ကို စာရိုက်ပို့ပေးပါရှင်။ ပစ္စည်းရောက်ရှိမှု အဆင့်ဆင့်ကို ချက်ချင်း စစ်ဆေးပြသပေးပါမည်။"
        : "📦 **Sinar Live Order Tracker**:\nPlease type your **Phone Number** (e.g. `09790543312`) or **Order ID** (e.g. `SN-9824`) to view your real-time parcel delivery status!",
      quickReplies: [
        { label_mm: "Sample: 09790543312", label_en: "Sample: 09790543312", prompt: "09790543312" },
        { label_mm: "Sample: SN-9824", label_en: "Sample: SN-9824", prompt: "SN-9824" },
      ],
    }
  }

  // ── 6. PROMO / DISCOUNT CODE ──
  if (query.includes("promo") || query.includes("discount") || query.includes("code") || query.includes("coupon") || query.includes("လျော့ဈေး") || query.includes("ကူပွန်")) {
    return {
      sender: "bot",
      text: isMm
        ? "🎁 **Sinar VIP AI Discount Code** ရရှိပါပြီရှင်!\n\nကုဒ် **`SINARAI10`** ကို အသုံးပြုပြီး ပထမဆုံး အော်ဒါအတွက် **10% OFF** လျှော့ဈေး ချက်ချင်း ရယူနိုင်ပါတယ်ရှင် ✨\n\nCheckout ပြုလုပ်ချိန်တွင် ကုဒ်ထည့်သွင်းပေးပါရန် မေတ္တာရပ်ခံအပ်ပါသည်!"
        : "🎁 **Sinar VIP AI Promo Code Unlocked!**\n\nUse code **`SINARAI10`** at checkout to get **10% OFF** your first order ✨\n\nHappy shopping!",
      isPromoCode: true,
      quickReplies: [
        { label_mm: "🛍️ အလှဆုံး ဝတ်စုံများ ကြည့်မည်", label_en: "🛍️ Shop Trending Styles", prompt: "Show me trending outfits" },
        { label_mm: "🚚 ပို့ဆောင်ခ တွက်ချက်မည်", label_en: "🚚 Calculate Delivery", prompt: "Delivery and shipping info" },
      ],
    }
  }

  // ── 7. SIZE MEASUREMENTS (e.g. "160cm 48kg") ──
  const cmMatch = query.match(/(\d{2,3})\s*(?:cm|အရပ်)/i)
  const kgMatch = query.match(/(\d{2,3})\s*(?:kg|ပေါင်|lb|weight)/i)
  const bustMatch = query.match(/(\d{2,3})\s*(?:bust|ရင်|ရင်ဝိုင်း)/i)

  if (cmMatch || kgMatch || bustMatch) {
    const heightCm = cmMatch ? parseInt(cmMatch[1]) : undefined
    const weightKg = kgMatch ? parseInt(kgMatch[1]) : undefined
    const bustCm = bustMatch ? parseInt(bustMatch[1]) : undefined

    const rec = calculateRecommendedSize({ heightCm, weightKg, bustCm })
    const sizeText = isMm
      ? `✨ သင့်ရဲ့ တိုင်းတာမှုအရ အသင့်တော်ဆုံး Size မှာ **Size ${rec.size}** ဖြစ်ပါတယ်ရှင်!\n\n${rec.reason_mm}\n\nအောက်ပါ စတိုင်လ်လှလှလေးတွေထဲက Size ${rec.size} ရရှိနိုင်တဲ့ ပစ္စည်းများကို ကြည့်ရှုနိုင်ပါတယ်ရှင် 👇`
      : `✨ Based on your measurements, we recommend **Size ${rec.size}**!\n\n${rec.reason_en}\n\nHere are some gorgeous pieces available in Size ${rec.size} 👇`

    const matchingProducts = catalog.filter((p) => p.sizes?.includes(rec.size)).slice(0, 3)
    return {
      sender: "bot",
      text: sizeText,
      products: matchingProducts.length > 0 ? matchingProducts : catalog.slice(0, 3),
      quickReplies: [
        { label_mm: "🛍️ Shop အားလုံးကြည့်မည်", label_en: "🛍️ View All Shop", prompt: "Show all products" },
        { label_mm: "🚚 ပို့ဆောင်ခ မေးမည်", label_en: "🚚 Delivery Info", prompt: "Delivery and shipping info" },
      ],
    }
  }

  // ── 8. SIZE GUIDE PROMPT ──
  if (query.includes("size") || query.includes("ဆိုဒ်") || query.includes("အရွယ်") || query.includes("တိုင်းတာ")) {
    return {
      sender: "bot",
      text: isMm
        ? "📏 **Sinar Size Advisor** မှ ကြိုဆိုပါတယ်ရှင်!\n\nသင့်ရဲ့ အရပ် (cm)၊ ကိုယ်အလေးချိန် (kg) သို့မဟုတ် ရင်ဝိုင်း အတိုင်းအတာကို စာရိုက်ပို့ပေးပါရှင် (ဥပမာ- `162 cm 50 kg` သို့မဟုတ် `bust 85 cm`)။ သင့်တော်မယ့် Size ကို ချက်ချင်း တွက်ချက်ပေးပါမည်။"
        : "📏 **Sinar Size Advisor**:\nPlease enter your height (cm), weight (kg), or bust size (e.g. `162 cm 50 kg` or `bust 85 cm`). I will calculate the best fitting size for you!",
      isSizeCalculator: true,
      quickReplies: [
        { label_mm: "155-160cm (Size S)", label_en: "155-160cm (Size S)", prompt: "158 cm 45 kg" },
        { label_mm: "160-165cm (Size M)", label_en: "160-165cm (Size M)", prompt: "162 cm 52 kg" },
        { label_mm: "165-170cm (Size L)", label_en: "165-170cm (Size L)", prompt: "166 cm 58 kg" },
      ],
    }
  }

  // ── 9. DELIVERY & SHIPPING ──
  if (query.includes("delivery") || query.includes("deli") || query.includes("ပို့ခ") || query.includes("ပို့ဆောင်") || query.includes("ship") || query.includes("myitkyina") || query.includes("မြစ်ကြီးနား") || query.includes("kachin") || query.includes("yangon") || query.includes("mandalay")) {
    return {
      sender: "bot",
      text: isMm
        ? "🚚 **ပို့ဆောင်ခနှင့် ကြာချိန်များ**:\n\n• **မြစ်ကြီးနားမြို့တွင်း**: ၁,၀၀၀ ~ ၂,၅၀၀ Ks (တစ်ရက်အတွင်း အိမ်အရောက် ငွေချေ Cash on Delivery ရပါသည်)\n• **ကချင်ပြည်နယ်တွင်း** (ဝိုင်းမော်၊ မိုးညှင်း၊ ဗန်းမော်၊ ဖားကန့်): ၃,၀၀၀ ~ ၄,၀၀၀ Ks (၂-၃ ရက်အတွင်း)\n• **နယ်မြို့များ** (မန္တလေး၊ ရန်ကုန်၊ အခြားမြို့များ): ဂိတ်ချ သို့မဟုတ် အမြန်ချောပို့ဖြင့် ၄,၅၀၀ ~ ၅,၀၀၀ Ks (KPay / WavePay)\n\nအော်ဒါတင်ချင်ပါက ကြိုက်နှစ်သက်ရာ ပစ္စည်းကို ရွေးချယ်ပြီး တိုက်ရိုက် ဝယ်ယူနိုင်ပါတယ်ရှင်! 🛍️"
        : "🚚 **Delivery & Shipping Info**:\n\n• **Myitkyina (in town)**: 2,000 – 2,500 Ks (same day–1 day, Cash on Delivery available)\n• **Kachin State** (Waingmaw, Mohnyin, Bhamo, Hpakant): 3,000 – 4,000 Ks (2–3 days)\n• **Mandalay / Yangon / other regions**: 4,500 – 5,000 Ks by highway bus gate or express courier (KPay / WavePay accepted).\n\nYou can easily add items to bag or order directly via Messenger & Viber! 🛍️",
      quickReplies: [
        { label_mm: "💳 ငွေပေးချေနည်းများ", label_en: "💳 Payment Methods", prompt: "How can I pay?" },
        { label_mm: "👗 ဝတ်စုံများ ကြည့်မည်", label_en: "👗 Browse Outfits", prompt: "Show me trending outfits" },
      ],
    }
  }

  // ── 10. PAYMENT METHODS ──
  if (query.includes("pay") || query.includes("kpay") || query.includes("wave") || query.includes("ငွေချေ") || query.includes("ရှင်းနည်း") || query.includes("kbz")) {
    return {
      sender: "bot",
      text: isMm
        ? "💳 **ငွေပေးချေမှု နည်းလမ်းများ**:\n\n1. **Cash on Delivery (COD)**: မြစ်ကြီးနားနှင့် ဝိုင်းမော်မြို့တွင်း ပစ္စည်းရောက်မှ ငွေချေနိုင်ပါသည်\n2. **KBZPay / WavePay**: လွယ်ကူလျင်မြန်စွာ ငွေလွှဲပေးချေနိုင်ပါသည်\n3. **Mobile Banking**: KBZ, CB, AYA, A-Bank အားလုံး လက်ခံပါသည်\n\nမည်သည့် အခွန်/ထပ်ဆောင်းခမှ မရှိပါရှင် ✨"
        : "💳 **Payment Methods**:\n\n1. **Cash on Delivery (COD)** available in Myitkyina & Waingmaw\n2. **KBZPay & WavePay** instant transfers\n3. **Mobile Banking** (KBZ, CB, AYA, A-Bank)\n\nZero hidden fees & 100% secure! ✨",
      quickReplies: [
        { label_mm: "🛍️ Shop သို့ သွားမည်", label_en: "🛍️ Visit Shop", prompt: "Show all products" },
        { label_mm: "💬 Admin နှင့် တိုက်ရိုက်ပြောမည်", label_en: "💬 Chat with Admin", prompt: "Connect me with shop admin" },
      ],
    }
  }

  // ── 11. PRICE BUDGET ──
  const priceMatch = query.match(/(?:under|<|အောက်|less than)\s*(\d{2,6})/i) || query.match(/(\d{2,6})\s*(?:အောက်|ks|ကျပ်)/i)
  if (priceMatch || query.includes("cheap") || query.includes("budget") || query.includes("သက်သာ")) {
    const budget = priceMatch ? parseInt(priceMatch[1]) : 25000
    const matched = catalog.filter((p) => p.price <= budget)

    return {
      sender: "bot",
      text: isMm
        ? `💰 **${budget.toLocaleString()} Ks အောက်** ချစ်စရာ ဝတ်စုံလေးများကို ရွေးချယ်ပေးထားပါတယ်ရှင် ✨`
        : `💰 Here are our lovely handpicked styles **under ${budget.toLocaleString()} Ks** ✨`,
      products: matched.length > 0 ? matched : catalog.slice(0, 3),
      quickReplies: [
        { label_mm: "🌸 Floral Blouses", label_en: "🌸 Floral Blouses", prompt: "Floral blouse" },
        { label_mm: "☕ Date Look", label_en: "☕ Date Look", prompt: "Outfit idea for a cafe date" },
      ],
    }
  }

  // ── 12. CASUAL CAFE / DATE LOOK ──
  if (query.includes("date") || query.includes("cafe") || query.includes("coffee") || query.includes("casual") || query.includes("ချိန်းတွေ့") || query.includes("ရိုးရှင်း")) {
    const matched = catalog.filter((p) =>
      p.category === "Tops" || p.category === "Cardigans" || p.category === "Dresses"
    ).slice(0, 3)

    return {
      sender: "bot",
      text: isMm
        ? "☕ **Cafe & Casual Date Look** အတွက် သက်တောင့်သက်သာရှိပြီး အလွန်ချစ်စရာကောင်းတဲ့ ပေါ့ပါးမှုရှိသော စတိုင်လ်လေးတွေကို အကြံပြုပေးလိုက်ပါတယ်ရှင်! Linen Blouse ဒါမှမဟုတ် Knit Cardigan လေးနဲ့ တွဲဖက်ဝတ်ဆင်ရင် အရမ်းဓာတ်ပုံလှပါတယ် ✨"
        : "☕ **Cafe & Casual Date Look**:\nFor a cozy, photogenic cafe vibe, we recommend soft pastels, a relaxed linen blouse, or an elegant knit cardigan. Effortlessly aesthetic! ✨",
      products: matched.length > 0 ? matched : catalog.slice(0, 3),
      quickReplies: [
        { label_mm: "👗 Dress လေးတွေ ကြည့်မည်", label_en: "👗 Show Dresses", prompt: "Show me dresses" },
        { label_mm: "📏 Size ဘယ်လိုရွေးရမလဲ", label_en: "📏 Size Advisor", prompt: "Help me find my size" },
      ],
    }
  }

  // ── 13. DRESSES ──
  if (query.includes("dress") || query.includes("ဂါဝန်") || query.includes("ဝတ်စုံ")) {
    const matched = catalog.filter((p) => p.category === "Dresses")
    return {
      sender: "bot",
      text: isMm
        ? "👗 **Sinar ပွဲတိုး အလှဂါဝန်များ**:\nပေါ့ပါးလန်းဆန်းပြီး ပုံကျလှပစေမယ့် Midi & Maxi ဝတ်စုံလေးတွေ ဖြစ်ပါတယ်ရှင် 👇"
        : "👗 **Sinar Curated Dresses**:\nFlowy, feminine, and photogenic dresses crafted for every special moment 👇",
      products: matched.length > 0 ? matched : catalog.slice(0, 3),
      quickReplies: [
        { label_mm: "🧥 Cardigan လေးတွေ ကြည့်မည်", label_en: "🧥 Show Cardigans", prompt: "Show me cardigans" },
        { label_mm: "🚚 ပို့ဆောင်ခ မေးမည်", label_en: "🚚 Delivery Info", prompt: "Delivery and shipping info" },
      ],
    }
  }

  // ── 14. TOPS / BLOUSE ──
  if (query.includes("top") || query.includes("blouse") || query.includes("shirt") || query.includes("အင်္ကျီ") || query.includes("ရှပ်")) {
    const matched = catalog.filter((p) => p.category === "Tops")
    return {
      sender: "bot",
      text: isMm
        ? "🌸 **ချစ်စရာ Tops & Blouse အင်္ကျီလေးများ**:\nLinen အသားကောင်းဖြင့် ချုပ်လုပ်ထားပြီး နေ့စဉ် ဝတ်ဆင်ရ လွယ်ကူသက်တောင့်သက်သာ ရှိပါတယ်ရှင် 👇"
        : "🌸 **Trending Tops & Blouses**:\nBreathable, high-quality fabrics that pair seamlessly with high-waist jeans or skirts 👇",
      products: matched.length > 0 ? matched : catalog.slice(0, 3),
      quickReplies: [
        { label_mm: "👖 Jeans ဘောင်းဘီများ", label_en: "👖 Show Jeans", prompt: "Show me jeans" },
        { label_mm: "📏 Size အကြံပြုချက်", label_en: "📏 Size Advisor", prompt: "Help me find my size" },
      ],
    }
  }

  // ── 15. CARDIGAN / SWEATER / KNITWEAR ──
  if (query.includes("cardigan") || query.includes("sweater") || query.includes("knit") || query.includes("ဆွယ်တာ") || query.includes("ကာဒီဂင်")) {
    const matched = catalog.filter((p) => p.category === "Cardigans" || p.category === "Sweaters")
    return {
      sender: "bot",
      text: isMm
        ? "🧶 **Cozy Knit Cardigans & Sweaters**:\nနူးညံ့ပြီး ဓာတ်ပုံလှတဲ့ Beige & Ivory အရောင်သန်း knitwear လေးတွေ ဖြစ်ပါတယ်ရှင် 👇"
        : "🧶 **Cozy Knitwear & Cardigans**:\nSoft textures in warm aesthetic tones, perfect for layering and cafe dates 👇",
      products: matched.length > 0 ? matched : catalog.slice(0, 3),
      quickReplies: [
        { label_mm: "👗 Dress လေးတွေ ကြည့်မည်", label_en: "👗 Show Dresses", prompt: "Show me dresses" },
        { label_mm: "💰 25,000 Ks အောက်", label_en: "💰 Under 25,000 Ks", prompt: "Show items under 25000 Ks" },
      ],
    }
  }

  // ── 16. JEANS / PANTS ──
  if (query.includes("jean") || query.includes("pants") || query.includes("bottom") || query.includes("ဘောင်းဘီ") || query.includes("ဂျင်း")) {
    const matched = catalog.filter((p) => p.category === "Jeans")
    return {
      sender: "bot",
      text: isMm
        ? "👖 **High Waist Jeans & Bottoms**:\nခန္ဓာကိုယ် အချိုးအစားကို ပိုမိုလှပပေါ်လွင်စေမယ့် Premium High Waist ဂျင်းဘောင်းဘီလေးတွေ ဖြစ်ပါတယ်ရှင် 👇"
        : "👖 **High Waist Jeans & Bottoms**:\nFlattering high-waist cuts designed for all-day comfort and effortless styling 👇",
      products: matched.length > 0 ? matched : catalog.slice(0, 3),
      quickReplies: [
        { label_mm: "🌸 Tops အင်္ကျီများ", label_en: "🌸 Show Tops", prompt: "Show me blouses and tops" },
        { label_mm: "📏 Size အကြံပြုချက်", label_en: "📏 Size Advisor", prompt: "Help me find my size" },
      ],
    }
  }

  // ── 17. GREETING ──
  if (query.includes("hi") || query.includes("hello") || query.includes("မင်္ဂလာ") || query.includes("hey") || query.includes("sabaidee")) {
    return {
      sender: "bot",
      text: isMm
        ? "မင်္ဂလာပါရှင်! 🙏 **Sinar AI Fashion Stylist** မှ ကြိုဆိုပါတယ်။\n\nသင့်အတွက် အသင့်တော်ဆုံး ဝတ်စုံလေးတွေ ရွေးချယ်ပေးဖို့ အသင့်ရှိနေပါတယ်ရှင်။ ဘယ်လို စတိုင်လ် သို့မဟုတ် အခမ်းအနားအတွက် ဝတ်ဆင်ချင်ပါသလဲရှင်?"
        : "Hello & welcome to **Sinar AI Fashion Stylist**! ✨\n\nI'm your personal styling assistant. Whether you're looking for a wedding guest dress, casual cafe look, sizing advice, or gift ideas, I'm here to help!",
      products: catalog.slice(0, 3),
      quickReplies: INITIAL_QUICK_REPLIES.slice(0, 4),
    }
  }

  // General Matching by keyword
  const filtered = catalog.filter((p) => {
    const matchEn = p.name_en.toLowerCase().includes(query)
    const matchMm = p.name_mm ? p.name_mm.includes(query) : false
    const matchCat = p.category ? p.category.toLowerCase().includes(query) : false
    return matchEn || matchMm || matchCat
  })

  if (filtered.length > 0) {
    return {
      sender: "bot",
      text: isMm
        ? `✨ သင်ရှာဖွေနေသော **"${rawInput}"** နှင့် ကိုက်ညီတဲ့ ချစ်စရာ ပစ္စည်းလေးများကို တွေ့ရှိထားပါတယ်ရှင် 👇`
        : `✨ Here are the matching pieces for **"${rawInput}"** from our curated collection 👇`,
      products: filtered,
      quickReplies: [
        { label_mm: "📏 Size အကြံပြုချက်", label_en: "📏 Size Advisor", prompt: "Help me find my size" },
        { label_mm: "🚚 ပို့ဆောင်ခ မေးမည်", label_en: "🚚 Delivery Info", prompt: "Delivery and shipping info" },
      ],
    }
  }

  // Catch-all
  return {
    sender: "bot",
    text: isMm
      ? `✨ **"${rawInput}"** အတွက် Sinar ရဲ့ လူကြိုက်အများဆုံး Trending စတိုင်လ်လေးတွေကို အကြံပြုပေးလိုက်ပါတယ်ရှင်!\n\nSize ရွေးချယ်မှု၊ မင်္ဂလာဆောင်ဝတ်စုံ၊ ပို့ဆောင်ခ သို့မဟုတ် သီးသန့်စတိုင်လ် တွဲဖက်မှုများအတွက်လည်း မေးမြန်းနိုင်ပါတယ်ရှင်။`
      : `✨ Here are some of our top trending styles that you might love!\n\nFeel free to ask me for wedding guest dresses, sizes, outfit pairings, or delivery information anytime.`,
    products: catalog.slice(0, 3),
    quickReplies: INITIAL_QUICK_REPLIES.slice(0, 4),
  }
}

// ── Optional Gemini 1.5 API Integration ──
async function callGeminiStylist(
  query: string,
  catalog: Product[],
  lang: "mm" | "en",
  apiKey: string
): Promise<Omit<BotMessage, "id" | "timestamp"> | null> {
  const isMm = lang === "mm"

  const catalogSummary = catalog.map((p) => ({
    id: p.id,
    name_en: p.name_en,
    name_mm: p.name_mm,
    category: p.category,
    price: p.price,
    sizes: p.sizes,
  }))

  const systemInstruction = `You are the chic, polite, and helpful AI Fashion Stylist & Sales Assistant for "Sinar Clothing" - an aesthetic boutique clothing brand based in Myitkyina, Kachin State, Myanmar.
Language requested: ${isMm ? "Burmese (Myanmar Unicode)" : "English"}.
Available products in catalog: ${JSON.stringify(catalogSummary)}.
Key policies:
- Wedding/Event/Gala dresses: Recommend Dresses (e.g. Pastel Midi Dress, Flowy Maxi Dress) paired with Cardigans.
- Delivery: Myitkyina in-town (2000-2500 Ks, COD same day-1 day), Kachin State towns (3000-4000 Ks), Mandalay / Yangon / other regions (4500-5000 Ks, bus gate / express).
- Payment: KBZPay, WavePay, Mobile Banking, COD.
- Phone/Viber: ${SITE.viber}, WhatsApp: ${SITE.whatsapp}.

Instructions:
1. Provide a warm, fashionable, concise styling answer (max 3-4 sentences).
2. If recommending specific products from the catalog, list their exact IDs in a JSON array format at the end: [PRODUCT_IDS: id1, id2].
3. Be enthusiastic, warm, and stylish.`

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemInstruction}\n\nCustomer question: "${query}"` }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 350,
      },
    }),
  })

  if (!res.ok) return null
  const data = await res.json()
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!rawText) return null

  let cleanText = rawText
  let productIds: string[] = []

  const idMatch = rawText.match(/\[PRODUCT_IDS:\s*([^\]]+)\]/i)
  if (idMatch) {
    cleanText = rawText.replace(idMatch[0], "").trim()
    productIds = idMatch[1].split(",").map((s: string) => s.trim().replace(/['"]/g, ""))
  }

  const matchedProducts = productIds.length > 0
    ? catalog.filter((p) => productIds.includes(String(p.id)))
    : catalog.slice(0, 3)

  return {
    sender: "bot",
    text: cleanText,
    products: matchedProducts.length > 0 ? matchedProducts : undefined,
    quickReplies: INITIAL_QUICK_REPLIES.slice(0, 3),
  }
}

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  MessageCircle,
  Send,
  User,
  Bot,
  ShieldCheck,
  Phone,
  Clock,
  Sparkles,
  RefreshCw,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  Receipt,
  Eye,
  Check,
  Globe,
  Share2,
} from "lucide-react"
import {
  type BotMessage,
  type CustomerSession,
  type PaymentSlipData,
  ADMIN_CHAT_EVENT,
  CUSTOMER_INQUIRY_EVENT,
  LIVE_CHAT_STORAGE_KEY,
  dispatchAdminMessage,
} from "@/lib/botEngine"
import { SITE } from "@/config"
import { playLuxuryChime, playCashChime } from "@/lib/soundEffects"

const QUICK_REPLIES = [
  "မင်္ဂလာပါရှင်! Sinar ဆိုင်ရှင်ကိုယ်တိုင် ဖြေကြားပေးနေပါတယ်ရှင် ✨",
  "ဝတ်စုံနှင့် ပတ်သက်ပြီး Size (S, M, L) အားလုံး In Stock အသင့်ရှိပါတယ်ရှင်။",
  "ယနေ့ အော်ဒါတင်ပေးပါက မနက်ဖြန် အိမ်အရောက် ပို့ဆောင်ပေးပါမည်ရှင် 🚚",
  "KBZPay / WavePay: 09790543312 သို့ ငွေလွှဲပေးချေနိုင်ပါသည်ရှင် 💳",
  "မင်္ဂလာဆောင်နှင့် ပွဲတက်အတွက် Pastel Midi Dress ကို အထူး အကြံပြုပါရစေရှင် 👰",
]

const DEFAULT_SESSIONS: CustomerSession[] = [
  {
    id: "session-cust-1",
    customerName: "Ma May Thazin",
    phone: "09790543312",
    channel: "web",
    lastMessage: "မင်္ဂလာဆောင် ပွဲတက်ဖို့ dress လေးတွေ ရှိမလားရှင်?",
    timestamp: "10:45 AM",
    unreadCount: 1,
    isLiveAdminConnected: true,
    messages: [
      {
        id: "msg-1",
        sender: "user",
        text: "မင်္ဂလာဆောင် ပွဲတက်ဖို့ dress လေးတွေ ရှိမလားရှင်?",
        timestamp: "10:45 AM",
      },
      {
        id: "msg-2",
        sender: "bot",
        text: "👰✨ မင်္ဂလာဆောင်အတွက် Pastel Midi Dress နှင့် Flowy Maxi Dress လေးတွေကို အကြံပြုပါရစေရှင်!",
        timestamp: "10:45 AM",
      },
    ],
  },
  {
    id: "session-cust-2",
    customerName: "Ko Min Thu",
    phone: "09987654321",
    channel: "messenger",
    lastMessage: "KBZPay ဖြင့် ငွေ ၃၅,၀၀၀ Ks လွှဲထားပါသည်ရှင် (Slip Attached)",
    timestamp: "11:20 AM",
    unreadCount: 1,
    isLiveAdminConnected: false,
    messages: [
      {
        id: "msg-3",
        sender: "user",
        text: "KBZPay ဖြင့် ငွေ ၃၅,၀၀၀ Ks လွှဲထားပါသည်ရှင်",
        timestamp: "11:20 AM",
        paymentSlip: {
          image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
          method: "KBZPay",
          amount: "35,000 Ks",
          date: "Today, 11:19 AM",
          status: "pending",
        },
      },
    ],
  },
]

export default function AdminLiveChat() {
  const [sessions, setSessions] = useState<CustomerSession[]>(() => {
    try {
      const saved = localStorage.getItem(LIVE_CHAT_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return DEFAULT_SESSIONS
  })

  const [activeSessionId, setActiveSessionId] = useState<string>(sessions[0]?.id || "session-cust-1")
  const [replyInput, setReplyInput] = useState("")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [channelFilter, setChannelFilter] = useState<"all" | "web" | "messenger" | "viber">("all")
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0]

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LIVE_CHAT_STORAGE_KEY, JSON.stringify(sessions))
    } catch {}
  }, [sessions])

  // Listen to Customer Inquiries in Real Time + Sound Notification
  useEffect(() => {
    const handleCustomerEvent = (e: any) => {
      const { sessionId, message, customerName, phone, channel } = e.detail || {}
      if (!sessionId || !message) return

      // Play Luxury Chime
      if (soundEnabled) {
        if (message.paymentSlip) {
          playCashChime()
        } else {
          playLuxuryChime()
        }
      }

      setSessions((prev) => {
        const existing = prev.find((s) => s.id === sessionId)
        if (existing) {
          return prev.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  lastMessage: message.text,
                  timestamp: message.timestamp,
                  unreadCount: s.id === activeSessionId ? 0 : s.unreadCount + 1,
                  messages: [...s.messages, message],
                }
              : s
          )
        }

        // New Session
        const newSession: CustomerSession = {
          id: sessionId,
          customerName: customerName || "Live Visitor",
          phone: phone || "-",
          channel: channel || "web",
          lastMessage: message.text,
          timestamp: message.timestamp,
          unreadCount: 1,
          messages: [message],
          isLiveAdminConnected: true,
        }
        return [newSession, ...prev]
      })

      toast.info(`🔔 New Customer Inquiry from ${customerName || "Visitor"}`)
    }

    window.addEventListener(CUSTOMER_INQUIRY_EVENT, handleCustomerEvent)
    return () => window.removeEventListener(CUSTOMER_INQUIRY_EVENT, handleCustomerEvent)
  }, [activeSessionId, soundEnabled])

  const handleSendAdminReply = (textToSend?: string) => {
    const text = (textToSend || replyInput).trim()
    if (!text || !activeSession) return

    setReplyInput("")

    // Dispatch message to customer widget
    const adminMsg = dispatchAdminMessage(activeSession.id, text, "Sinar Admin")

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              lastMessage: `Admin: ${text}`,
              timestamp: adminMsg.timestamp,
              isLiveAdminConnected: true,
              messages: [...s.messages, adminMsg],
            }
          : s
      )
    )

    toast.success("Message sent to customer widget! 🚀")
  }

  const handleVerifySlip = (msgId: string) => {
    if (!activeSession) return

    // Update slip status to verified
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              messages: s.messages.map((m) =>
                m.id === msgId && m.paymentSlip
                  ? { ...m, paymentSlip: { ...m.paymentSlip, status: "verified" } }
                  : m
              ),
            }
          : s
      )
    )

    // Dispatch verification message to customer
    handleSendAdminReply(
      "🎉 သင်၏ ငွေလွှဲပြေစာ (Payment Slip) ကို ဆိုင်ရှင်မှ စစ်ဆေးအတည်ပြုပြီးပါပြီရှင်! အော်ဒါကို မနက်ဖြန် အိမ်အရောက် ပို့ဆောင်ပေးပါမည်။ ကျေးဇူးတင်ပါတယ်ရှင် ✨"
    )

    toast.success("Payment Slip Verified & Confirmation Sent! 💳")
  }

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    toast.info("Chat session removed")
  }

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id)
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, unreadCount: 0 } : s))
    )
  }

  const filteredSessions = sessions.filter((s) => {
    if (channelFilter === "all") return true
    return s.channel === channelFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F2415] border border-[#1C3020] p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C08A78] to-[#0A1A0F] flex items-center justify-center text-white shadow-lg border border-[#C08A78]/30">
            <MessageCircle className="w-6 h-6 text-[#FAF6EF]" />
          </div>
          <div>
            <h2 className="font-serif text-2xl text-[#F5F0E8] flex items-center gap-2">
              Customer Live Chat Inbox
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-sans font-semibold border border-emerald-500/30">
                Live Active
              </span>
            </h2>
            <p className="text-xs text-[#7A8F7D] mt-0.5">
              Reply directly to customers visiting Sinar Boutique in real-time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Notification Toggle */}
          <button
            onClick={() => {
              setSoundEnabled((p) => !p)
              toast.info(soundEnabled ? "Audio chime muted" : "Audio chime activated 🔔")
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
              soundEnabled
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-[#1C3020] bg-[#0A1A0F] text-[#7A8F7D]"
            }`}
            title="Toggle Sound Notification"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? "Sound ON" : "Sound Muted"}</span>
          </button>

          <button
            onClick={() => setSessions(DEFAULT_SESSIONS)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#1C3020] bg-[#0A1A0F] hover:bg-[#122B19] text-xs font-semibold text-[#7A8F7D] hover:text-[#F5F0E8] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Chats</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT: Customer Sessions List (4 Cols) ── */}
        <div className="lg:col-span-4 bg-[#0F2415] border border-[#1C3020] rounded-2xl p-4 space-y-3">
          {/* Channel Filters */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0A1A0F] border border-[#1C3020] text-[10px]">
            <button
              onClick={() => setChannelFilter("all")}
              className={`flex-1 py-1 rounded-lg font-bold transition-all ${
                channelFilter === "all" ? "bg-[#C08A78] text-white" : "text-[#7A8F7D] hover:text-[#F5F0E8]"
              }`}
            >
              All ({sessions.length})
            </button>
            <button
              onClick={() => setChannelFilter("web")}
              className={`flex-1 py-1 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
                channelFilter === "web" ? "bg-[#C08A78] text-white" : "text-[#7A8F7D] hover:text-[#F5F0E8]"
              }`}
            >
              <Globe className="w-2.5 h-2.5" /> Web
            </button>
            <button
              onClick={() => setChannelFilter("messenger")}
              className={`flex-1 py-1 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
                channelFilter === "messenger" ? "bg-[#C08A78] text-white" : "text-[#7A8F7D] hover:text-[#F5F0E8]"
              }`}
            >
              <MessageCircle className="w-2.5 h-2.5" /> FB Page
            </button>
          </div>

          <div className="space-y-2 max-h-[560px] overflow-y-auto">
            {filteredSessions.map((session) => {
              const active = session.id === activeSession?.id

              return (
                <button
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all relative ${
                    active
                      ? "bg-[#163520] border-[#C08A78] shadow-md"
                      : "bg-[#0A1A0F]/60 border-[#1C3020] hover:border-[#2D5A3D]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#C08A78]/20 border border-[#C08A78]/30 flex items-center justify-center text-[#C08A78] font-bold text-xs">
                        {session.customerName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-[#F5F0E8]">{session.customerName}</p>
                          {session.channel === "messenger" && (
                            <span className="text-[8px] px-1 py-0.2 rounded bg-blue-500/20 text-blue-300">
                              FB Page
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#7A8F7D] font-mono">{session.phone}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] text-[#7A8F7D]">{session.timestamp}</span>
                      {session.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-[#C08A78] text-white text-[9px] font-bold flex items-center justify-center">
                          {session.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-[#B0C4B5] mt-2 line-clamp-1 opacity-80">
                    {session.lastMessage}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── RIGHT: Active Chat & Reply Console (8 Cols) ── */}
        <div className="lg:col-span-8 bg-[#0F2415] border border-[#1C3020] rounded-2xl flex flex-col h-[650px] overflow-hidden">
          {activeSession ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-[#1C3020] bg-[#0A1A0F]/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C08A78]/20 border border-[#C08A78]/40 flex items-center justify-center text-[#C08A78] font-bold text-sm">
                    {activeSession.customerName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#F5F0E8] flex items-center gap-2">
                      {activeSession.customerName}
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-normal">
                        Online
                      </span>
                      {activeSession.channel === "messenger" && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                          Facebook Messenger
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] text-[#7A8F7D]">
                      Phone: <span className="font-mono text-[#F5F0E8]">{activeSession.phone}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-[#1C3020] bg-[#0A1A0F] hover:bg-[#25D366]/20 text-[#7A8F7D] hover:text-[#25D366] transition-colors"
                    title="Open WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  <a
                    href={SITE.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-[#1C3020] bg-[#0A1A0F] hover:bg-blue-500/20 text-[#7A8F7D] hover:text-blue-400 transition-colors"
                    title="Open Facebook Page Inbox"
                  >
                    <Share2 className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDeleteSession(activeSession.id)}
                    className="p-2 rounded-xl border border-[#1C3020] bg-[#0A1A0F] hover:bg-red-500/20 text-[#7A8F7D] hover:text-red-400 transition-colors"
                    title="Delete Conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs font-sans">
                {activeSession.messages.map((msg, i) => {
                  const isUser = msg.sender === "user"
                  const isAdmin = msg.sender === "admin"

                  return (
                    <div
                      key={msg.id || i}
                      className={`flex flex-col ${isUser ? "items-start" : "items-end"}`}
                    >
                      <div
                        className={`flex items-start gap-2.5 max-w-[80%] ${
                          isUser ? "flex-row" : "flex-row-reverse"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                            isAdmin
                              ? "bg-[#C08A78] text-white ring-2 ring-[#C08A78]/30"
                              : isUser
                              ? "bg-[#1D3F2C] text-[#FAF6EF]"
                              : "bg-[#06150C] text-[#C08A78] border border-[#C08A78]/30"
                          }`}
                        >
                          {isAdmin ? <ShieldCheck className="w-4 h-4" /> : isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                        </div>

                        <div
                          className={`p-3.5 rounded-2xl leading-relaxed ${
                            isAdmin
                              ? "bg-gradient-to-r from-[#C08A78] to-[#A76F5B] text-white rounded-tr-sm shadow-md"
                              : isUser
                              ? "bg-[#0A1A0F] border border-[#1C3020] text-[#F5F0E8] rounded-tl-sm"
                              : "bg-[#122B19] border border-[#1C3020] text-[#7A8F7D] rounded-tr-sm"
                          }`}
                        >
                          {isAdmin && (
                            <span className="text-[9px] font-bold uppercase tracking-wider block mb-1 text-cream/90 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> Shop Owner Reply
                            </span>
                          )}

                          {/* Payment Slip Attachment View */}
                          {msg.paymentSlip && (
                            <div className="mb-2 p-2.5 rounded-xl bg-black/40 border border-[#C08A78]/40 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold text-[#C08A78] flex items-center gap-1">
                                  <Receipt className="w-3 h-3" /> {msg.paymentSlip.method} Slip
                                </span>
                                <span
                                  className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                                    msg.paymentSlip.status === "verified"
                                      ? "bg-emerald-500/20 text-emerald-300"
                                      : "bg-amber-500/20 text-amber-300"
                                  }`}
                                >
                                  {msg.paymentSlip.status}
                                </span>
                              </div>

                              <div
                                onClick={() => setPreviewImage(msg.paymentSlip?.image || null)}
                                className="relative rounded-lg overflow-hidden border border-[#1C3020] cursor-pointer group"
                              >
                                <img
                                  src={msg.paymentSlip.image}
                                  alt="Payment Slip"
                                  className="w-full max-h-40 object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] gap-1 transition-opacity">
                                  <Eye className="w-3 h-3" /> Zoom
                                </div>
                              </div>

                              {msg.paymentSlip.amount && (
                                <p className="text-[10px] text-cream">
                                  Amount: <strong>{msg.paymentSlip.amount}</strong>
                                </p>
                              )}

                              {msg.paymentSlip.status === "pending" && (
                                <button
                                  onClick={() => handleVerifySlip(msg.id)}
                                  className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Verify & Confirm Order</span>
                                </button>
                              )}
                            </div>
                          )}

                          <p className="font-mm">{msg.text}</p>
                        </div>
                      </div>
                      <span className="text-[9px] text-[#7A8F7D] mt-1 px-1">{msg.timestamp}</span>
                    </div>
                  )
                })}
              </div>

              {/* Quick Reply Suggestions */}
              <div className="px-4 py-2 border-t border-[#1C3020] bg-[#0A1A0F]/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-[9px] uppercase font-bold text-[#C08A78] flex-shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Quick:
                </span>
                {QUICK_REPLIES.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendAdminReply(reply)}
                    className="px-2.5 py-1 rounded-full border border-[#1C3020] bg-[#0F2415] hover:border-[#C08A78] hover:text-[#C08A78] text-[10px] text-[#B0C4B5] whitespace-nowrap transition-colors"
                  >
                    {reply.length > 25 ? reply.slice(0, 25) + "..." : reply}
                  </button>
                ))}
              </div>

              {/* Reply Input Bar */}
              <div className="p-4 border-t border-[#1C3020] bg-[#0A1A0F]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendAdminReply()
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    placeholder="Type direct reply to customer (e.g. မင်္ဂလာပါရှင်...)"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#1C3020] bg-[#0F2415] text-xs text-[#F5F0E8] placeholder-[#4A6350] focus:outline-none focus:border-[#C08A78] transition-colors font-mm"
                  />
                  <button
                    type="submit"
                    disabled={!replyInput.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#C08A78] hover:bg-[#A76F5B] disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#7A8F7D]">
              <MessageCircle className="w-12 h-12 mb-2 opacity-40" />
              <p className="text-sm font-bold text-[#F5F0E8]">No Active Customer Selected</p>
              <p className="text-xs mt-1">Select a customer inquiry from the left list to start replying</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <div
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-xl max-h-[85vh] rounded-2xl overflow-hidden border border-[#C08A78] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

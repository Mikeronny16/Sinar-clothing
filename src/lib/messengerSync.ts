/**
 * Sinar Facebook Messenger & Webhook Sync Helper
 * Connects Facebook Page Messenger Inquiries into the Sinar Admin Live Chat Console
 */

import { CUSTOMER_INQUIRY_EVENT, type BotMessage, type CustomerSession } from "./botEngine"
import { SITE } from "@/config"

export interface MessengerWebhookPayload {
  senderId: string
  senderName?: string
  messageText: string
  timestamp?: string
}

/**
 * Ingests an incoming message from Facebook Messenger or external webhook
 * and displays it live in the Admin Live Chat console
 */
export function ingestMessengerInquiry(payload: MessengerWebhookPayload): CustomerSession {
  const time = payload.timestamp || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const sessionId = `fb-${payload.senderId}`

  const message: BotMessage = {
    id: `fb-msg-${Date.now()}`,
    sender: "user",
    text: payload.messageText,
    timestamp: time,
  }

  const session: CustomerSession = {
    id: sessionId,
    customerName: payload.senderName || `FB Customer (${payload.senderId.slice(-4)})`,
    phone: "Facebook Messenger",
    channel: "messenger",
    lastMessage: payload.messageText,
    timestamp: time,
    unreadCount: 1,
    messages: [message],
    isLiveAdminConnected: true,
  }

  // Dispatch into Admin Live Chat Console in real-time
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(CUSTOMER_INQUIRY_EVENT, {
        detail: {
          sessionId,
          message,
          customerName: session.customerName,
          phone: session.phone,
          channel: "messenger",
        },
      })
    )
  }

  return session
}
